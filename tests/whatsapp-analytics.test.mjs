import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("WhatsApp tracking records click intent with placement context, not a fabricated conversation outcome", async () => {
  const tracker = await source("components/AnalyticsTracker.jsx");
  const floatingButton = await source("components/WhatsAppFloatingButton.tsx");
  const store = await source("lib/analyticsStore.js");

  assert.match(tracker, /status:\s*"clicked"/);
  assert.match(floatingButton, /data-whatsapp-placement="floating"/);
  assert.match(tracker, /eventType === "click_whatsapp"/);
  assert.match(store, /const WHATSAPP_EVENT_TYPES = new Set\(\["click_whatsapp", "whatsapp_click"\]\)/);
  assert.match(store, /status:\s*"clicked"/);
  assert.doesNotMatch(store, /status:\s*"replied"/);
  assert.doesNotMatch(store, /status:\s*"qualified"/);
});

test("WhatsApp analysis preserves product context and supports visitor-path review through protected APIs", async () => {
  const product = await source("components/ProductDetailExperience.tsx");
  const database = await source("lib/analyticsDatabase.js");
  const dashboard = await source("components/admin/WhatsAppAnalyticsPanel.jsx");
  const overviewRoute = await source("app/api/admin/analytics/whatsapp/route.js");
  const journeyRoute = await source("app/api/admin/analytics/whatsapp/journey/route.js");

  assert.match(product, /data-whatsapp-product-slug/);
  assert.match(product, /data-whatsapp-product-name/);
  assert.match(database, /analytics_events_whatsapp_placement_time_idx/);
  assert.match(database, /payload->'whatsapp' AS whatsapp/);
  assert.match(dashboard, /查看路径/);
  assert.match(overviewRoute, /requireAdminApi/);
  assert.match(await source("app/admin/(protected)/whatsapp/page.jsx"), /getAdminSession/);
  assert.match(await source("app/admin/(protected)/whatsapp/page.jsx"), /if \(!session\) redirect\("\/admin\/login"\)/);
  assert.match(journeyRoute, /requireAdminApi/);
  assert.match(journeyRoute, /readAnalyticsVisitorJourney/);
});
