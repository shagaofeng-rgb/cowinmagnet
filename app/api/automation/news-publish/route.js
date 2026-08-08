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
    const data = await runNewsPublishCycle();
    return NextResponse.json({ success: data.status === "published" || data.status === "skipped", data, error: data.status === "needs_review" ? data.reason || "Automatic quality gate rejected this cycle" : null, requestId }, { status: data.status === "needs_review" ? 422 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, data: null, error: error instanceof Error ? error.message : "News publishing failed", requestId }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function GET(request) { return handle(request); }
export async function POST(request) { return handle(request); }
