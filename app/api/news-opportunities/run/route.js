import { NextResponse } from "next/server";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (!process.env.NEWS_SYSTEM_ADMIN_TOKEN) return !process.env.VERCEL;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token === process.env.NEWS_SYSTEM_ADMIN_TOKEN;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const run = await runNewsAutomationJob({
    limit: body.limit,
    publishLimit: body.publishLimit,
    dryRun: body.dryRun,
    mode: body.mode,
    action: body.action || "job"
  });

  return NextResponse.json({
    date: run.date,
    action: run.action,
    mode: run.mode,
    dryRun: run.dryRun,
    sourceCount: run.sourceCount,
    scoredCount: run.scoredCount,
    selectedCount: run.selectedCount,
    savedArticleCount: run.savedArticleCount,
    publishedCount: run.publishedCount,
    duplicateSummary: run.duplicateSummary,
    paths: run.paths,
    items: run.items.map((item) => ({
      title: item.generated?.title || item.generated?.contentTitle || item.title,
      source: item.sourceName,
      score: item.scores.final_score,
      status: item.workflow.status,
      quality: item.quality,
      href: item.publishedArticle?.href || null
    }))
  });
}
