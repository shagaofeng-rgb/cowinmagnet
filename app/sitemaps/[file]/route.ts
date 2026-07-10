import crypto from "node:crypto";
import { getRenderableSitemapSnapshot } from "@/lib/sitemap/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^sitemap-[a-z]+(?:-\d+)?\.xml$/.test(file)) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const snapshot = await getRenderableSitemapSnapshot();
  const sitemapFile = snapshot.files.find((item: { name: string }) => item.name === file);
  if (!sitemapFile) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const etag = `"${crypto.createHash("sha256").update(sitemapFile.xml).digest("hex")}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(sitemapFile.xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      ETag: etag,
      "Last-Modified": new Date(sitemapFile.lastmod).toUTCString()
    }
  });
}
