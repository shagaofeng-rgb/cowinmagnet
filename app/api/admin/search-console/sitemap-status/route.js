import { requireAdminApi } from "@/lib/adminApi";
import { getSearchConsoleSitemapStatus } from "@/lib/searchConsoleClient";
import { getSyncStatus } from "@/lib/syncStatusStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const [sitemap, maintenance] = await Promise.all([
      getSearchConsoleSitemapStatus(),
      getSyncStatus("sitemap-maintenance")
    ]);
    return Response.json({ sitemap, maintenance }, { headers: { "Cache-Control": "private, max-age=60" } });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Search Console sitemap status check failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
