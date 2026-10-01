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
    const healthy = health.databaseStatus === "ok" || health.storageMode === "local-file";

    return Response.json(
      {
        ok: healthy,
        status: healthy ? "ok" : "degraded",
        storageMode: health.storageMode,
        databaseStatus: health.databaseStatus,
        databaseError: health.databaseError,
        recentEventCount: health.recentEventCount,
        generatedAt: health.generatedAt
      },
      { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        status: "degraded",
        storageMode: "unknown",
        databaseStatus: "timeout",
        databaseError: "Analytics health check timed out; admin analytics can still use cached snapshots.",
        recentEventCount: null,
        generatedAt: new Date().toISOString()
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
