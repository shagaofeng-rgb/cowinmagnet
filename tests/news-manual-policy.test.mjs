import test from "node:test";
import assert from "node:assert/strict";
import { assessNewsContent, isIndexableNews } from "../lib/newsContentPolicy.js";

test("published manual News remains visible and indexable", () => {
  const result = assessNewsContent({ status: "published", title: "Manual company update" });
  assert.equal(result.indexable, true);
  assert.equal(result.visibleInListings, true);
  assert.equal(isIndexableNews({ status: "published" }), true);
});

test("draft, archived and noindex manual News remains excluded", () => {
  assert.equal(isIndexableNews({ status: "draft" }), false);
  assert.equal(isIndexableNews({ status: "published", archived: true }), false);
  assert.equal(isIndexableNews({ status: "published", seoIndexable: false }), false);
});
