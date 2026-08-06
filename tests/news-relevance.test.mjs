import assert from "node:assert/strict";
import test from "node:test";
import { hasNewsPublishingRelevance, scoreNewsItem } from "../lib/news-system/scoring.mjs";

test("unrelated food recall does not receive artificial news relevance points", () => {
  const score = scoreNewsItem({
    title: "Organic sliced mushrooms recalled because of Listeria",
    description: "The recall concerns a food safety issue.",
    sourceName: "Food Safety News",
    publishedDate: new Date().toISOString()
  });

  assert.ok(score.relevance_score < 35);
  assert.ok(score.pain_point_score < 25);
  assert.equal(hasNewsPublishingRelevance({
    title: "Organic sliced mushrooms recalled because of Listeria",
    description: "The recall concerns a food safety issue."
  }), false);
});
