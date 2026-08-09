import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { getCmsItemBySlug, updateCmsItemStatus } from "@/lib/cmsStore";
import { canPublishCmsProduct, getProductResearchCard } from "@/lib/productResearch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidateProduct(slug) {
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  revalidatePath("/en/products");
  revalidatePath(`/en/products/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function POST(request, { params }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const formData = await request.formData();
  const action = String(formData.get("action") || "");

  if (action === "delete") {
    await updateCmsItemStatus("product", slug, "archived");
    revalidateProduct(slug);
    redirect("/admin/products?deleted=product");
  }

  if (action === "offline" || action === "publish") {
    if (action === "publish") {
      const product = await getCmsItemBySlug("product", slug, { includeInactive: true });
      const researchCard = await getProductResearchCard(slug);
      if (!product || !canPublishCmsProduct(researchCard)) {
        redirect(`/admin/products?error=product-review-required&slug=${encodeURIComponent(slug)}`);
      }
    }
    await updateCmsItemStatus("product", slug, action === "offline" ? "offline" : "published");
    revalidateProduct(slug);
    redirect(`/admin/products?status=${action}`);
  }

  redirect("/admin/products");
}
