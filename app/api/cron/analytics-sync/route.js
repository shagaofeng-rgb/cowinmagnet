import { NextResponse } from "next/server";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { countAnalyticsEvents, getAnalyticsStorageMode, refreshStoredAnalyticsSnapshots } from "@/lib/analyticsStore";
import { recordSyncJobRun, withSyncJobLock } from "@/lib/syncStatusStore";
import { newsSystemConfig } from "@/config/news-system.config.mjs";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { listRecentJobRuns } from "@/lib/news-system/storage.mjs";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function maybeRunNewsAutomationBackup() {
  if (process.env.NEWS_BACKUP_FROM_ANALYTICS_SYNC === "false") {
    return { enabled: false, status: "disabled" };
  }

  const intervalMs = Number(process.env.NEWS_BACKUP_MIN_INTERVAL_MS || 1000 * 60 * 60 * 3);
  const recentRuns = await listRecentJobRuns(20);
  const lastNewsRun = recentRuns.find((run) => run?.action === "job" && run?.status === "success");
  const lastFinishedAt = lastNewsRun?.finishedAt || lastNewsRun?.generatedAt || lastNewsRun?.startedAt || "";
  const ageMs = lastFinishedAt ? Date.now() - new Date(lastFinishedAt).getTime() : Number.POSITIVE_INFINITY;

  if (Number.isFinite(ageMs) && ageMs < intervalMs) {
    return {
      enabled: true,
      status: "fresh",
      lastFinishedAt,
      ageMinutes: Math.round(ageMs / 60000)
    };
  }

  const run = await runNewsAutomationJob({
    action: "job",
    mode: String(process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode).trim(),
    publishLimit: newsSystemConfig.maxPostsPerRun,
    limit: Number(process.env.NEWS_RUN_LIMIT || 20),
    requestId: `backup-${Date.now().toString(36)}`
  });

  return {
    enabled: true,
    status: "ran",
    lastFinishedAt,
    ageMinutes: Number.isFinite(ageMs) ? Math.round(ageMs / 60000) : null,
    run: {
      requestId: run.requestId,
      status: run.status,
      mode: run.mode,
      sourceCount: run.sourceCount,
      scoredCount: run.scoredCount,
      selectedCount: run.selectedCount,
      savedArticleCount: run.savedArticleCount,
      publishedCount: run.publishedCount,
      duplicateSummary: run.duplicateSummary
    }
  };
}

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
      const newsBackup = await maybeRunNewsAutomationBackup();
      const finishedAt = new Date();

      await recordSyncJobRun({
        jobName: "analytics-sync",
        status: "success",
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        processedCount,
        metadata: {
          cronLogicVersion: "analytics-news-backup-v2",
          cronHeader: request.headers.get("x-vercel-cron") || "",
          userAgent: request.headers.get("user-agent") || "",
          storageMode: getAnalyticsStorageMode(),
          snapshotStrategy: "daily-prewarm; week-and-month-on-demand",
          snapshotRefresh,
          newsBackup
        }
      });

      return NextResponse.json({
        ok: true,
        status: "success",
        storageMode,
        processedCount,
        snapshotRefresh,
        newsBackup,
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
