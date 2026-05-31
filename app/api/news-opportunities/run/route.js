import { NextResponse } from "next/server";
import { runDailyNewsSystem } from "@/lib/news-system/daily-runner.mjs";

export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (!process.env.NEWS_SYSTEM_ADMIN_TOKEN) return true;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return token === process.env.NEWS_SYSTEM_ADMIN_TOKEN;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const run = await runDailyNewsSystem({ limit: body.limit, dryRun: body.dryRun });

  return NextResponse.json({
    date: run.date,
    sourceCount: run.sourceCount,
    selectedCount: run.selectedCount,
    paths: run.paths,
    items: run.items.map((item) => ({
      title: item.generated.contentTitle,
      source: item.sourceName,
      score: item.scores.final_score,
      status: item.workflow.status
    }))
  });
}
