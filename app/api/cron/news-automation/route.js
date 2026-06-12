import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "@/config/news-system.config.mjs";
import { listRecentJobRuns } from "@/lib/news-system/storage.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  if (/vercel-cron/i.test(request.headers.get("user-agent") || "")) return true;
  const secret = process.env.CRON_SECRET || process.env.NEWS_SYSTEM_ADMIN_TOKEN;
  if (!secret) return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
  const headerSecret = request.headers.get("x-cron-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return [headerSecret, bearer].includes(secret);
}

async function recentSuccessfulNewsRun() {
  const intervalMs = Number(process.env.NEWS_MIN_INTERVAL_MS || process.env.NEWS_BACKUP_MIN_INTERVAL_MS || 1000 * 60 * 60 * 3);
  const recentRuns = await listRecentJobRuns(20);
  const lastNewsRun = recentRuns.find((run) => run?.action === "job" && run?.status === "success");
  const lastFinishedAt = lastNewsRun?.finishedAt || lastNewsRun?.generatedAt || lastNewsRun?.startedAt || "";
  const ageMs = lastFinishedAt ? Date.now() - new Date(lastFinishedAt).getTime() : Number.POSITIVE_INFINITY;
  if (Number.isFinite(ageMs) && ageMs < intervalMs) {
    return {
      fresh: true,
      lastFinishedAt,
      ageMinutes: Math.round(ageMs / 60000),
      intervalMinutes: Math.round(intervalMs / 60000)
    };
  }
  return { fresh: false, lastFinishedAt, ageMinutes: Number.isFinite(ageMs) ? Math.round(ageMs / 60000) : null };
}

async function handleCron(request) {
  const requestId = crypto.randomUUID();
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", requestId },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const freshRun = await recentSuccessfulNewsRun();
    if (freshRun.fresh) {
      return NextResponse.json(
        {
          success: true,
          requestId,
          data: {
            status: "fresh",
            mode: String(process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode).trim(),
            publishedCount: 0,
            savedArticleCount: 0,
            selectedCount: 0,
            reason: "recent-successful-news-run",
            ...freshRun
          }
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const run = await runNewsAutomationJob({
      action: "job",
      mode: String(process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode).trim(),
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
  } catch {
    return NextResponse.json(
      { success: false, error: "News automation failed", requestId },
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
