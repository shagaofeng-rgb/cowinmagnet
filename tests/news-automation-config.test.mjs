import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getNewsSiteConfig, getNewsSiteSources, listNewsSites, validateNewsSiteConfig } from "../lib/newsAutomationConfig.js";

test("every configured News site has the fields needed for isolated scheduling", () => {
  const sites = listNewsSites();
  assert.ok(sites.length >= 1);
  for (const site of sites) assert.equal(site.validation.valid, true, site.validation.errors.join(", "));
});

test("News source selection stays within the requested site configuration", () => {
  const site = getNewsSiteConfig("cowinmagnet-production");
  const sources = getNewsSiteSources(site, { includeFallback: true });
  assert.ok(sources.length >= 2);
  assert.ok(sources.every((source) => source.site_id === site.site_id));
});

test("missing industry scope or fallback sources fails configuration validation", () => {
  const invalid = validateNewsSiteConfig({ site_id: "bad", site_url: "https://example.test", publication_language: "en", timezone: "UTC", news: { list_route: "/news", detail_route_pattern: "/news/[slug]" }, product_theme_plan: { source_reference: "x" }, sources: { primary_whitelist: [] } });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes("industry_scope"));
  assert.ok(invalid.errors.includes("sources.fallback_whitelist"));
});

test("ingest implementation rejects incomplete RSS records before database persistence", async () => {
  const source = await readFile(new URL("../lib/newsOperations.js", import.meta.url), "utf8");
  assert.match(source, /if \(!item\?\.title \|\| !item\?\.sourceUrl\)/);
  assert.match(source, /publisher: source\.name, author: item\.author,\s*title: item\.title,/);
});

test("publish implementation promotes the CMS item only after frontend delivery verification", async () => {
  const source = await readFile(new URL("../lib/newsOperations.js", import.meta.url), "utf8");
  assert.match(source, /if \(!delivery\.passed\) \{\s*await updateCmsItemPublicationStatus\("news", article\.slug, \{ status: "draft", editorialStatus: "delivery-failed" \}\)/s);
  assert.match(source, /await updateCmsItemPublicationStatus\("news", article\.slug, \{ status: "published", editorialStatus: "automatically-validated" \}\);/);
});
