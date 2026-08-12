import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";
import { auditPublishedContent } from "@/lib/contentAudit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(request) {
  if (!isCronAuthorized(request)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  try {
    const apply = new URL(request.url).searchParams.get("apply") === "true";
    const data = await auditPublishedContent({ apply });
    return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Content audit failed" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
