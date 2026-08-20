import assert from "node:assert/strict";
import test from "node:test";
import { parsePublicNewsPageItems } from "../lib/news/publicPageDiscovery.js";

test("public Article JSON-LD can be discovered without an RSS feed", () => {
  const html = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"NewsArticle","headline":"Conveyor protection update","description":"A process update for bulk materials.","url":"/news/conveyor-protection","datePublished":"2026-08-20T01:00:00Z","author":{"name":"Trade desk"}}</script>`;
  const items = parsePublicNewsPageItems(html, "https://example.test/news");
  assert.deepEqual(items, [{ title: "Conveyor protection update", summary: "A process update for bulk materials.", sourceUrl: "https://example.test/news/conveyor-protection", publishedAt: "2026-08-20T01:00:00Z", author: "Trade desk" }]);
});
