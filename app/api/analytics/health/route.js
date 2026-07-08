import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function withTimeout(promise, timeoutMs) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("analytics-health-timeout")), timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const snapshot = await withTimeout(getAnalyticsSnapshot({ days: 1 }), 1500);

    return Response.json(
      {
        ok: true,
        status: "ok",
        storageMode: snapshot.storageMode,
        databaseStatus: snapshot.databaseStatus,
        databaseError: snapshot.databaseError,
        pageViews: snapshot.overview.pageViews,
        uniqueVisitors: snapshot.overview.uniqueVisitors,
        sessions: snapshot.overview.sessions,
        visitorRows: snapshot.visitors.length,
        generatedAt: snapshot.generatedAt
      },
      { headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    return Response.json(
      {
        ok: true,
        status: "degraded",
        storageMode: "unknown",
        databaseStatus: "timeout",
        databaseError: "Analytics health check timed out; admin analytics can still use cached snapshots.",
        pageViews: 0,
        uniqueVisitors: 0,
        sessions: 0,
        visitorRows: 0,
        generatedAt: new Date().toISOString()
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
