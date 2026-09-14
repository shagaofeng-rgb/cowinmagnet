import assert from "node:assert/strict";
import test from "node:test";
import { buildMetaEventPayload, buildMetaUserData, createMetaEventId } from "../lib/metaConversions.js";

test("Meta CAPI user data hashes valid identifiers and omits absent identifiers", () => {
  const userData = buildMetaUserData({
    email: " Sales@Example.com ",
    phone: "+1 (555) 010-2000",
    visitorId: "visitor-123",
    fbp: "fb.1.1.abc",
    clientIp: "203.0.113.20",
    clientUserAgent: "Test browser"
  });

  assert.match(userData.em[0], /^[a-f0-9]{64}$/);
  assert.match(userData.ph[0], /^[a-f0-9]{64}$/);
  assert.match(userData.external_id[0], /^[a-f0-9]{64}$/);
  assert.equal(userData.fbp, "fb.1.1.abc");
  assert.equal("fbc" in userData, false);
});

test("Meta CAPI payload accepts Cowin URLs only and keeps a caller supplied event id", () => {
  const payload = buildMetaEventPayload({
    eventName: "Lead",
    eventId: "lead-123",
    eventTime: 1789359759,
    eventSourceUrl: "https://cowinmagnet.com/products/magnetic-pulley?utm_source=meta",
    userData: { em: ["hash"] },
    customData: { content_name: "Magnetic pulley", content_ids: ["magnetic-pulley"], ignored: "value" }
  });

  assert.equal(payload.data[0].event_id, "lead-123");
  assert.equal(payload.data[0].event_source_url, "https://www.cowinmagnet.com/products/magnetic-pulley?utm_source=meta");
  assert.deepEqual(payload.data[0].custom_data, { content_name: "Magnetic pulley", content_ids: ["magnetic-pulley"] });
  assert.throws(() => buildMetaEventPayload({ eventName: "Lead", eventSourceUrl: "https://example.com" }));
});

test("Meta event ids are safe unique identifiers", () => {
  const eventId = createMetaEventId("lead");
  assert.match(eventId, /^lead-[0-9a-f-]{36}$/i);
});
