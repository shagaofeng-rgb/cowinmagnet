import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildSitemapSnapshotPayload,
  canonicalEntries,
  diffSitemapManifests,
  escapeXml,
  isPublicSitemapContent,
  validateSitemapXml
} from "../lib/sitemap/core.js";
import { atomicWriteJson, withSitemapGenerationLock } from "../lib/sitemap/storage.js";
import {
  maybeSubmitSitemap,
  resetSearchConsoleTokenCacheForTests,
  submitSitemapToSearchConsole
} from "../lib/searchConsoleClient.js";

const siteUrl = "https://www.cowinmagnet.com";

function entry(index, date = "2026-07-10") {
  return { loc: `${siteUrl}/en/test-${index}`, lastmod: date, alternates: [] };
}

test("generates a valid sitemap index and URL sitemap", () => {
  const result = buildSitemapSnapshotPayload({ sections: { pages: [entry(1)] }, siteUrl });
  assert.equal(result.totalUrls, 1);
  assert.equal(validateSitemapXml(result.indexXml, { kind: "index" }).valid, true);
  assert.equal(validateSitemapXml(result.files[0].xml).valid, true);
});

test("escapes XML special characters", () => {
  assert.equal(escapeXml(`a&<>'"`), "a&amp;&lt;&gt;&apos;&quot;");
  const result = buildSitemapSnapshotPayload({ sections: { pages: [{ ...entry("a&b"), loc: `${siteUrl}/en/a%26b` }] }, siteUrl });
  assert.match(result.files[0].xml, /a%26b/);
});

test("filters drafts, archived and noindex content", () => {
  assert.equal(isPublicSitemapContent({ status: "published" }), true);
  assert.equal(isPublicSitemapContent({ status: "draft" }), false);
  assert.equal(isPublicSitemapContent({ status: "archived" }), false);
  assert.equal(isPublicSitemapContent({ status: "published", noindex: true }), false);
});

test("submits only English and x-default hreflang until translations are reviewed", () => {
  const entries = canonicalEntries("/products/test-separator", "2026-07-28", siteUrl);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].loc, `${siteUrl}/en/products/test-separator`);
  assert.deepEqual(
    entries[0].alternates.map((item) => item.hreflang),
    ["en", "x-default"]
  );
});

test("reports deleted URLs in manifest diff", () => {
  const diff = diffSitemapManifests({ a: "2026-01-01", b: "2026-01-01" }, { a: "2026-01-01" });
  assert.deepEqual(diff.removed, ["b"]);
});

test("keeps true lastmod values instead of generation time", () => {
  const result = buildSitemapSnapshotPayload({ sections: { pages: [entry(1, "2024-02-03")] }, siteUrl });
  assert.match(result.files[0].xml, /<lastmod>2024-02-03<\/lastmod>/);
  assert.doesNotMatch(result.files[0].xml, new RegExp(new Date().toISOString().slice(0, 10)));
});

test("splits files when the URL limit is reached", () => {
  const result = buildSitemapSnapshotPayload({ sections: { products: [entry(1), entry(2), entry(3), entry(4), entry(5)] }, siteUrl, maxUrls: 2 });
  assert.equal(result.files.length, 3);
  assert.equal(result.split, true);
});

test("builds a sitemap index that references every chunk", () => {
  const result = buildSitemapSnapshotPayload({ sections: { posts: [entry(1), entry(2), entry(3)] }, siteUrl, maxUrls: 1 });
  assert.equal((result.indexXml.match(/<sitemap>/g) || []).length, 3);
  assert.match(result.indexXml, /\/sitemaps\/sitemap-posts-3\.xml/);
});

test("prevents concurrent local generation jobs", async () => {
  delete process.env.DATABASE_URL;
  let release;
  const first = withSitemapGenerationLock(() => new Promise((resolve) => (release = resolve)));
  await new Promise((resolve) => setTimeout(resolve, 50));
  const second = await withSitemapGenerationLock(async () => "second");
  assert.equal(second.locked, false);
  release("first");
  assert.equal((await first).locked, true);
});

test("retains the old atomic file when serialization fails", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "cowin-sitemap-test-"));
  const file = path.join(directory, "current.json");
  await atomicWriteJson(file, { version: 1 });
  const circular = {};
  circular.self = circular;
  await assert.rejects(() => atomicWriteJson(file, circular));
  assert.deepEqual(JSON.parse(await fs.readFile(file, "utf8")), { version: 1 });
  await fs.rm(directory, { recursive: true, force: true });
});

function searchConsoleEnv(enabled = "true") {
  const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
  process.env.GOOGLE_SEARCH_CONSOLE_ENABLED = enabled;
  process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL = `${siteUrl}/`;
  process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL = `${siteUrl}/sitemap.xml`;
  process.env.GOOGLE_CLIENT_EMAIL = "sitemap-test@example.iam.gserviceaccount.com";
  process.env.GOOGLE_PRIVATE_KEY = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
  resetSearchConsoleTokenCacheForTests();
}

test("submits through the Search Console Sitemaps API", async () => {
  searchConsoleEnv();
  const calls = [];
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method || "GET" });
    if (String(url).includes("oauth2.googleapis.com")) return Response.json({ access_token: "test-token", expires_in: 3600 });
    if (options.method === "PUT") return new Response(null, { status: 204 });
    return new Response("<sitemapindex></sitemapindex>", { status: 200, headers: { "content-type": "application/xml" } });
  };
  const result = await submitSitemapToSearchConsole({ fetchImpl });
  assert.equal(result.success, true);
  assert.equal(calls.some((call) => call.method === "PUT" && call.url.includes("/sitemaps/")), true);
});

test("reports API authentication failure without changing sitemap files", async () => {
  searchConsoleEnv();
  const fetchImpl = async (url) => {
    if (String(url).includes("oauth2.googleapis.com")) return new Response("invalid_grant", { status: 401 });
    return new Response("<xml />", { status: 200, headers: { "content-type": "application/xml" } });
  };
  await assert.rejects(() => submitSitemapToSearchConsole({ fetchImpl }), /OAuth token request failed/);
});

test("does not call Google when submission is disabled", async () => {
  searchConsoleEnv("false");
  const result = await maybeSubmitSitemap({ fetchImpl: async () => assert.fail("fetch should not run") });
  assert.equal(result.attempted, false);
  assert.equal(result.reason, "disabled");
});
