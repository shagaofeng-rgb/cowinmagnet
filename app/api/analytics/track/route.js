import { appendAnalyticsEvent, normalizeAnalyticsEvent } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const payload = await request.json();
    const event = normalizeAnalyticsEvent(payload, request);
    const result = await appendAnalyticsEvent(event);
    return Response.json({ ok: Boolean(result?.ok), eventType: event.type, storageMode: result?.storageMode || "unknown" }, { status: result?.ok ? 200 : 202 });
  } catch (error) {
    console.error("Analytics tracking failed", error);
    return Response.json({ ok: false }, { status: 400 });
  }
}
