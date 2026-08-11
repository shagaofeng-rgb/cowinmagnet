import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { runSitemapMaintenanceSafely } from "@/lib/sitemap/service";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function flag(searchParams, name) {
  return ["1", "true", "yes"].includes(String(searchParams.get(name) || "").toLowerCase());
}

async function handle(request) {
  const requestId = crypto.randomUUID();
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized", requestId }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  const searchParams = new URL(request.url).searchParams;
  const isScheduledCron = Boolean(request.headers.get("x-vercel-cron")) || /vercel-cron/i.test(request.headers.get("user-agent") || "");
  const result = await runSitemapMaintenanceSafely({
    trigger: isScheduledCron ? "three-day-cron" : "manual-api",
    force: flag(searchParams, "force"),
    dryRun: flag(searchParams, "dry-run") || flag(searchParams, "dryRun"),
    submit: flag(searchParams, "submit") || isScheduledCron,
    verbose: flag(searchParams, "verbose")
  });

  const snapshot = result.snapshot;
  const data = {
    status: result.status,
    changed: Boolean(result.changed),
    saved: Boolean(result.saved),
    locked: result.locked !== false,
    durationMs: result.durationMs,
    totalUrls: snapshot?.totalUrls || 0,
    skippedUrls: snapshot?.skipped?.length || 0,
    split: Boolean(snapshot?.split),
    files: snapshot?.files?.map(({ name, section, lastmod, urlCount, byteSize }) => ({ name, section, lastmod, urlCount, byteSize })) || [],
    changes: snapshot
      ? { added: snapshot.diff.added.length, modified: snapshot.diff.modified.length, removed: snapshot.diff.removed.length }
      : { added: 0, modified: 0, removed: 0 },
    robotsCheck: result.robotsCheck || { success: false, reason: "not-checked" },
    submission: result.submission || { attempted: false, success: false, reason: "not-requested" }
  };

  return NextResponse.json(
    result.success ? { success: true, data, error: null, requestId } : { success: false, data, error: result.error || "Sitemap maintenance failed", requestId },
    { status: result.success ? 200 : 500, headers: { "Cache-Control": "no-store" } }
  );
}

export async function GET(request) {
  return handle(request);
}

export async function POST(request) {
  return handle(request);
}
