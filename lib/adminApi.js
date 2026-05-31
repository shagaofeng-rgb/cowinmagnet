import { getAdminSession } from "@/lib/adminAuth";
import { getAnalyticsSnapshot, getSearchConsoleSnapshot } from "@/lib/analyticsStore";

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function analyticsResponse(selector) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const snapshot = await getAnalyticsSnapshot();
  return Response.json(selector ? selector(snapshot) : snapshot);
}

export async function searchConsoleResponse(selector) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const snapshot = await getSearchConsoleSnapshot();
  return Response.json(selector ? selector(snapshot) : snapshot);
}
