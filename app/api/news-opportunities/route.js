import { NextResponse } from "next/server";
import { listDailyRuns, readDailyRun } from "@/lib/news-system/storage.mjs";

export const dynamic = "force-dynamic";
const statusCacheHeader = "public, s-maxage=300, stale-while-revalidate=1800";

async function withTimeout(promise, timeoutMs) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("news-opportunities-status-timeout")), timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const runs = await withTimeout(listDailyRuns(), 3000);
    const latest = runs[0] ? await withTimeout(readDailyRun(runs[0]), 3000) : null;

    return NextResponse.json(
      {
        status: "ok",
        runs,
        latest: latest
          ? {
              date: latest.date,
              generatedAt: latest.generatedAt,
              sourceCount: latest.sourceCount,
              selectedCount: latest.selectedCount
            }
          : null
      },
      { headers: { "Cache-Control": statusCacheHeader } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        runs: [],
        latest: null,
        message: "News automation status is temporarily unavailable; job data remains stored in the database."
      },
      { headers: { "Cache-Control": statusCacheHeader } }
    );
  }
}
