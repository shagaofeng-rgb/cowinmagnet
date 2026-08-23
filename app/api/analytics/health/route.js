import { getAnalyticsHealth } from "@/lib/analyticsStore";

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
    const health = await withTimeout(getAnalyticsHealth(), 3500);

    return Response.json(
      {
        ok: true,
        status: "ok",
        storageMode: health.storageMode,
        databaseStatus: health.databaseStatus,
        databaseError: health.databaseError,
        recentEventCount: health.recentEventCount,
        generatedAt: health.generatedAt
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
        recentEventCount: 0,
        generatedAt: new Date().toISOString()
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
