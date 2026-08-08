import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/product-application-catalog.json" with { type: "json" };
import { newsFingerprint, parseNewsRssItems, validateNewsArticle } from "../lib/newsOperationsRules.js";

test("RSS parsing keeps title, URL and publication date", () => {
  const items = parseNewsRssItems(`<?xml version="1.0"?><rss><channel><item><title><![CDATA[Recycling line update]]></title><link>https://example.com/article</link><pubDate>Fri, 08 Aug 2026 00:00:00 GMT</pubDate><description>Short source fact</description></item></channel></rss>`);
  assert.deepEqual(items, [{ title: "Recycling line update", sourceUrl: "https://example.com/article", publishedAt: "Fri, 08 Aug 2026 00:00:00 GMT", summary: "Short source fact", author: "" }]);
});

test("quality gate rejects a short article without independent evidence", () => {
  const result = validateNewsArticle({ title: "Short", metaTitle: "Short", metaDescription: "Short", slug: "short", primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: [], articleMarkdown: "Too short", sourceClaims: [], mediaPlan: [] }, { catalog });
  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("requires-two-to-four-independent-sources"));
  assert.ok(result.errors.includes("article-must-have-at-least-1200-words"));
});

test("quality gate accepts a valid original article envelope", () => {
  const words = Array.from({ length: 1210 }, () => "engineering").join(" ");
  const article = {
    title: "C&D recycling conveyor protection", metaTitle: "C&D Conveyor Protection | COWIN MAGNET", metaDescription: "Selection notes for a self-cleaning magnet before a recycling crusher, with source-based process context and an inquiry checklist.", slug: "cd-recycling-conveyor-protection",
    primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: ["rcyd-type-permanent-magnet-self-dumping-iron-remover"], articleMarkdown: words,
    sourceClaims: [{ sourceUrl: "https://source-one.example/article" }, { sourceUrl: "https://source-two.example/article" }], mediaPlan: [{ kind: "product-image", url: "/assets/products/rcyd.jpg" }, { kind: "self-made-process-diagram", url: "/images/news/process.svg" }]
  };
  const result = validateNewsArticle(article, { catalog });
  assert.equal(result.passed, true);
  assert.equal(result.contentFingerprint, newsFingerprint(`${article.title}\n${words}`));
});

test("quality gate rejects a diagram plan without a local media path", () => {
  const words = Array.from({ length: 1210 }, () => "engineering").join(" ");
  const article = {
    title: "C&D recycling conveyor protection", metaTitle: "C&D Conveyor Protection | COWIN MAGNET", metaDescription: "Selection notes for a self-cleaning magnet before a recycling crusher, with source-based process context and an inquiry checklist.", slug: "cd-recycling-conveyor-protection-no-diagram",
    primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: ["rcyd-type-permanent-magnet-self-dumping-iron-remover"], articleMarkdown: words,
    sourceClaims: [{ sourceUrl: "https://source-one.example/article" }, { sourceUrl: "https://source-two.example/article" }], mediaPlan: [{ kind: "product-image", url: "/assets/products/rcyd.jpg" }, { kind: "self-made-process-diagram" }]
  };
  const result = validateNewsArticle(article, { catalog });
  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("requires-local-licensed-industry-media-or-self-made-diagram"));
});
