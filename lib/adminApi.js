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
  try {
    const snapshot = await getAnalyticsSnapshot(range);
    return Response.json(selector ? selector(snapshot) : snapshot, {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=120"
      }
    });
  } catch (error) {
    console.error("Admin analytics unavailable", error);
    return Response.json({ message: "统计数据暂不可用，请稍后重试。" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" }
    });
  }
}

export async function searchConsoleResponse(selector, request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const range = request ? getAdminDateRange(new URL(request.url).searchParams) : getAdminDateRange();
  const snapshot = await getSearchConsoleSnapshot(range);
  return Response.json(selector ? selector(snapshot) : snapshot);
}
