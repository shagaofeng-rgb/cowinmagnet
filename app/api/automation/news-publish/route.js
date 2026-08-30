import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";
import { runNewsPublishCycle } from "@/lib/newsOperations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function handle(request) {
  const requestId = crypto.randomUUID();
  if (!isCronAuthorized(request)) return NextResponse.json({ success: false, data: null, error: "Unauthorized", requestId }, { status: 401 });
  try {
    const data = await runNewsPublishCycle({ requestId });
    const successful = ["published_success", "already_published_today"].includes(data.status);
    const status = successful ? 200 : data.status === "paused" || data.status === "retry_pending" ? 503 : data.locked === false ? 409 : 500;
    console.info("News publish run completed", { requestId, status: data.status || null, reason: data.reason || null, slug: data.slug || null, httpStatus: status });
    return NextResponse.json({ success: successful, data, error: successful ? null : data.reason || "News publishing did not complete", requestId }, { status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("News publish run failed", { requestId, error: error instanceof Error ? error.message : "News publishing failed" });
    return NextResponse.json({ success: false, data: null, error: error instanceof Error ? error.message : "News publishing failed", requestId }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function GET(request) { return handle(request); }
export async function POST(request) { return handle(request); }
