import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const taxonomySource = readFileSync(new URL("../lib/homeProductTaxonomy.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(taxonomySource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
const moduleScope = { exports: {} };
runInNewContext(compiled, { module: moduleScope, exports: moduleScope.exports, Map, Object });
const { getHomeProductFamily, homeProductFamilies, homeProductFamilyOverrides } = moduleScope.exports;

const catalogSource = readFileSync(new URL("../data/products.ts", import.meta.url), "utf8");
const productRecords = [...catalogSource.matchAll(/"slug": "([^"]+)"\s*,\s*"name": "([^"]+)"\s*,\s*"category": "([^"]+)"/g)]
  .map((match) => ({ slug: match[1], name: match[2], category: match[3] }));

test("all published static products have exactly one accurate homepage family", () => {
  assert.equal(productRecords.length, 88);
  assert.equal(new Set(productRecords.map((product) => product.slug)).size, productRecords.length);
  assert.equal(homeProductFamilyOverrides.size, 27);
  const counts = Object.fromEntries(homeProductFamilies.map((family) => [family, 0]));
  for (const product of productRecords) counts[getHomeProductFamily(product)] += 1;
  assert.deepEqual(counts, {
    suspended: 21,
    drums: 6,
    separators: 30,
    filters: 20,
    detection: 6,
    industrial: 5,
    other: 0
  });
  assert.equal(Object.values(counts).reduce((sum, count) => sum + count, 0), productRecords.length);
});

test("model-level exceptions avoid misleading broad-catalogue categories", () => {
  const bySlug = new Map(productRecords.map((product) => [product.slug, product]));
  for (const [slug, family] of homeProductFamilyOverrides) {
    assert.ok(bySlug.has(slug), `Unknown override: ${slug}`);
    assert.equal(getHomeProductFamily(bySlug.get(slug)), family);
  }
  assert.equal(getHomeProductFamily(bySlug.get("magnetic-head-pulley")), "drums");
  assert.equal(getHomeProductFamily(bySlug.get("dry-drum-magnetic-separator")), "separators");
  assert.equal(getHomeProductFamily(bySlug.get("magnetic-grid")), "filters");
  assert.equal(getHomeProductFamily(bySlug.get("dls-type-window-metal-detector")), "detection");
  assert.equal(getHomeProductFamily(bySlug.get("electromagnet-separator")), "suspended");
});
