import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "@/config/news-system.config.mjs";
import { listRecentJobRuns, saveDailyRun, todayKey } from "@/lib/news-system/storage.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  if (/vercel-cron/i.test(request.headers.get("user-agent") || "")) return true;
  const secrets = [process.env.CRON_SECRET, process.env.NEWS_SYSTEM_ADMIN_TOKEN].filter(Boolean);
  if (!secrets.length) return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
  const headerSecret = request.headers.get("x-cron-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return secrets.includes(headerSecret) || secrets.includes(bearer);
}

async function recentSuccessfulNewsRun() {
  const intervalMs = Number(process.env.NEWS_MIN_INTERVAL_MS || process.env.NEWS_BACKUP_MIN_INTERVAL_MS || 1000 * 60 * 60 * 6);
  const graceMs = Number(process.env.NEWS_CRON_GRACE_MS || 1000 * 60 * 20);
  const freshThresholdMs = Math.max(0, intervalMs - graceMs);
  const recentRuns = await listRecentJobRuns(20);
  const lastNewsRun = recentRuns.find(
    (run) => run?.action === "job" && run?.status === "success" && Number(run?.publishedCount || 0) > 0
  );
  const lastFinishedAt = lastNewsRun?.finishedAt || lastNewsRun?.generatedAt || lastNewsRun?.startedAt || "";
  const ageMs = lastFinishedAt ? Date.now() - new Date(lastFinishedAt).getTime() : Number.POSITIVE_INFINITY;
  if (Number.isFinite(ageMs) && ageMs < freshThresholdMs) {
    return {
      fresh: true,
      lastFinishedAt,
      ageMinutes: Math.round(ageMs / 60000),
      intervalMinutes: Math.round(intervalMs / 60000),
      graceMinutes: Math.round(graceMs / 60000),
      eligibleAfterMinutes: Math.round(freshThresholdMs / 60000)
    };
  }
  return {
    fresh: false,
    lastFinishedAt,
    ageMinutes: Number.isFinite(ageMs) ? Math.round(ageMs / 60000) : null,
    intervalMinutes: Math.round(intervalMs / 60000),
    graceMinutes: Math.round(graceMs / 60000),
    eligibleAfterMinutes: Math.round(freshThresholdMs / 60000)
  };
}

function currentMode() {
  return String(process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode).trim();
}

function publicErrorMessage(error) {
  return String(error?.message || "News automation failed").slice(0, 500);
}

async function recordSkippedRun({ requestId, startedAt, reason, data = {} }) {
  const finishedAt = new Date().toISOString();
  const run = {
    requestId,
    date: todayKey(new Date(startedAt)),
    action: "job",
    mode: currentMode(),
    status: "skipped",
    skipReason: reason,
    startedAt,
    finishedAt,
    generatedAt: finishedAt,
    sourceCount: 0,
    scoredCount: 0,
    selectedCount: 0,
    savedArticleCount: 0,
    publishedCount: 0,
    skippedCount: 1,
    rejectedCount: 0,
    duplicateSummary: { [reason]: 1 },
    diversityLog: {
      selected_source: [],
      rejected_sources: [
        {
          source: "cron",
          domain: "cowinmagnet.com",
          url: "/api/cron/news-automation",
          reason,
          duplication_score: null,
          topic_cluster_id: null,
          information_gain_score: null
        }
      ],
      source_pool: null
    },
    items: [],
    ...data
  };
  await saveDailyRun(run);
  return run;
}

async function recordFailedRun({ requestId, startedAt, error }) {
  try {
    const finishedAt = new Date().toISOString();
    await saveDailyRun({
      requestId,
      date: todayKey(new Date(startedAt)),
      action: "job",
      mode: currentMode(),
      status: "failed",
      startedAt,
      finishedAt,
      generatedAt: finishedAt,
      sourceCount: 0,
      scoredCount: 0,
      selectedCount: 0,
      savedArticleCount: 0,
      publishedCount: 0,
      skippedCount: 0,
      rejectedCount: 0,
      errorMessage: publicErrorMessage(error),
      items: []
    });
  } catch (recordError) {
    console.error("[news-automation] failed to record failed run", {
      requestId,
      message: recordError?.message || String(recordError)
    });
  }
}

async function handleCron(request) {
  const requestId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", requestId },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const freshRun = await recentSuccessfulNewsRun();
    if (freshRun.fresh) {
      const skippedRun = await recordSkippedRun({
        requestId,
        startedAt,
        reason: "recent-successful-news-run",
        data: freshRun
      });
      return NextResponse.json(
        {
          success: true,
          requestId,
          data: {
            date: skippedRun.date,
            status: "fresh",
            mode: currentMode(),
            publishedCount: 0,
            savedArticleCount: 0,
            selectedCount: 0,
            skippedCount: 1,
            reason: "recent-successful-news-run",
            ...freshRun
          }
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const run = await runNewsAutomationJob({
      action: "job",
      mode: currentMode(),
      publishLimit: newsSystemConfig.maxPostsPerRun,
      limit: Number(process.env.NEWS_RUN_LIMIT || 20),
      requestId
    });

    return NextResponse.json(
      {
        success: true,
        requestId,
        data: {
          date: run.date,
          status: run.status,
          mode: run.mode,
          sourceCount: run.sourceCount,
          scoredCount: run.scoredCount,
          selectedCount: run.selectedCount,
          savedArticleCount: run.savedArticleCount,
          publishedCount: run.publishedCount,
          duplicateSummary: run.duplicateSummary,
          diversityLog: run.diversityLog,
          items: run.items.map((item) => ({
            title: item.generated?.title || item.title,
            source: item.sourceName,
            score: item.scores.final_score,
            status: item.workflow.status,
            href: item.publishedArticle?.href || null,
            qualityPassed: item.quality?.passed || false
          }))
        }
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[news-automation] cron failed", {
      requestId,
      message: error?.message || String(error),
      stack: error?.stack || ""
    });
    await recordFailedRun({ requestId, startedAt, error });
    return NextResponse.json(
      { success: false, error: "News automation failed", errorMessage: publicErrorMessage(error), requestId },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function GET(request) {
  return handleCron(request);
}

export async function POST(request) {
  return handleCron(request);
}
