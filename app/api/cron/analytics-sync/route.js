import { NextResponse } from "next/server";
import { getAnalyticsStorageMode, readAnalyticsEvents } from "@/lib/analyticsStore";
import { recordSyncJobRun, withSyncJobLock } from "@/lib/syncStatusStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  const secret = process.env.CRON_SECRET;
  if (!secret) return !process.env.VERCEL;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerSecret = request.headers.get("x-cron-secret");
  const querySecret = new URL(request.url).searchParams.get("secret");
  return [bearer, headerSecret, querySecret].includes(secret);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date();

  const result = await withSyncJobLock("analytics-sync", async ({ locked, storageMode }) => {
    if (!locked) {
      return NextResponse.json({
        ok: true,
        status: "skipped_due_to_lock",
        storageMode
      });
    }

    try {
      const events = await readAnalyticsEvents({ days: 1, limit: 50000 });
      const finishedAt = new Date();
      const processedCount = events.length;

      await recordSyncJobRun({
        jobName: "analytics-sync",
        status: "success",
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        processedCount,
        metadata: {
          storageMode: getAnalyticsStorageMode(),
          eventTypes: [...new Set(events.map((event) => event.type).filter(Boolean))]
        }
      });

      return NextResponse.json({
        ok: true,
        status: "success",
        storageMode,
        processedCount,
        startedAt,
        finishedAt
      });
    } catch (error) {
      const finishedAt = new Date();
      await recordSyncJobRun({
        jobName: "analytics-sync",
        status: "failed",
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        failedCount: 1,
        errorMessage: error?.message || "Analytics sync failed"
      });

      return NextResponse.json(
        {
          ok: false,
          status: "failed",
          error: "Analytics sync failed"
        },
        { status: 500 }
      );
    }
  });

  if (result instanceof Response) return result;
  return NextResponse.json({
    ok: true,
    status: result?.locked === false ? "skipped_due_to_lock" : "completed",
    storageMode: result?.storageMode || "unknown"
  });
}
