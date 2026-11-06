import assert from "node:assert/strict";
import test from "node:test";
import { localesForIndexablePath, publicLocales } from "../lib/localeIndexing.js";
import { canonicalEntries } from "../lib/sitemap/core.js";

const site = "https://www.cowinmagnet.com";

test("reviewed translations have reciprocal, self-referencing sitemap alternates", () => {
  for (const path of ["/", "/about", "/contact"]) {
    const entries = canonicalEntries(path, "2026-11-06", site, localesForIndexablePath(path));
    assert.equal(entries.length, publicLocales.length);
    for (const entry of entries) {
      const byLanguage = Object.fromEntries(entry.alternates.map(({ hreflang, href }) => [hreflang, href]));
      assert.deepEqual(Object.keys(byLanguage), [...publicLocales, "x-default"]);
      assert.ok(Object.values(byLanguage).includes(entry.loc));
      assert.equal(byLanguage["x-default"], entries[0].loc);
    }
  }
});

test("technical profiles and articles awaiting review stay English-only in the sitemap", () => {
  for (const path of ["/products/rcyd", "/blog/example", "/news/example"]) {
    const [entry, second] = canonicalEntries(path, "2026-11-06", site, localesForIndexablePath(path));
    assert.equal(second, undefined);
    assert.deepEqual(entry.alternates.map(({ hreflang }) => hreflang), ["en", "x-default"]);
  }
});
