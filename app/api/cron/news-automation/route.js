import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "@/config/news-system.config.mjs";
import { saveDailyRun, todayKey } from "@/lib/news-system/storage.mjs";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function currentMode() {
  return "draft";
}

function publicErrorMessage(error) {
  return String(error?.message || "News automation failed").slice(0, 500);
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
  if (!isCronAuthorized(request, { additionalSecrets: [process.env.NEWS_SYSTEM_ADMIN_TOKEN] })) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", requestId },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    // Scheduled runs collect and de-duplicate candidates only. Publishing is
    // intentionally impossible here; the publisher persists drafts for review.
    const run = await runNewsAutomationJob({
      action: "generate",
      mode: "draft",
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
