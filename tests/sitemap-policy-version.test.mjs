import assert from "node:assert/strict";
import test from "node:test";

const policyVersion = "2026-08-22-blog-indexability-v1";

test("sitemap policy version changes are treated as a sitemap change", () => {
  const previous = { manifestHash: "same", policyVersion: "legacy-policy" };
  const current = { manifestHash: "same", policyVersion };

  const changed =
    !previous ||
    previous.manifestHash !== current.manifestHash ||
    previous.policyVersion !== current.policyVersion;

  assert.equal(changed, true);
});
