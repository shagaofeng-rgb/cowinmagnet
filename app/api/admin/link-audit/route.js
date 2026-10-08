import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApi";
import { getLinkAuditReport } from "@/lib/linkStrategy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const report = await getLinkAuditReport();
  return NextResponse.json(report, { headers: { "Cache-Control": "private, no-store" } });
}
