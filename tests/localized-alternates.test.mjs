import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("noindex locale metadata does not advertise an hreflang relationship", async () => {
  const source = await readFile(new URL("../lib/i18n.ts", import.meta.url), "utf8");

  assert.match(source, /if \(locale !== defaultLocale\)/);
  assert.match(source, /canonical: absoluteLocalizedUrl\(locale, path\)/);
  assert.match(source, /canonical: absoluteLocalizedUrl\(defaultLocale, path\)/);
  const noindexBranch = source.match(/if \(locale !== defaultLocale\) \{([\s\S]*?)\n  \}\n\n  return/);
  assert.ok(noindexBranch, "the noindex locale branch must remain explicit");
  assert.doesNotMatch(noindexBranch[1], /languages:/, "non-English noindex metadata must not emit hreflang alternates");
});
