import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { locales } from "@/lib/i18n";
import { getCmsItemBySlug, saveCmsItem } from "@/lib/cmsStore";

function revalidateBlog(slug) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  for (const locale of locales) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/blog/${slug}`);
  }
}

function excerptFromContent(content) {
  return String(content)
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#>|\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

export function isBlogWebhookAutoPublishEnabled() {
  return String(process.env.BLOG_WEBHOOK_AUTOPUBLISH || "true").toLowerCase() !== "false";
}

export function isBlogWebhookEnabled() {
  return String(process.env.BLOG_WEBHOOK_ENABLED || "true").toLowerCase() !== "false";
}

export async function publishExternalBlog(payload) {
  const existing = await getCmsItemBySlug("blog", payload.slug, { includeInactive: true });
  if (existing?.duplicateFingerprint === payload.duplicateFingerprint && existing.status === "published") {
    return { slug: existing.slug, duplicate: true };
  }

  const now = new Date().toISOString();
  const status = isBlogWebhookAutoPublishEnabled() ? "published" : "draft";
  const saved = await saveCmsItem({
    ...existing,
    type: "blog",
    slug: payload.slug,
    title: payload.title,
    h1: payload.title,
    seoTitle: payload.title,
    metaDescription: excerptFromContent(payload.content),
    excerpt: excerptFromContent(payload.content),
    content: payload.content,
    image: payload.imageUrl || "",
    sourceImageUrl: payload.imageUrl || "",
    contentOrigin: "external-webhook",
    sourceUrl: "",
    sourcePublisher: "External webhook",
    relevanceStatus: "external-published",
    duplicateFingerprint: payload.duplicateFingerprint,
    editorialStatus: status === "published" ? "auto-published" : "paused",
    technicalReviewer: "",
    translationComplete: { en: true },
    seoIndexable: status === "published",
    categoryId: payload.classId,
    category: "External Blog",
    categoryTitle: "External Blog",
    authorId: payload.authorId,
    author: payload.authorId ? `External author ${payload.authorId}` : "External publisher",
    keywords: ["external-webhook", `class-${payload.classId}`],
    readingTime: Math.max(1, Math.ceil(payload.content.split(/\s+/).filter(Boolean).length / 230)),
    publishedAt: existing?.publishedAt || now,
    status,
    href: `/blog/${payload.slug}`
  });

  revalidateBlog(saved.slug);
  return { slug: saved.slug, duplicate: false, status: saved.status };
}

export function createBlogWebhookFingerprint({ title, content, classId, authorId }) {
  return crypto.createHash("sha256").update(`${title}\n${content}\n${classId}\n${authorId}`).digest("hex");
}
