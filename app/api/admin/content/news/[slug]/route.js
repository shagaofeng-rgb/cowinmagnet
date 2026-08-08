import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { getCmsItems, saveCmsItem, updateCmsItemStatus } from "@/lib/cmsStore";

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
    await updateCmsItemStatus("news", slug, "archived");
    revalidateNews(slug);
    redirect("/admin/news?deleted=news");
  }

  if (action === "offline" || action === "draft" || action === "publish") {
    await updateCmsItemStatus("news", slug, action === "publish" ? "published" : "draft");
    revalidateNews(slug);
    redirect(`/admin/news?status=${action}`);
  }

  if (["remove-image", "use-remote-image", "save-local-image"].includes(action)) {
    const posts = await getCmsItems("news", { includeInactive: true });
    const post = posts.find((item) => item.slug === slug);
    if (!post) redirect("/admin/news?error=news-not-found");

    if (action === "remove-image") {
      await saveCmsItem({
        ...post,
        coverImage: "",
        coverAlt: "",
        imageCaption: "",
        sourceImage: {
          ...(post.sourceImage || {}),
          imageUrl: "",
          imageUsageMode: "none",
          imageStatus: "review_required",
          imageFailureReason: "removed-by-admin",
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === "use-remote-image") {
      const sourceImage = post.sourceImage || {};
      await saveCmsItem({
        ...post,
        coverImage: sourceImage.originalImageUrl || sourceImage.imageUrl || post.coverImage || "",
        coverAlt: sourceImage.imageAlt || post.coverAlt || post.title,
        imageCaption: sourceImage.imageCaption || post.imageCaption || `Article image. Image source: ${sourceImage.sourceName || post.source || "Original source"}.`,
        sourceImage: {
          ...sourceImage,
          imageUrl: sourceImage.originalImageUrl || sourceImage.imageUrl || post.coverImage || "",
          imageUsageMode: "remote",
          imageStatus: sourceImage.imageStatus || "valid",
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === "save-local-image") {
      await saveCmsItem({
        ...post,
        sourceImage: {
          ...(post.sourceImage || {}),
          imageUsageMode: "review",
          imageStatus: "review_required",
          imageFailureReason: "local-object-storage-not-configured",
          updatedAt: new Date().toISOString()
        }
      });
    }

    revalidateNews(slug);
    redirect(`/admin/news?image=${action}`);
  }

  redirect("/admin/news");
}
