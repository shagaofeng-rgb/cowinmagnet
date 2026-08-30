import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("analytics tracking accepts an empty beacon without logging a JSON parse failure", async () => {
  const source = await readFile(new URL("../app/api/analytics/track/route.js", import.meta.url), "utf8");
  assert.match(source, /if \(!body\.trim\(\)\) return new Response\(null, \{ status: 204 \}\)/);
  assert.match(source, /error: "invalid-json"/);
  assert.doesNotMatch(source, /await request\.json\(\)/);
});
