import { createHash, randomUUID } from "node:crypto";
import { safeSiteUrl } from "./siteUrlSafety.js";

const DEFAULT_GRAPH_VERSION = "v26.0";
const DEFAULT_TIMEOUT_MS = 4500;
const MAX_EVENT_ID_LENGTH = 100;
const TRANSIENT_STATUS_CODES = new Set([408, 409, 429, 500, 502, 503, 504]);

function environmentValue(name) {
  return String(process.env[name] || "").trim();
}

function enabled() {
  return environmentValue("META_CAPI_ENABLED").toLowerCase() !== "false";
}

function pixelId() {
  return environmentValue("META_CAPI_PIXEL_ID") || environmentValue("NEXT_PUBLIC_META_PIXEL_ID");
}

function accessToken() {
  return environmentValue("META_CAPI_ACCESS_TOKEN");
}

function graphVersion() {
  const value = environmentValue("META_CAPI_GRAPH_VERSION");
  return /^v\d+\.\d+$/.test(value) ? value : DEFAULT_GRAPH_VERSION;
}

function timeoutMs() {
  const value = Number(environmentValue("META_CAPI_TIMEOUT_MS"));
  return Number.isFinite(value) && value >= 1000 && value <= 10000 ? value : DEFAULT_TIMEOUT_MS;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizedEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function normalizedPhone(value) {
  const phone = String(value || "").trim().replace(/[^0-9]/g, "");
  return phone.length >= 7 && phone.length <= 24 ? phone : "";
}

function normalizedExternalId(value) {
  const identifier = String(value || "").trim();
  return identifier && identifier.length <= 200 ? identifier : "";
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== ""));
}

function safeEventId(value) {
  const eventId = String(value || "").trim().slice(0, MAX_EVENT_ID_LENGTH);
  return eventId || randomUUID();
}

function safeCustomData(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const allowedKeys = ["content_name", "content_category", "content_ids", "content_type", "currency", "value"];
  const result = {};
  for (const key of allowedKeys) {
    const item = value[key];
    if (typeof item === "string" && item.trim()) result[key] = item.trim().slice(0, 200);
    if (Array.isArray(item) && key === "content_ids") {
      const ids = item.filter((id) => typeof id === "string" && id.trim()).map((id) => id.trim().slice(0, 100)).slice(0, 20);
      if (ids.length) result[key] = ids;
    }
    if (typeof item === "number" && Number.isFinite(item) && ["value"].includes(key)) result[key] = item;
  }
  return result;
}

export function metaCapiConfiguration() {
  return {
    enabled: enabled(),
    configured: Boolean(enabled() && pixelId() && accessToken()),
    pixelConfigured: Boolean(pixelId()),
    tokenConfigured: Boolean(accessToken()),
    graphVersion: graphVersion()
  };
}

export function createMetaEventId(prefix = "evt") {
  const normalizedPrefix = String(prefix || "evt").replace(/[^a-z0-9_-]/gi, "").slice(0, 20) || "evt";
  return `${normalizedPrefix}-${randomUUID()}`;
}

export function buildMetaUserData({ email, phone, visitorId, fbp, fbc, clientIp, clientUserAgent } = {}) {
  const normalized = compactObject({
    client_ip_address: String(clientIp || "").trim().slice(0, 100),
    client_user_agent: String(clientUserAgent || "").trim().slice(0, 500),
    fbp: String(fbp || "").trim().slice(0, 200),
    fbc: String(fbc || "").trim().slice(0, 200)
  });
  const normalizedEmailValue = normalizedEmail(email);
  const normalizedPhoneValue = normalizedPhone(phone);
  const normalizedExternalIdValue = normalizedExternalId(visitorId);

  if (normalizedEmailValue) normalized.em = [sha256(normalizedEmailValue)];
  if (normalizedPhoneValue) normalized.ph = [sha256(normalizedPhoneValue)];
  if (normalizedExternalIdValue) normalized.external_id = [sha256(normalizedExternalIdValue)];
  return normalized;
}

export function buildMetaEventPayload({ eventName, eventId, eventTime, eventSourceUrl, userData, customData } = {}) {
  const sourceUrl = safeSiteUrl(eventSourceUrl);
  if (!sourceUrl) throw new Error("Meta CAPI event requires a Cowin site URL.");

  const timestamp = Number(eventTime);
  const safeTimestamp = Number.isFinite(timestamp) && timestamp > 0 ? Math.floor(timestamp) : Math.floor(Date.now() / 1000);
  const event = compactObject({
    event_name: String(eventName || "").trim(),
    event_time: safeTimestamp,
    event_id: safeEventId(eventId),
    action_source: "website",
    event_source_url: sourceUrl,
    user_data: compactObject(userData || {}),
    custom_data: safeCustomData(customData)
  });
  if (!event.event_name) throw new Error("Meta CAPI event name is required.");
  return { data: [event] };
}

async function postMetaPayload(payload, configuration) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());
  try {
    const response = await fetch(
      `https://graph.facebook.com/${configuration.graphVersion}/${pixelId()}/events?access_token=${encodeURIComponent(accessToken())}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ...(environmentValue("META_CAPI_TEST_EVENT_CODE") ? { test_event_code: environmentValue("META_CAPI_TEST_EVENT_CODE") } : {})
        }),
        signal: controller.signal
      }
    );
    const responseText = await response.text();
    let responseBody = {};
    try {
      responseBody = responseText ? JSON.parse(responseText) : {};
    } catch {
      responseBody = {};
    }
    return { ok: response.ok, status: response.status, responseBody };
  } finally {
    clearTimeout(timer);
  }
}

export async function sendMetaCapiEvent(input) {
  const configuration = metaCapiConfiguration();
  if (!configuration.configured) return { ok: false, skipped: true, reason: "not-configured" };

  let payload;
  try {
    payload = buildMetaEventPayload(input);
  } catch (error) {
    return { ok: false, skipped: true, reason: "invalid-event", error: error instanceof Error ? error.message : "invalid-event" };
  }

  let result;
  try {
    result = await postMetaPayload(payload, configuration);
    if (!result.ok && TRANSIENT_STATUS_CODES.has(result.status)) result = await postMetaPayload(payload, configuration);
  } catch (error) {
    try {
      result = await postMetaPayload(payload, configuration);
    } catch (retryError) {
      const reason = retryError instanceof Error && retryError.name === "AbortError" ? "timeout" : "network-error";
      console.warn("Meta CAPI delivery did not complete", { eventName: payload.data[0].event_name, reason });
      return { ok: false, reason };
    }
  }

  if (!result.ok) {
    console.warn("Meta CAPI delivery was rejected", {
      eventName: payload.data[0].event_name,
      status: result.status,
      errorCode: result.responseBody?.error?.code || "unknown"
    });
  }
  return { ok: result.ok, status: result.status, eventId: payload.data[0].event_id };
}
