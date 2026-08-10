import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("known legacy URLs with equivalent current content have permanent redirects", async () => {
  const source = await readFile(new URL("../next.config.js", import.meta.url), "utf8");

  for (const value of [
    "/industries/food-processing",
    "/applications/waste-processing",
    "/applications/incineration-plant",
    "/products/electromagnetic-control-cabinet",
    "/products/automatic-cleaning-magnetic-separators-for-iron-scrap-waste",
    "/blog/magnetic-separator-for-waste-recycling-lines"
  ]) {
    assert.match(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.equal((source.match(/permanent: true/g) || []).length >= 18, true);
});
