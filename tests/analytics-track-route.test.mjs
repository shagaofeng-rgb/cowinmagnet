import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("analytics tracking accepts an empty beacon without logging a JSON parse failure", async () => {
  const source = await readFile(new URL("../app/api/analytics/track/route.js", import.meta.url), "utf8");
  assert.match(source, /if \(!body\.trim\(\)\) return new Response\(null, \{ status: 204 \}\)/);
  assert.match(source, /error: "invalid-json"/);
  assert.doesNotMatch(source, /await request\.json\(\)/);
  assert.match(source, /status: result\?\.ok \? 200 : 503/);
});

test("analytics health does not report database outages as healthy zero traffic", async () => {
  const source = await readFile(new URL("../app/api/analytics/health/route.js", import.meta.url), "utf8");
  assert.match(source, /status: healthy \? 200 : 503/);
  assert.match(source, /recentEventCount: null/);
  assert.doesNotMatch(source, /ok: true,[\s\S]*status: "degraded"/);
});

test("marked visual audits and known operator browsers are excluded from customer analytics", async () => {
  const store = await readFile(new URL("../lib/analyticsStore.js", import.meta.url), "utf8");
  const visualAudit = await readFile(new URL("../scripts/visual-qa-capture.mjs", import.meta.url), "utf8");
  assert.match(store, /ANALYTICS_EXCLUDED_VISITOR_IDS/);
  assert.match(store, /excludedVisitorIds\(\)\.has\(String\(event\.visitorId\)\)/);
  assert.match(store, /ANALYTICS_QUALITY_VERSION = "customer-events-v5"/);
  assert.match(visualAudit, /auditUrl\.searchParams\.set\("utm_source", "automation"\)/);
});
