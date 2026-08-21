import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { getCmsItems, saveCmsItem, updateCmsItemStatus } from "@/lib/cmsStore";
import { validateExternalImageRights } from "@/lib/news/image-rights-validator";

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
      // An Open Graph image URL does not grant reuse rights. Public News pages
      // may only use a media record that has been verified and copied into the
      // site's controlled storage by the media-sync workflow.
      const rights = validateExternalImageRights({
        originalUrl: sourceImage.originalImageUrl || sourceImage.imageUrl,
        publisher: sourceImage.sourceName || post.source,
        licenseBasis: sourceImage.licenseBasis,
        licenseUrl: sourceImage.licenseUrl,
        rightsVerifiedAt: sourceImage.rightsVerifiedAt,
        allowedForReuse: sourceImage.allowedForReuse === true
      });

      if (!rights.passed || !sourceImage.storageUrl) {
        await saveCmsItem({
          ...post,
          sourceImage: {
            ...sourceImage,
            imageUsageMode: "review",
            imageStatus: "review_required",
            imageFailureReason: rights.passed ? "controlled-storage-copy-missing" : rights.reason,
            updatedAt: new Date().toISOString()
          }
        });
        revalidateNews(slug);
        redirect(`/admin/news?image=review-required`);
      }

      await saveCmsItem({
        ...post,
        coverImage: sourceImage.storageUrl,
        coverAlt: sourceImage.imageAlt || post.coverAlt || post.title,
        imageCaption: sourceImage.imageCaption || post.imageCaption || `Source context image. ${sourceImage.sourceName || post.source || "Original source"}.`,
        sourceImage: {
          ...sourceImage,
          imageUrl: sourceImage.storageUrl,
          imageUsageMode: "controlled-storage",
          imageStatus: "synced",
          updatedAt: new Date().toISOString()
        }
      });
    }

    if (action === "save-local-image") {
      // This route intentionally does not download media into serverless disk.
      // A configured object-storage adapter performs the actual sync.
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
