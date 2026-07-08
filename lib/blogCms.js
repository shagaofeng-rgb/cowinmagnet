import { blogPosts as staticBlogPosts } from "@/data/blogs";
import { getCmsItems } from "@/lib/cmsStore";

const DEFAULT_BLOG_IMAGE = "/images/generated/recycling-application-cowinmagnet.png";

export function normalizeBlogPost(post) {
  const slug = post.slug || "";
  const title = post.title || post.h1 || "Cowin Magnet Blog";
  const publishedAt = String(post.publishedAt || post.createdAt || new Date().toISOString()).slice(0, 10);
  const updatedAt = String(post.updatedAt || post.publishedAt || publishedAt).slice(0, 10);

  return {
    slug,
    title,
    seoTitle: post.seoTitle || title,
    metaDescription: post.metaDescription || post.seoDescription || post.excerpt || "",
    h1: post.h1 || title,
    category: post.category || post.categoryTitle || "Selection Guide",
    keywords: Array.isArray(post.keywords) ? post.keywords : Array.isArray(post.tags) ? post.tags : [],
    excerpt: post.excerpt || "",
    readingTime: Number(post.readingTime || 8),
    publishedAt,
    updatedAt,
    image: post.image || post.coverImage || DEFAULT_BLOG_IMAGE,
    content: post.content || ""
  };
}

export async function getCmsBlogPosts({ includeInactive = false } = {}) {
  const items = await getCmsItems("blog", { includeInactive });
  return items.map(normalizeBlogPost);
}

export async function getBlogPostsWithCms({ includeInactive = false } = {}) {
  const cmsPosts = await getCmsBlogPosts({ includeInactive });
  const merged = new Map();

  for (const post of [...cmsPosts, ...staticBlogPosts]) {
    if (!post.slug || merged.has(post.slug)) continue;
    merged.set(post.slug, normalizeBlogPost(post));
  }

  return [...merged.values()].sort((a, b) => {
    const dateDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    return dateDiff || a.title.localeCompare(b.title);
  });
}

export async function getBlogPostWithCms(slug) {
  const posts = await getBlogPostsWithCms();
  return posts.find((post) => post.slug === slug);
}
