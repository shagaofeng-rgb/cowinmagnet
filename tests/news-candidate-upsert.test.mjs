import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("candidate refresh is isolated by site and retains candidate lifecycle fields", async () => {
  const source = await readFile(new URL("../lib/newsAutomationStore.js", import.meta.url), "utf8");
  const conflictClause = source.match(/ON CONFLICT \(site_id, source_url\) DO UPDATE SET([\s\S]*?)RETURNING \*/)?.[1] || "";

  for (const field of ["industry", "publisher", "candidate_score", "content_fingerprint"]) {
    assert.match(conflictClause, new RegExp(`${field}\\s*=\\s*EXCLUDED\\.${field}`));
  }
  assert.match(conflictClause, /status\s*=\s*CASE WHEN news_candidates\.status IN \('used','reserved_for_cycle'\)/);
});

test("News storage creates site-scoped fingerprints, locks and delivery records", async () => {
  const source = await readFile(new URL("../lib/newsAutomationStore.js", import.meta.url), "utf8");
  assert.match(source, /news_candidate_fingerprints/);
  assert.match(source, /news_delivery_checks/);
  assert.match(source, /news:\$\{name\}:\$\{siteId\}/);
});

test("candidate refresh does not treat its own stored fingerprints as a duplicate", async () => {
  const [store, operations] = await Promise.all([
    readFile(new URL("../lib/newsAutomationStore.js", import.meta.url), "utf8"),
    readFile(new URL("../lib/newsOperations.js", import.meta.url), "utf8")
  ]);
  assert.match(store, /candidate\.source_url<>\$4/);
  assert.match(operations, /excludeSourceUrl: item\.sourceUrl/);
});

test("source rotation remains a preference instead of blocking daily ingestion", async () => {
  const store = await readFile(new URL("../lib/newsAutomationStore.js", import.meta.url), "utf8");
  const query = store.match(/export async function listNewsSources[\s\S]*?return result\.rows;/)?.[0] || "";
  assert.doesNotMatch(query, /last_used_at\s*<\s*NOW\(\)/);
  assert.match(query, /last_used_at NULLS FIRST/);
});
