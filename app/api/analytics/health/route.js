import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getAnalyticsSnapshot({ days: 1 });

  return Response.json({
    ok: true,
    storageMode: snapshot.storageMode,
    databaseStatus: snapshot.databaseStatus,
    databaseError: snapshot.databaseError,
    pageViews: snapshot.overview.pageViews,
    uniqueVisitors: snapshot.overview.uniqueVisitors,
    sessions: snapshot.overview.sessions,
    visitorRows: snapshot.visitors.length,
    generatedAt: snapshot.generatedAt
  });
}
