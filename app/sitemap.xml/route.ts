import { connection } from "next/server";
import { getRenderableSitemapSnapshot } from "@/lib/sitemap/service";

export const runtime = "nodejs";

function xmlResponse(request: Request, xml: string, etagValue: string, lastModified: string) {
  const etag = `"${etagValue}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      ETag: etag,
      "Last-Modified": new Date(lastModified).toUTCString()
    }
  });
}

export async function GET(request: Request) {
  await connection();
  const snapshot = await getRenderableSitemapSnapshot();
  return xmlResponse(request, snapshot.indexXml, snapshot.manifestHash, snapshot.generatedAt);
}
