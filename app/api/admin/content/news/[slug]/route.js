import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { deleteCmsItem, updateCmsItemStatus } from "@/lib/cmsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function revalidateNews(slug) {
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/en/news");
  revalidatePath(`/en/news/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function POST(request, { params }) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const { slug } = await params;
  const formData = await request.formData();
  const action = String(formData.get("action") || "");

  if (action === "delete") {
    await deleteCmsItem("news", slug);
    revalidateNews(slug);
    redirect("/admin/news?deleted=news");
  }

  if (action === "offline" || action === "draft" || action === "publish") {
    await updateCmsItemStatus("news", slug, action === "publish" ? "published" : "draft");
    revalidateNews(slug);
    redirect(`/admin/news?status=${action}`);
  }

  redirect("/admin/news");
}
