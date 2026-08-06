import { NextResponse } from "next/server";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { countAnalyticsEvents, getAnalyticsStorageMode, refreshStoredAnalyticsSnapshots } from "@/lib/analyticsStore";
import { recordSyncJobRun, withSyncJobLock } from "@/lib/syncStatusStore";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isCronAuthorized(request)) {
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
      const processedCount = await countAnalyticsEvents({ days: 1 });
      const snapshotRefresh = await refreshStoredAnalyticsSnapshots(
        ["day"].map((range) => getAdminDateRange(new URLSearchParams({ range })))
      );
      const finishedAt = new Date();

      await recordSyncJobRun({
        jobName: "analytics-sync",
        status: "success",
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        processedCount,
        metadata: {
          cronLogicVersion: "analytics-snapshot-v3",
          cronHeader: request.headers.get("x-vercel-cron") || "",
          userAgent: request.headers.get("user-agent") || "",
          storageMode: getAnalyticsStorageMode(),
          snapshotStrategy: "daily-prewarm; week-and-month-on-demand",
          snapshotRefresh
        }
      });

      return NextResponse.json({
        ok: true,
        status: "success",
        storageMode,
        processedCount,
        snapshotRefresh,
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
