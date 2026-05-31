import { analyticsResponse } from "@/lib/adminApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return analyticsResponse((snapshot) => snapshot.pages);
}
