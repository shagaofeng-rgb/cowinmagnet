import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("News publisher persists a validated structured document and verifies before success", async () => {
  const source = await readFile(new URL("../lib/newsOperations.js", import.meta.url), "utf8");
  const store = await readFile(new URL("../lib/newsAutomationStore.js", import.meta.url), "utf8");
  assert.match(source, /validateArticleDocument\(article\.document\)/);
  assert.match(store, /document_json/);
  assert.match(source, /contentType: document\.contentType/);
  assert.match(source, /48-hour publication interval has not elapsed/);
  assert.match(source, /AbortController/);
  assert.match(source, /fetchNewsWithTimeout\(fetcher, "https:\/\/api\.openai\.com\/v1\/responses"/);
  assert.match(source, /News detail verification/);
  assert.match(source, /NEWS_DELIVERY_TIMEOUT_MS/);
  assert.match(source, /recoverStaleNewsPublishWork/);
});

test("public News pages use the structured renderer instead of raw MarkdownContent", async () => {
  const [localized, defaultRoute] = await Promise.all([
    readFile(new URL("../app/[locale]/news/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/news/[slug]/page.tsx", import.meta.url), "utf8")
  ]);
  for (const source of [localized, defaultRoute]) {
    assert.match(source, /NewsDetailView/);
    assert.doesNotMatch(source, /MarkdownContent/);
  }
});
