import { NextResponse } from "next/server";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    status: "disabled-on-serverless",
    message: "Website monitor is disabled in the Vercel serverless cron route to keep function size within deployment limits. Run scripts/monitor/run-monitor.mjs locally when needed."
  });
}
