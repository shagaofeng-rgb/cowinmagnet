import assert from "node:assert/strict";
import test from "node:test";

import { classifyNewsFamily } from "../lib/newsSourceClassifier.js";
import { sourceMatchesAllowedHost } from "../lib/newsOperationsRules.js";

const scope = ["mining", "ore", "tailings", "recycling", "metal recovery", "magnetic separation"];

test("classifies mining trade coverage using configured industry scope", () => {
  const family = classifyNewsFamily(
    "A mine updates its ore processing and tailings circuit for the next project stage.",
    "mining-technology.com",
    scope
  );

  assert.match(family?.id || "", /mining|ore|tailings/);
});

test("classifies recycling coverage without requiring an exact product phrase", () => {
  const family = classifyNewsFamily(
    "The recycling facility processes mixed scrap and improves metal recovery from the waste stream.",
    "recyclingtoday.com",
    scope
  );

  assert.match(family?.id || "", /recycling|metal-recovery/);
});

test("rejects unrelated general coverage without a trusted industry source hint", () => {
  assert.equal(classifyNewsFamily("A company announced a general executive appointment.", "example.com", scope), null);
});

test("short scope terms only match whole normalized words", () => {
  assert.equal(classifyNewsFamily("A judge upheld Oregon's packaging law.", "example.com", ["ore", "recycling"]), null);
  assert.equal(classifyNewsFamily("A plant is processing complex ore types.", "example.com", ["ore", "recycling"])?.id, "ore");
});

test("RSS discovery host can be an approved publisher alias", () => {
  assert.equal(sourceMatchesAllowedHost(
    "https://www.im-mining.com/news/example/",
    "internationalmining.com",
    "https://im-mining.com/feed/"
  ), true);
  assert.equal(sourceMatchesAllowedHost(
    "https://unapproved.example/news/example/",
    "internationalmining.com",
    "https://im-mining.com/feed/"
  ), false);
});
