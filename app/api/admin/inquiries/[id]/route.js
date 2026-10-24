import { redirect } from "next/navigation";
import { requireAdminApi } from "@/lib/adminApi";
import { retryInquiryNotification, updateInquiryStatus } from "@/lib/inquiryStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const formData = await request.formData();
  const detailPath = `/admin/inquiries/${encodeURIComponent(String(id))}`;
  if (formData.get("action") === "retry_notification") {
    const queued = await retryInquiryNotification(id);
    redirect(`${detailPath}?notification=${queued ? "queued" : "unchanged"}`);
  }
  const status = String(formData.get("status") || "new");
  await updateInquiryStatus(id, status);
  const returnTo = String(formData.get("returnTo") || "");
  redirect(returnTo === detailPath ? `${detailPath}?updated=1` : "/admin/inquiries?updated=1");
}
