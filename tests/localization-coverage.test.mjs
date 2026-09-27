import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const locales = ["en", "es", "ru", "ar", "fr", "pt"];
const root = new URL("../messages/", import.meta.url);
const dictionaries = Object.fromEntries(locales.map((locale) => [
  locale,
  JSON.parse(readFileSync(new URL(`${locale}.json`, root), "utf8"))
]));

function strings(value, prefix = "") {
  return Object.entries(value).flatMap(([key, item]) => {
    const path = `${prefix}${key}`;
    if (typeof item === "string") return [[path, item]];
    return item && typeof item === "object" ? strings(item, `${path}.`) : [];
  });
}

const sharedNames = new Set([
  "nav.blog", "nav.news", "nav.contact", "nav.applications",
  "home.h1", "blog.eyebrow", "contact.seoTitle", "contact.eyebrow",
  "applications.eyebrow"
]);

test("all public locale dictionaries contain the same text fields", () => {
  const expected = strings(dictionaries.en).map(([key]) => key);
  for (const locale of locales.slice(1)) {
    assert.deepEqual(strings(dictionaries[locale]).map(([key]) => key), expected, `${locale} keys differ from English`);
  }
});

test("localized dictionaries do not silently copy English paragraphs", () => {
  const english = new Map(strings(dictionaries.en));
  for (const locale of locales.slice(1)) {
    const untranslated = strings(dictionaries[locale])
      .filter(([key, value]) => !sharedNames.has(key) && /[A-Za-z]{4}/.test(value) && value === english.get(key))
      .map(([key]) => key);
    assert.deepEqual(untranslated, [], `${locale} has untranslated English strings`);
  }
});
