import assert from "node:assert/strict";
import test from "node:test";

import { classifyNewsFamily } from "../lib/newsSourceClassifier.js";

test("classifies mining trade coverage using source and engineering context", () => {
  const family = classifyNewsFamily(
    "A mine updates its ore processing and tailings circuit for the next project stage.",
    "mining-technology.com"
  );

  assert.equal(family?.id, "mineral-processing");
});

test("classifies recycling coverage without requiring an exact product phrase", () => {
  const family = classifyNewsFamily(
    "The recycling facility processes mixed scrap and improves metal recovery from the waste stream.",
    "recyclingtoday.com"
  );

  assert.equal(family?.id, "recycling-sorting");
});

test("rejects unrelated general coverage without a trusted industry source hint", () => {
  assert.equal(classifyNewsFamily("A company announced a general executive appointment.", "example.com"), null);
});
