import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";
import { createBlogWebhookFingerprint, isBlogWebhookAutoPublishEnabled, isBlogWebhookEnabled, publishExternalBlog } from "@/lib/blogWebhookPublisher";
import { claimDueBlogWebhookJobs, enqueueBlogWebhookJob, getLegacyExternalBlogDrafts, markBlogWebhookJobFailed, markBlogWebhookJobPublished } from "@/lib/blogWebhookStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  const requestId = crypto.randomUUID();
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized", requestId }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  if (!isBlogWebhookEnabled() || !isBlogWebhookAutoPublishEnabled()) {
    return NextResponse.json({ success: true, requestId, status: "paused", processed: 0 }, { headers: { "Cache-Control": "no-store" } });
  }

  const jobs = await claimDueBlogWebhookJobs(10);
  if (jobs.length < 10) {
    const legacyDrafts = await getLegacyExternalBlogDrafts(10 - jobs.length);
    for (const item of legacyDrafts) {
      const payload = {
        slug: item.slug,
        title: item.title,
        content: item.content,
        classId: item.categoryId || "31",
        authorId: item.authorId || "",
        imageUrl: item.sourceImageUrl || item.image || "",
        duplicateFingerprint: createBlogWebhookFingerprint({
          title: item.title,
          content: item.content,
          classId: item.categoryId || "31",
          authorId: item.authorId || ""
        })
      };
      const fingerprint = payload.duplicateFingerprint;
      const job = await enqueueBlogWebhookJob({ fingerprint, payload, sourceIpHash: "legacy-recovery" });
      if (job.status !== "published") jobs.push({ fingerprint, payload });
    }
  }
  const results = [];
  for (const job of jobs) {
    try {
      const publication = await publishExternalBlog(job.payload);
      await markBlogWebhookJobPublished(job.fingerprint, publication.slug);
      results.push({ slug: publication.slug, status: publication.duplicate ? "duplicate" : "published" });
    } catch (error) {
      await markBlogWebhookJobFailed(job.fingerprint, error);
      results.push({ status: "retry_scheduled" });
    }
  }

  return NextResponse.json({ success: true, requestId, status: "completed", processed: results.length, results }, { headers: { "Cache-Control": "no-store" } });
}
