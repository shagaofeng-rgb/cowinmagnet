import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { runDailyBlogPublisher } from "@/lib/blog-system/daily-publisher.mjs";
import { recordSyncJobRun, withSyncJobLock } from "@/lib/syncStatusStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  if (request.headers.get("x-vercel-cron") === "1") return true;
  if (/vercel-cron/i.test(request.headers.get("user-agent") || "")) return true;
  const secrets = [process.env.CRON_SECRET, process.env.BLOG_AUTOMATION_TOKEN].filter(Boolean);
  if (!secrets.length) return process.env.NODE_ENV !== "production" && !process.env.VERCEL;
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const headerSecret = request.headers.get("x-cron-secret");
  const querySecret = new URL(request.url).searchParams.get("secret");
  return [bearer, headerSecret, querySecret].some((value) => secrets.includes(value));
}

async function handleCron(request) {
  const requestId = crypto.randomUUID();
  const startedAt = new Date();

  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized", requestId }, { status: 401 });
  }

  const force = new URL(request.url).searchParams.get("force") === "1";

  const result = await withSyncJobLock("blog-automation", async ({ locked, storageMode }) => {
    if (!locked) {
      return {
        success: true,
        status: "skipped_due_to_lock",
        storageMode,
        requestId,
        publishedCount: 0
      };
    }

    try {
      const run = await runDailyBlogPublisher({ force, requestId });
      const finishedAt = new Date();
      const success = run.status === "success";

      if (success) {
        revalidatePath("/blog");
        revalidatePath(`/blog/${run.post.slug}`);
        revalidatePath("/en/blog");
        revalidatePath(`/en/blog/${run.post.slug}`);
        revalidatePath("/sitemap.xml");
      }

      await recordSyncJobRun({
        jobName: "blog-automation",
        status: run.status,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        processedCount: 1,
        skippedCount: run.status === "skipped" ? 1 : 0,
        metadata: {
          requestId,
          storageMode,
          reason: run.reason,
          publishedCount: run.publishedCount,
          slug: run.post?.slug || "",
          title: run.post?.title || ""
        }
      });

      return {
        success: true,
        status: run.status,
        reason: run.reason,
        requestId,
        publishedCount: run.publishedCount,
        post: run.post
          ? {
              slug: run.post.slug,
              title: run.post.title,
              href: `/blog/${run.post.slug}`,
              publishedAt: run.post.publishedAt
            }
          : null
      };
    } catch (error) {
      const finishedAt = new Date();
      await recordSyncJobRun({
        jobName: "blog-automation",
        status: "failed",
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        failedCount: 1,
        errorMessage: error?.message || "Blog automation failed",
        metadata: { requestId }
      });
      throw error;
    }
  });

  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request) {
  try {
    return await handleCron(request);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Blog automation failed", errorMessage: String(error?.message || error).slice(0, 500) },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return GET(request);
}
