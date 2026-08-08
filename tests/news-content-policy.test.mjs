import test from "node:test";
import assert from "node:assert/strict";
import { assessNewsContent, isIndexableNews } from "../lib/newsContentPolicy.js";

test("published News is visible without a manual-review flag", () => {
  const post = { status: "published", editorialStatus: "automatically-validated" };
  assert.equal(isIndexableNews(post), true);
  assert.equal(assessNewsContent(post).reason, "published-news");
});

test("draft, archived and explicitly noindex News remains excluded", () => {
  assert.equal(isIndexableNews({ status: "draft" }), false);
  assert.equal(isIndexableNews({ status: "published", archived: true }), false);
  assert.equal(isIndexableNews({ status: "published", seoIndexable: false }), false);
});
