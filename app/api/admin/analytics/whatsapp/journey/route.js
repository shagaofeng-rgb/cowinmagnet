import { requireAdminApi } from "@/lib/adminApi";
import { readAnalyticsVisitorJourney } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const url = new URL(request.url);
  const visitorId = String(url.searchParams.get("visitorId") || "").slice(0, 80);
  const sessionId = String(url.searchParams.get("sessionId") || "").slice(0, 80);
  const clickedAt = String(url.searchParams.get("clickedAt") || "").slice(0, 60);
  if (!visitorId && !sessionId) {
    return Response.json({ message: "Visitor or session identifier is required" }, { status: 400 });
  }

  const journey = await readAnalyticsVisitorJourney({ visitorId, sessionId, clickedAt });
  return Response.json(journey, {
    headers: { "Cache-Control": "private, no-store" }
  });
}
