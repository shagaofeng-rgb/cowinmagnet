import { redirect } from "next/navigation";
import { requireAdminApi } from "@/lib/adminApi";
import { parseSpecifications } from "@/lib/cmsStore";
import { saveProductResearchReview } from "@/lib/productResearch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function value(formData, key) {
  return String(formData.get(key) || "").trim();
}

export async function POST(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;
  const formData = await request.formData();
  const slug = value(formData, "productSlug");
  if (!slug) redirect("/admin/products/research?error=product-slug-required");
  const supplierConfirmed = value(formData, "supplierConfirmed") === "true";
  const requestedStatus = value(formData, "publicContentStatus") || "review";
  const confirmedFacts = supplierConfirmed ? parseSpecifications(value(formData, "confirmedSpecifications")).map(([label, specValue]) => ({ label, value: specValue })) : [];
  await saveProductResearchReview(slug, {
    supplierConfirmed,
    publicContentStatus: supplierConfirmed && requestedStatus === "published" ? "published" : "review",
    confirmedFacts,
    approvedBy: value(formData, "approvedBy"),
    approvedDatasheetUrl: value(formData, "approvedDatasheetUrl"),
    approvedDrawingUrl: value(formData, "approvedDrawingUrl")
  });
  redirect(`/admin/products/research?saved=${encodeURIComponent(slug)}`);
}
