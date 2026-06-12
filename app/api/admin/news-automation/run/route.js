import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "@/config/news-system.config.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const requestId = crypto.randomUUID();

  try {
    const run = await runNewsAutomationJob({
      action: "job",
      mode: String(process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode).trim(),
      publishLimit: newsSystemConfig.maxPostsPerRun,
      limit: Number(process.env.NEWS_RUN_LIMIT || 20),
      requestId
    });

    revalidatePath("/news");
    revalidatePath("/en/news");
    revalidatePath("/sitemap.xml");

    if ((request.headers.get("accept") || "").includes("text/html")) {
      return NextResponse.redirect(new URL("/admin/news?automation=run", request.url), { status: 303 });
    }

    return NextResponse.json(
      {
        success: true,
        requestId,
        data: {
          status: run.status,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt,
          sourceCount: run.sourceCount,
          scoredCount: run.scoredCount,
          selectedCount: run.selectedCount,
          savedArticleCount: run.savedArticleCount,
          publishedCount: run.publishedCount
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
