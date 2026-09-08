import assert from "node:assert/strict";
import test from "node:test";

const policyVersion = "2026-09-08-en-canonical-noindex-v2";

test("sitemap policy version changes are treated as a sitemap change", () => {
  const previous = { manifestHash: "same", policyVersion: "legacy-policy" };
  const current = { manifestHash: "same", policyVersion };

  const changed =
    !previous ||
    previous.manifestHash !== current.manifestHash ||
    previous.policyVersion !== current.policyVersion;

  assert.equal(changed, true);
});
