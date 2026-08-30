import { appendAnalyticsEvent, normalizeAnalyticsEvent } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.text();
  if (!body.trim()) return new Response(null, { status: 204 });

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  try {
    const event = normalizeAnalyticsEvent(payload, request);
    const result = await appendAnalyticsEvent(event);
    return Response.json({ ok: Boolean(result?.ok), eventType: event.type, storageMode: result?.storageMode || "unknown" }, { status: result?.ok ? 200 : 202 });
  } catch (error) {
    console.error("Analytics tracking failed", error);
    return Response.json({ ok: false }, { status: 400 });
  }
}
