import assert from "node:assert/strict";
import test from "node:test";
import { assessNewsContent } from "../lib/newsContentPolicy.js";

test("automated News remains noindex until editorial and technical review are complete", () => {
  const result = assessNewsContent({
    status: "published",
    contentOrigin: "automated-news-collection",
    editorialStatus: "pending-review",
    seoIndexable: false,
    content: "A direct magnetic-separation industry update."
  });

  assert.equal(result.indexable, false);
  assert.equal(result.reason, "seo-indexing-disabled");
});

test("template-like News is archived from public discovery even when marked published", () => {
  const result = assessNewsContent({
    status: "published",
    contentOrigin: "manual",
    seoIndexable: true,
    editorialStatus: "approved",
    technicalReviewer: "Verified reviewer",
    content: "Why It Matters\nIndustry Perspective\nBrand/Product Connection\nBuyer Questions"
  });

  assert.equal(result.indexable, false);
  assert.equal(result.reason, "template-like-content");
});
