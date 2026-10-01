import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function handle(request) {
  const requestId = crypto.randomUUID();
  if (!isCronAuthorized(request)) return NextResponse.json({ success: false, data: null, error: "Unauthorized", requestId }, { status: 401 });
  return NextResponse.json({ success: true, data: { status: "paused" }, error: null, requestId }, { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request) { return handle(request); }
export async function POST(request) { return handle(request); }
