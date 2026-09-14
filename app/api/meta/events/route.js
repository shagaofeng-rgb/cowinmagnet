import { buildMetaUserData, sendMetaCapiEvent } from "@/lib/metaConversions";
import { safeSiteUrl } from "@/lib/siteUrlSafety";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const ALLOWED_EVENTS = new Set(["Contact"]);
const metaEventRateLimit = globalThis.__cowinMetaEventRateLimit || new Map();
globalThis.__cowinMetaEventRateLimit = metaEventRateLimit;

function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (request.headers.get("x-vercel-id") && forwarded) return forwarded;
  return request.headers.get("x-real-ip") || "";
}

function withinRateLimit(key) {
  const now = Date.now();
  const recent = (metaEventRateLimit.get(key) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  metaEventRateLimit.set(key, recent);
  return recent.length <= RATE_LIMIT_MAX;
}

function sameSiteRequest(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return Boolean(safeSiteUrl(origin));
}

function text(value, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return Response.json({ ok: false, error: "request-too-large" }, { status: 413 });
  }
  if (!sameSiteRequest(request)) return Response.json({ ok: false, error: "invalid-origin" }, { status: 403 });

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ ok: false, error: "invalid-payload" }, { status: 400 });
  }
  if (!ALLOWED_EVENTS.has(body.eventName)) return Response.json({ ok: false, error: "unsupported-event" }, { status: 400 });

  const eventSourceUrl = safeSiteUrl(body.eventSourceUrl);
  if (!eventSourceUrl) return Response.json({ ok: false, error: "invalid-event-source-url" }, { status: 400 });
  const ip = clientIp(request);
  if (!withinRateLimit(`${ip}:${text(body.fbp, 200) || "anonymous"}`)) {
    return Response.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  const result = await sendMetaCapiEvent({
    eventName: body.eventName,
    eventId: text(body.eventId, 100),
    eventSourceUrl,
    userData: buildMetaUserData({
      fbp: text(body.fbp, 200),
      fbc: text(body.fbc, 200),
      clientIp: ip,
      clientUserAgent: request.headers.get("user-agent") || ""
    }),
    customData: {
      content_name: text(body.contentName, 160),
      content_category: text(body.contentCategory, 120)
    }
  });

  return Response.json({ ok: result.ok, skipped: Boolean(result.skipped) }, { status: result.ok || result.skipped ? 202 : 502 });
}
