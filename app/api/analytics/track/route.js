import { appendAnalyticsEvent, normalizeAnalyticsEvent } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const payload = await request.json();
    const event = normalizeAnalyticsEvent(payload, request);
    await appendAnalyticsEvent(event);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Analytics tracking failed", error);
    return Response.json({ ok: false }, { status: 400 });
  }
}
