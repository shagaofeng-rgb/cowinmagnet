import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";
import { claimDueInquiryNotifications, recordInquiryNotificationResult } from "@/lib/inquiryStore";
import { inquiryNotificationConfigured, sendInquiryNotification } from "@/lib/inquiryNotification";
import { recordSyncJobRun } from "@/lib/syncStatusStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date();
  if (!inquiryNotificationConfigured()) {
    await recordSyncJobRun({
      jobName: "inquiry-notification-retry",
      status: "failed",
      startedAt: startedAt.toISOString(),
      finishedAt: new Date().toISOString(),
      failedCount: 1,
      errorMessage: "SMTP notification is not configured"
    });
    return NextResponse.json({ ok: false, status: "configuration-required" }, { status: 503 });
  }

  try {
    const jobs = await claimDueInquiryNotifications(10);
    let sent = 0;
    let failed = 0;
    for (const job of jobs) {
      const delivery = await sendInquiryNotification({ ...job.payload, inquiryId: job.id });
      await recordInquiryNotificationResult(job.id, {
        sent: delivery.sent,
        reason: delivery.reason,
        attempt: job.attempt
      });
      if (delivery.sent) sent += 1;
      else failed += 1;
    }
    const finishedAt = new Date();
    await recordSyncJobRun({
      jobName: "inquiry-notification-retry",
      status: failed ? "partial" : "success",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      processedCount: sent,
      failedCount: failed,
      metadata: { attempted: jobs.length }
    });
    return NextResponse.json({ ok: failed === 0, attempted: jobs.length, sent, failed }, { status: failed ? 502 : 200 });
  } catch (error) {
    const finishedAt = new Date();
    await recordSyncJobRun({
      jobName: "inquiry-notification-retry",
      status: "failed",
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
      failedCount: 1,
      errorMessage: error?.name || "retry-failed"
    }).catch(() => {});
    return NextResponse.json({ ok: false, error: "Notification retry failed" }, { status: 503 });
  }
}
