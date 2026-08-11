import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";
import { runNewsIngestCycle } from "@/lib/newsOperations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(request) {
  const requestId = crypto.randomUUID();
  if (!isCronAuthorized(request)) return NextResponse.json({ success: false, data: null, error: "Unauthorized", requestId }, { status: 401 });
  try {
    const discovery = await runNewsIngestCycle({ requestId });
    return NextResponse.json({ success: discovery.status === "success", data: discovery, error: null, requestId }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, data: null, error: error instanceof Error ? error.message : "News discovery failed", requestId }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function GET(request) { return handle(request); }
export async function POST(request) { return handle(request); }
