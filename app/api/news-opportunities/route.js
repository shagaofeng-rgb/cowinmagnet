import { NextResponse } from "next/server";
import { listDailyRuns, readDailyRun } from "@/lib/news-system/storage.mjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const runs = await listDailyRuns();
  const latest = runs[0] ? await readDailyRun(runs[0]) : null;

  return NextResponse.json({
    runs,
    latest: latest
      ? {
          date: latest.date,
          generatedAt: latest.generatedAt,
          sourceCount: latest.sourceCount,
          selectedCount: latest.selectedCount
        }
      : null
  });
}
