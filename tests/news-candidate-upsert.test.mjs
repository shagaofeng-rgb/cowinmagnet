import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("candidate refresh updates classification fields on an existing source URL", async () => {
  const source = await readFile(new URL("../lib/newsOperationsStore.js", import.meta.url), "utf8");
  const conflictClause = source.match(/ON CONFLICT \(source_url\) DO UPDATE SET([\s\S]*?)RETURNING \*/)?.[1] || "";

  for (const field of ["industry", "materials", "process_stage", "product_families", "publisher", "status"]) {
    assert.match(conflictClause, new RegExp(`${field} = EXCLUDED\\.${field}`));
  }
});

test("editorial plan saves preserve database snake-case fields", async () => {
  const source = await readFile(new URL("../lib/newsOperationsStore.js", import.meta.url), "utf8");
  assert.match(source, /plan\.primaryProductId \|\| plan\.primary_product_id/);
  assert.match(source, /plan\.secondaryProductIds \|\| plan\.secondary_product_ids/);
  assert.match(source, /plan\.candidateIds \|\| plan\.candidate_ids/);
});
