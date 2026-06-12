import http from "node:http";
import assert from "node:assert/strict";
import { buildImagePlan } from "../lib/news-system/image-handler.mjs";

process.env.NEWS_IMAGE_ALLOW_LOCAL_TESTS = "1";

function pngHeader(width, height, extraBytes = 12000) {
  const buffer = Buffer.alloc(33 + extraBytes, 1);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buffer, 0);
  buffer.writeUInt32BE(13, 8);
  buffer.write("IHDR", 12, "ascii");
  buffer.writeUInt32BE(width, 16);
  buffer.writeUInt32BE(height, 20);
  buffer[24] = 8;
  buffer[25] = 2;
  return buffer;
}

const bigPng = pngHeader(1200, 700);
const smallPng = pngHeader(120, 80);

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://127.0.0.1");
  if (url.pathname === "/img/big.png") {
    response.writeHead(200, { "Content-Type": "image/png", "Content-Length": bigPng.length });
    response.end(bigPng);
    return;
  }
  if (url.pathname === "/img/small.png" || url.pathname === "/img/logo.png") {
    response.writeHead(200, { "Content-Type": "image/png", "Content-Length": smallPng.length });
    response.end(smallPng);
    return;
  }
  if (url.pathname === "/img/404.png") {
    response.writeHead(404);
    response.end("missing");
    return;
  }
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  if (url.pathname === "/og") {
    response.end(`<html><head><meta property="og:image" content="/img/big.png"></head><body></body></html>`);
    return;
  }
  if (url.pathname === "/twitter") {
    response.end(`<html><head><meta name="twitter:image" content="/img/big.png"></head><body></body></html>`);
    return;
  }
  if (url.pathname === "/jsonld") {
    response.end(`<script type="application/ld+json">{"@type":"NewsArticle","image":"/img/big.png"}</script>`);
    return;
  }
  if (url.pathname === "/body") {
    response.end(`<article><img src="/img/big.png" alt="Official project image"></article>`);
    return;
  }
  if (url.pathname === "/bad") {
    response.end(`<html><head><meta property="og:image" content="/img/404.png"><meta name="twitter:image" content="/img/small.png"></head></html>`);
    return;
  }
  if (url.pathname === "/logo") {
    response.end(`<html><head><meta property="og:image" content="/img/logo.png"></head></html>`);
    return;
  }
  response.end("<html><body>No image</body></html>");
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const base = `http://127.0.0.1:${port}`;

async function plan(path, item = {}) {
  return buildImagePlan(
    { title: "Fixture news", sourceName: "Fixture Source", url: `${base}${path}`, ...item },
    { category: "Fixture", recommendedProducts: [] },
    { slug: "fixture-news", title: "Fixture news" }
  );
}

try {
  assert.equal((await plan("/og")).sourceImage.imageKind, "og:image");
  assert.equal((await plan("/twitter")).sourceImage.imageKind, "twitter:image");
  assert.equal((await plan("/jsonld")).sourceImage.imageKind, "json-ld:image");
  assert.equal((await plan("/body")).sourceImage.imageKind, "body:first-image");
  assert.equal((await plan("/bad")).sourceImage.imageKind, "twitter:image");
  assert.equal((await plan("/logo")).sourceImage.imageKind, "og:image");
  assert.equal((await plan("/none")).sourceImage.imageUsageMode, "none");

  const thumb = await plan("/none", { imageUrl: `${base}/img/big.png` });
  assert.equal(thumb.sourceImage.imageKind, "source-thumbnail");
  assert.equal(thumb.sourceImage.imageWidth, 1200);

  delete process.env.NEWS_IMAGE_ALLOW_LOCAL_TESTS;
  const blocked = await buildImagePlan(
    { title: "SSRF", sourceName: "Localhost", url: `${base}/og` },
    { category: "", recommendedProducts: [] },
    { slug: "blocked", title: "Blocked" }
  );
  assert.equal(blocked.sourceImage.imageStatus, "failed");
  assert.equal(blocked.sourceImage.imageFailureReason, "unsafe-source-url");

  console.log("news image extractor tests passed");
} finally {
  server.close();
}
