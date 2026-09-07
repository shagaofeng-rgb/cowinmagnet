import { getLiveSearchConsoleSnapshot, getSearchConsoleSitemapStatus } from "@/lib/searchConsoleClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const token = process.env.GSC_HEALTH_TOKEN;
  if (!token) return false;
  return request.headers.get("x-gsc-health-token") === token;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false }, { status: 404 });
  }

  try {
    const [sitemapResult, analyticsResult] = await Promise.allSettled([
      getSearchConsoleSitemapStatus(),
      getLiveSearchConsoleSnapshot({ days: 28 })
    ]);
    const sitemap = sitemapResult.status === "fulfilled"
      ? sitemapResult.value
      : { configured: true, submissionEnabled: false, live: false, error: sitemapResult.reason instanceof Error ? sitemapResult.reason.message : "Sitemap status check failed" };
    const snapshot = analyticsResult.status === "fulfilled" ? analyticsResult.value : null;
    const analyticsError = analyticsResult.status === "rejected"
      ? (analyticsResult.reason instanceof Error ? analyticsResult.reason.message : "Search Analytics check failed")
      : "";
    const ok = Boolean(sitemap.live && sitemap.submissionEnabled && !sitemap.isPending && sitemap.errors === 0);
    return Response.json({
      ok,
      configured: Boolean(sitemap.configured),
      live: Boolean(snapshot?.live),
      siteUrl: sitemap.siteUrl || snapshot?.siteUrl || null,
      sitemap,
      dateRange: snapshot?.dateRange || null,
      overview: snapshot?.overview || null,
      rows: {
        queries: snapshot?.queries?.length || 0,
        pages: snapshot?.pages?.length || 0,
        countries: snapshot?.countries?.length || 0,
        devices: snapshot?.devices?.length || 0
      },
      ...(analyticsError ? { analyticsError } : {})
    }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        configured: true,
        live: false,
        error: error instanceof Error ? error.message : "Unknown Search Console error"
      },
      { status: 502 }
    );
  }
}
