import { redirect } from "next/navigation";
import { requireAdminApi } from "@/lib/adminApi";
import { parseSpecifications } from "@/lib/cmsStore";
import { saveProductResearchReview } from "@/lib/productResearch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function value(formData, key) {
  return String(formData.get(key) || "").trim();
}

export async function POST(request, { params }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const { slug } = await params;
  const formData = await request.formData();
  const supplierConfirmed = value(formData, "supplierConfirmed") === "true";
  const requestedStatus = value(formData, "publicContentStatus") || "review";
  const confirmedFacts = supplierConfirmed ? parseSpecifications(value(formData, "confirmedSpecifications")).map(([label, specValue]) => ({ label, value: specValue })) : [];
  const status = supplierConfirmed && requestedStatus === "published" ? "published" : "review";

  await saveProductResearchReview(slug, {
    supplierConfirmed,
    publicContentStatus: status,
    confirmedFacts,
    approvedBy: value(formData, "approvedBy"),
    approvedDatasheetUrl: value(formData, "approvedDatasheetUrl"),
    approvedDrawingUrl: value(formData, "approvedDrawingUrl")
  });
  redirect(`/admin/products/research?saved=${encodeURIComponent(slug)}`);
}
