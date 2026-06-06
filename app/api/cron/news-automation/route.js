import { NextResponse } from "next/server";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "@/config/news-system.config.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  const secret = process.env.CRON_SECRET || process.env.NEWS_SYSTEM_ADMIN_TOKEN;
  if (!secret) return true;
  const headerSecret = request.headers.get("x-cron-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const querySecret = new URL(request.url).searchParams.get("secret");
  return [headerSecret, bearer, querySecret].includes(secret);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const run = await runNewsAutomationJob({
    action: "job",
    mode: process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode,
    publishLimit: 1,
    limit: Number(process.env.NEWS_RUN_LIMIT || 8)
  });

  return NextResponse.json({
    ok: true,
    date: run.date,
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
  });
}
