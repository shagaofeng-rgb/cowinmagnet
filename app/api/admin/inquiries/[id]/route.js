import { redirect } from "next/navigation";
import { requireAdminApi } from "@/lib/adminApi";
import { updateInquiryStatus } from "@/lib/inquiryStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const formData = await request.formData();
  const status = String(formData.get("status") || "new");
  await updateInquiryStatus(id, status);
  const detailPath = `/admin/inquiries/${encodeURIComponent(String(id))}`;
  const returnTo = String(formData.get("returnTo") || "");
  redirect(returnTo === detailPath ? `${detailPath}?updated=1` : "/admin/inquiries?updated=1");
}
