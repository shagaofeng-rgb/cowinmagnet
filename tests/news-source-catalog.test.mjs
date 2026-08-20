import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const catalog = JSON.parse(await readFile(new URL("../data/news/source-catalog.seed.json", import.meta.url), "utf8"));

test("the Cowin source catalog preserves all 300 supplied source entries", () => {
  assert.equal(catalog.summary.rawEntries, 300);
  assert.equal(catalog.sources.length, 300);
  assert.equal(catalog.summary.canonicalDomains, 296);
});

test("only explicit public RSS bootstrap sources are immediately eligible", () => {
  const active = catalog.sources.filter((source) => source.active && source.validationStatus === "verified");
  assert.equal(active.length, 6);
  assert.ok(active.every((source) => source.discoveryMethod.includes("rss") && source.robotsAllowed));
  assert.ok(catalog.sources.filter((source) => source.tier === "discovery-only").every((source) => source.active === false));
});
