import { getLiveSearchConsoleSnapshot } from "@/lib/searchConsoleClient";

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
    const snapshot = await getLiveSearchConsoleSnapshot({ days: 28 });
    return Response.json({
      ok: Boolean(snapshot?.live),
      configured: Boolean(snapshot?.configured),
      live: Boolean(snapshot?.live),
      siteUrl: snapshot?.siteUrl || null,
      dateRange: snapshot?.dateRange || null,
      overview: snapshot?.overview || null,
      rows: {
        queries: snapshot?.queries?.length || 0,
        pages: snapshot?.pages?.length || 0,
        countries: snapshot?.countries?.length || 0,
        devices: snapshot?.devices?.length || 0
      }
    });
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
