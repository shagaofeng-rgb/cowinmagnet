import assert from "node:assert/strict";
import test from "node:test";
import { productMetaDescription } from "../lib/productMetaDescription.ts";

test("long made-to-order product descriptions stay complete and under 160 characters", () => {
  const text = productMetaDescription(
    "CBZ type rotary automatic magnetic separator",
    "powder, granule, liquid and slurry processing"
  );
  assert.ok(text.length <= 160);
  assert.match(text, /\.$/);
  assert.doesNotMatch(text, /\.\.\.$/);
  assert.match(text, /CBZ type rotary automatic magnetic separator/);
});
