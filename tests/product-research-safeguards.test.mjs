import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("public catalogue files do not retain legacy source fields", () => {
  const productSource = fs.readFileSync(path.join(root, "data", "products.ts"), "utf8");
  const catalogueSource = fs.readFileSync(path.join(root, "data", "productCatalog.js"), "utf8");
  assert.equal(productSource.includes("sourceUrls"), false);
  assert.equal(productSource.includes("sourceSite"), false);
  assert.equal(catalogueSource.includes("sourceUrls"), false);
  assert.equal(catalogueSource.includes("sourceSite"), false);
  assert.match(catalogueSource, /function publicCatalogueProduct/);
  assert.match(catalogueSource, /specifications: \[\]/);
});

test("private research migration keeps sources and technical facts outside the public CMS payload", () => {
  const migration = fs.readFileSync(path.join(root, "db", "migrations", "20260809_product_research_cards.sql"), "utf8");
  const cmsStore = fs.readFileSync(path.join(root, "lib", "cmsStore.js"), "utf8");
  const researchStore = fs.readFileSync(path.join(root, "lib", "productResearch.js"), "utf8");
  assert.match(migration, /CREATE TABLE IF NOT EXISTS product_research_cards/);
  assert.match(migration, /factual_sources JSONB/);
  assert.match(migration, /confirmed_facts JSONB/);
  assert.match(cmsStore, /privateProductFields/);
  assert.match(researchStore, /getConfirmedProductFactsMap/);
  assert.match(researchStore, /product_id = ANY/);
});

test("public product component contains no editorial workflow labels", () => {
  const page = fs.readFileSync(path.join(root, "components", "ProductDetailExperience.tsx"), "utf8");
  assert.equal(page.includes("Technical content sample"), false);
  assert.equal(page.includes("Technical review in progress"), false);
  assert.equal(page.includes("Model reference"), false);
  assert.match(page, /function technicalRows/);
  assert.match(page, /Supplier-confirmed product record/);
});

test("priority products have separate engineering copy instead of one family-only paragraph", () => {
  const profiles = fs.readFileSync(path.join(root, "data", "productDetailProfiles.ts"), "utf8");
  for (const slug of [
    "rcyb-type-permanent-magnet-manual-iron-remover",
    "rcdb-type-self-cooling-plate-electromagnetic-iron-remover",
    "rcda-type-air-cooled-electromagnetic-iron-remover",
    "rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover",
    "dry-drum-magnetic-separator",
    "magnetic-head-pulley",
    "permanent-overband-magnetic-separator",
    "dls-type-window-metal-detector"
  ]) {
    assert.match(profiles, new RegExp(`"${slug}"`));
  }
});
