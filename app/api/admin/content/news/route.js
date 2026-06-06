import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/adminApi";
import { fileToDataUrl, saveCmsItem, slugify, textToSections } from "@/lib/cmsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function value(formData, key) {
  return String(formData.get(key) || "").trim();
}

export async function POST(request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const title = value(formData, "title");
  const slug = slugify(value(formData, "slug") || title);

  if (!title || !slug) {
    redirect("/admin/news?error=news-required");
  }

  const [selectedCategory = "", selectedCategoryTitle = ""] = value(formData, "categoryBundle").split("|||");
  const category = slugify(value(formData, "newCategoryTitle") || selectedCategory || "company-news");
  const categoryTitle = value(formData, "newCategoryTitle") || selectedCategoryTitle || "Company News";
  const imageFile = formData.get("image");
  const coverImage = await fileToDataUrl(imageFile);
  const content = value(formData, "content");
  const publishedAt = value(formData, "publishedAt") || new Date().toISOString().slice(0, 10);
  const status = value(formData, "status") || "published";
  const tags = value(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await saveCmsItem({
    type: "news",
    slug,
    title,
    excerpt: value(formData, "excerpt") || content.slice(0, 180),
    category,
    categoryTitle,
    categoryDescription: value(formData, "categoryDescription"),
    coverImage,
    coverAlt: value(formData, "coverAlt") || `${title} news image`,
    imageCaption: value(formData, "imageCaption") || "Cowinmagnet uploaded news image.",
    sections: textToSections(content),
    content,
    sources: [],
    author: value(formData, "author"),
    source: value(formData, "source"),
    tags,
    seoTitle: value(formData, "seoTitle") || title,
    seoDescription: value(formData, "seoDescription") || value(formData, "excerpt") || content.slice(0, 160),
    views: 0,
    publishedAt,
    status: ["draft", "published"].includes(status) ? status : "published",
    href: `/news/${slug}`
  });

  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/en/news");
  revalidatePath(`/en/news/${slug}`);
  redirect("/admin/news?saved=news");
}
