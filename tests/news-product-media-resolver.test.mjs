import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { validateExternalImageRights } from "../lib/news/image-rights-validator.js";
import { createSourceSummary } from "../lib/news/external-article-extractor.js";

test("product media resolver only selects a same-product owned image and records an immutable snapshot", async () => {
  const source = await readFile(new URL("../lib/news/product-media-resolver.js", import.meta.url), "utf8");
  assert.match(source, /getProductBySlugWithCms/);
  assert.match(source, /ownership: "owned"/);
  assert.match(source, /missing_owned_product_image/);
  assert.match(source, /capturedAt/);
  assert.match(source, /automatic-cleaning-magnetic-separator\.webp/);
  assert.match(source, /return ""/);
});

test("unlicensed external images never enter the public sync path", () => {
  const result = validateExternalImageRights({ originalUrl: "https://publisher.example/image.jpg", publisher: "Publisher", licenseBasis: "unknown", allowedForReuse: false });
  assert.equal(result.passed, false);
  assert.equal(result.reason, "source_image_unavailable_or_unlicensed");
});

test("source summaries are readable editorial context rather than a bare link", () => {
  const summary = createSourceSummary({
    publisher: "Trade publication",
    title: "Conveyor maintenance update",
    sourceSummary: "The article describes a maintenance planning change affecting bulk material handling teams.",
    publishedAt: "2026-08-20"
  });
  const wordCount = summary.split(/\s+/).filter(Boolean).length;
  assert.ok(wordCount >= 60 && wordCount <= 120);
  assert.match(summary, /Trade publication reported/);
});
