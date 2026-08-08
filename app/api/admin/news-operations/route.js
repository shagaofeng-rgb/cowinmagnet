import { requireAdminApi } from "@/lib/adminApi";
import { getNewsOperationsDashboard, runDailyNewsDiscovery, runNewsPublishCycle, seedInitialEditorialPlans } from "@/lib/newsOperations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  try {
    return Response.json({ success: true, data: await getNewsOperationsDashboard(), error: null });
  } catch (error) {
    return Response.json({ success: false, data: null, error: error instanceof Error ? error.message : "News operations storage is unavailable" }, { status: 503 });
  }
}

export async function POST(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const body = await request.json().catch(() => ({}));
  try {
    if (body.action === "discover") return Response.json({ success: true, data: await runDailyNewsDiscovery(), error: null });
    if (body.action === "seed-plans") return Response.json({ success: true, data: { created: (await seedInitialEditorialPlans()).length }, error: null });
    if (body.action === "publish") return Response.json({ success: true, data: await runNewsPublishCycle(), error: null });
    return Response.json({ success: false, data: null, error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    return Response.json({ success: false, data: null, error: error instanceof Error ? error.message : "News operation failed" }, { status: 500 });
  }
}
