import assert from "node:assert/strict";
import test from "node:test";
import { assessBlogContent, isIndexableBlog, stripLegacyEditorialSections } from "../lib/blogContentPolicy.js";

test("keeps a clean published Blog indexable", () => {
  assert.equal(isIndexableBlog({ slug: "conveyor-protection-guide", status: "published", content: "## Overview\nUseful engineering guidance." }), true);
});

test("holds legacy editorial artifacts out of search discovery", () => {
  const assessment = assessBlogContent({ slug: "wet-drum-guide", content: "## AI Citation Ready Summary\nInternal publishing notes." });
  assert.equal(assessment.indexable, false);
  assert.equal(assessment.reason, "legacy-editorial-artifact");
});

test("holds malformed legacy slugs out of the sitemap", () => {
  const assessment = assessBlogContent({ slug: "leadingoverband-magnetic-separatorcustom-manufacturer", content: "Published guide." });
  assert.equal(assessment.indexable, false);
  assert.equal(assessment.reason, "malformed-legacy-slug");
});

test("honors an editor's explicit noindex decision", () => {
  assert.deepEqual(assessBlogContent({ slug: "review-pending", seoIndexable: false }), { indexable: false, reason: "explicit-noindex" });
});

test("removes internal legacy sections without removing the engineering article", () => {
  const content = "## Overview\nUseful material handling guidance.\n\n## AI Citation Ready Summary\nInternal notes.\n\n## Conclusion\nConfirm site conditions.";
  assert.equal(stripLegacyEditorialSections(content), "## Overview\nUseful material handling guidance.\n\n## Conclusion\nConfirm site conditions.");
});
