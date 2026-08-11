import test from "node:test";
import assert from "node:assert/strict";
import catalog from "../data/product-application-catalog.json" with { type: "json" };
import { newsFingerprint, normalizeGeneratedSourceClaims, parseNewsRssItems, validateNewsArticle } from "../lib/newsOperationsRules.js";

test("RSS parsing keeps title, URL and publication date", () => {
  const items = parseNewsRssItems(`<?xml version="1.0"?><rss><channel><item><title><![CDATA[Recycling line update]]></title><link>https://example.com/article</link><pubDate>Fri, 08 Aug 2026 00:00:00 GMT</pubDate><description>Short source fact</description></item></channel></rss>`);
  assert.deepEqual(items, [{ title: "Recycling line update", sourceUrl: "https://example.com/article", publishedAt: "Fri, 08 Aug 2026 00:00:00 GMT", summary: "Short source fact", author: "" }]);
});

test("generated source claims accept common URL field names and remain candidate-bound", () => {
  const candidates = [
    { id: "one", sourceUrl: "https://one.example/article", publisher: "One" },
    { id: "two", source_url: "https://two.example/article", publisher: "Two" },
  ];
  const claims = normalizeGeneratedSourceClaims([
    { url: "https://one.example/article", title: "First" },
    "https://two.example/article",
    { link: "https://unknown.example/article" },
  ], candidates);
  assert.equal(claims.length, 2);
  assert.deepEqual(claims.map((claim) => claim.candidateId), ["one", "two"]);
  assert.deepEqual(claims.map((claim) => claim.sourceUrl), ["https://one.example/article", "https://two.example/article"]);
});

test("quality gate rejects a short article without independent evidence", () => {
  const result = validateNewsArticle({ title: "Short", metaTitle: "Short", metaDescription: "Short", slug: "short", primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: [], articleMarkdown: "Too short", sourceClaims: [], mediaPlan: [] }, { catalog });
  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("requires-two-to-four-independent-sources"));
  assert.ok(result.errors.includes("article-must-have-at-least-1200-words"));
});

test("quality gate accepts a valid original article envelope", () => {
  const words = `A process change leading to a different selection basis. ${Array.from({ length: 1200 }, () => "engineering").join(" ")}`;
  const article = {
    title: "C&D recycling conveyor protection", metaTitle: "C&D Conveyor Protection | COWIN MAGNET", metaDescription: "Selection notes for a self-cleaning magnet before a recycling crusher, with source-based process context and an inquiry checklist.", slug: "cd-recycling-conveyor-protection",
    primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: ["rcyd-type-permanent-magnet-self-dumping-iron-remover"], articleMarkdown: words,
    sourceClaims: [{ sourceUrl: "https://source-one.example/article" }, { sourceUrl: "https://source-two.example/article" }], mediaPlan: [{ kind: "product-image", url: "/assets/products/rcyd.jpg" }, { kind: "self-made-process-diagram", url: "/images/news/process.svg" }]
  };
  const result = validateNewsArticle(article, { catalog });
  assert.equal(result.passed, true);
  assert.equal(result.contentFingerprint, newsFingerprint(`${article.title}\n${words}`));
});

test("quality gate rejects promotional leadership claims", () => {
  const words = `A world-leading equipment claim. ${Array.from({ length: 1200 }, () => "engineering").join(" ")}`;
  const article = {
    title: "C&D recycling conveyor protection", metaTitle: "C&D Conveyor Protection | COWIN MAGNET", metaDescription: "Selection notes for a self-cleaning magnet before a recycling crusher, with source-based process context and an inquiry checklist.", slug: "cd-recycling-promotional-claim",
    primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: ["rcyd-type-permanent-magnet-self-dumping-iron-remover"], articleMarkdown: words,
    sourceClaims: [{ sourceUrl: "https://source-one.example/article" }, { sourceUrl: "https://source-two.example/article" }], mediaPlan: [{ kind: "product-image", url: "/assets/products/rcyd.jpg" }, { kind: "self-made-process-diagram", url: "/images/news/process.svg" }]
  };

  assert.ok(validateNewsArticle(article, { catalog }).errors.includes("contains-unverified-or-prohibited-claim"));
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

test("quality gate rejects code fences and raw markup", () => {
  const words = Array.from({ length: 1210 }, () => "engineering").join(" ");
  const article = {
    title: "C&D recycling conveyor protection", metaTitle: "C&D Conveyor Protection | COWIN MAGNET", metaDescription: "Selection notes for a self-cleaning magnet before a recycling crusher, with source-based process context and an inquiry checklist.", slug: "cd-recycling-conveyor-protection-markup",
    primaryProductId: "rcyd-type-permanent-magnet-self-dumping-iron-remover", productIds: ["rcyd-type-permanent-magnet-self-dumping-iron-remover"], articleMarkdown: `${words}\n\n\`\`\`html\n<script>alert('bad')</script>\n\`\`\``,
    sourceClaims: [{ sourceUrl: "https://source-one.example/article" }, { sourceUrl: "https://source-two.example/article" }], mediaPlan: [{ kind: "product-image", url: "/assets/products/rcyd.jpg" }, { kind: "self-made-process-diagram", url: "/images/news/process.svg" }]
  };
  const result = validateNewsArticle(article, { catalog });
  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("contains-code-or-raw-markup"));
});
