import { NextResponse } from "next/server";
import { getLinkAuditReport } from "@/lib/linkStrategy";

export async function GET() {
  const report = await getLinkAuditReport();
  return NextResponse.json(report);
}
