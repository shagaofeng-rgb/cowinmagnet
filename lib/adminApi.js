import { getAdminSession } from "@/lib/adminAuth";
import { getAnalyticsSnapshot, getSearchConsoleSnapshot } from "@/lib/analyticsStore";
import { getAdminDateRange } from "@/lib/adminDateRange";

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function analyticsResponse(selector, request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const range = request ? getAdminDateRange(new URL(request.url).searchParams) : getAdminDateRange();
  const snapshot = await getAnalyticsSnapshot(range);
  return Response.json(selector ? selector(snapshot) : snapshot);
}

export async function searchConsoleResponse(selector, request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const range = request ? getAdminDateRange(new URL(request.url).searchParams) : getAdminDateRange();
  const snapshot = await getSearchConsoleSnapshot(range);
  return Response.json(selector ? selector(snapshot) : snapshot);
}
