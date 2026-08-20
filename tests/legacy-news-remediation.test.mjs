import assert from "node:assert/strict";
import test from "node:test";
import { createLegacyNewsRemediation } from "../lib/legacyNewsRemediation.js";

test("legacy News remediation preserves historical date and produces a clean structured guide", () => {
  const result = createLegacyNewsRemediation({ slug: "magnetic-separation-cement-conveyor-update", title: "Legacy title", sourceUrl: "https://example.com/story", sourceTitle: "A cement conveyor handling update", publishedAt: "2026-06-01T00:00:00.000Z" });
  assert.equal(result.validation.passed, true, result.validation.errors.join(","));
  assert.equal(result.document.publishedAt, "2026-06-01T00:00:00.000Z");
  assert.equal(result.document.contentType, "technical-guide");
  assert.equal(result.document.sections.length, 6);
  assert.doesNotMatch(JSON.stringify(result.document), /Update Note|Industry Perspective|Cowinmagnet View/i);
});
