import { NextResponse } from "next/server";
import { readDailyRun } from "@/lib/news-system/storage.mjs";
import { toCsv, toHtml, toMarkdown } from "@/lib/news-system/exporters.mjs";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { date } = await params;
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "json";
  const run = await readDailyRun(date);

  if (format === "md") {
    return new Response(toMarkdown(run), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
  }

  if (format === "csv") {
    return new Response(toCsv(run), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
  }

  if (format === "html") {
    return new Response(toHtml(run), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  return NextResponse.json(run);
}
