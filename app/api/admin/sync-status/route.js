import { requireAdminApi } from "@/lib/adminApi";
import { getSyncStatus } from "@/lib/syncStatusStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  return Response.json(await getSyncStatus("analytics-sync"));
}
