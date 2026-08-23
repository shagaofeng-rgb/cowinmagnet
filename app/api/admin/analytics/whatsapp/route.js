import { requireAdminApi } from "@/lib/adminApi";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const range = getAdminDateRange(new URL(request.url).searchParams);
  const snapshot = await getAnalyticsSnapshot({
    ...range,
    cache: false,
    preferStoredSnapshot: false
  });

  return Response.json(snapshot.whatsapp || {}, {
    headers: { "Cache-Control": "private, no-store" }
  });
}
