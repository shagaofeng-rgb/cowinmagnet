import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { locales } from "@/lib/i18n";
import { saveCmsItem, slugify } from "@/lib/cmsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TITLE_LENGTH = 220;
const MAX_CONTENT_LENGTH = 120000;
const MAX_FIELD_LENGTH = 2048;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const BUILT_IN_WEBHOOK_SECRET_SHA256 = "95efb78f67ac196f12e136a1bd6c913818010e430218d03b8d7a8a09a0a6ab64";
const rateLimit = globalThis.__cowinExternalBlogWebhookRateLimit || new Map();
globalThis.__cowinExternalBlogWebhookRateLimit = rateLimit;

function result(code, msg, status = 200) {
  return NextResponse.json({ code, msg }, { status, headers: { "Cache-Control": "no-store" } });
}

function value(formData, key, limit = MAX_FIELD_LENGTH) {
  return String(formData.get(key) || "").replaceAll("\0", "").trim().slice(0, limit);
}

function secureEqual(left = "", right = "") {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return Boolean(leftBuffer.length && leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer));
}

function isAuthorizedSign(sign) {
  if (process.env.BLOG_WEBHOOK_SECRET) return secureEqual(sign, process.env.BLOG_WEBHOOK_SECRET);
  const digest = crypto.createHash("sha256").update(String(sign)).digest("hex");
  return secureEqual(digest, BUILT_IN_WEBHOOK_SECRET_SHA256);
}

function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isWithinRateLimit(ip) {
  const now = Date.now();
  const recent = (rateLimit.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  rateLimit.set(ip, recent);
  return recent.length <= RATE_LIMIT_MAX;
}

function isSafeImageUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (!['https:', 'http:'].includes(url.protocol)) return false;
    if (host === 'localhost' || host.endsWith('.localhost') || host === 'metadata.google.internal') return false;
    if (/^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host)) return false;
    return host !== '::1' && !host.startsWith('fc') && !host.startsWith('fd');
  } catch {
    return false;
  }
}

function externalImagePath(imageUrl) {
  return imageUrl ? `/api/news-image?src=${encodeURIComponent(imageUrl)}&w=980` : "";
}

function excerptFromContent(content) {
  return content
    .replace(/<[^>]*>/g, " ")
    .replace(/[`*_#>|\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function htmlToMarkdown(content) {
  if (!/<\/?[a-z][^>]*>/i.test(content)) return content;

  return content
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<h1[^>]*>/gi, "## ")
    .replace(/<h2[^>]*>/gi, "## ")
    .replace(/<h3[^>]*>/gi, "### ")
    .replace(/<\/h[1-3]>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<(br|\/p|\/div|\/section|\/article)[^>]*>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stableSlug(title) {
  return slugify(title) || `external-blog-${crypto.createHash("sha256").update(title).digest("hex").slice(0, 16)}`;
}

function revalidateBlog(slug) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/sitemap.xml");
  for (const locale of locales) {
    revalidatePath(`/${locale}/blog`);
    revalidatePath(`/${locale}/blog/${slug}`);
  }
}

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return result(0, "请求格式错误：请使用 application/x-www-form-urlencoded");
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return result(0, "请求参数解析失败");
  }

  if (!isAuthorizedSign(value(formData, "sign"))) {
    return result(0, "秘钥错误");
  }

  if (!isWithinRateLimit(clientIp(request))) {
    return result(0, "请求过于频繁，请稍后重试", 429);
  }

  const title = value(formData, "title", MAX_TITLE_LENGTH);
  const content = htmlToMarkdown(value(formData, "content", MAX_CONTENT_LENGTH));
  const classId = value(formData, "class_id", 80) || "31";
  const authorId = value(formData, "author_id", 160);
  const imageUrl = value(formData, "image_url", MAX_FIELD_LENGTH);

  // The upstream platform validates a webhook with a signed empty POST before it sends articles.
  if (!title && !content) return result(1, "验证成功");

  if (!title) return result(0, "文章标题不能为空");
  if (!content) return result(0, "文章内容不能为空");
  if (imageUrl && !isSafeImageUrl(imageUrl)) return result(0, "封面图地址无效");

  try {
    const slug = stableSlug(title);
    const saved = await saveCmsItem({
      type: "blog",
      slug,
      title,
      h1: title,
      seoTitle: title,
      metaDescription: excerptFromContent(content),
      excerpt: excerptFromContent(content),
      content,
      image: externalImagePath(imageUrl),
      sourceImageUrl: imageUrl,
      contentOrigin: "external-webhook",
      sourceUrl: "",
      sourcePublisher: "External webhook",
      relevanceStatus: "pending-editorial-review",
      duplicateFingerprint: crypto.createHash("sha256").update(`${title}\n${content.slice(0, 1000)}`).digest("hex"),
      editorialStatus: "pending-review",
      technicalReviewer: "",
      translationComplete: { en: true },
      seoIndexable: false,
      categoryId: classId,
      category: "External Blog",
      categoryTitle: "External Blog",
      authorId,
      author: authorId ? `External author ${authorId}` : "External publisher",
      keywords: ["external-webhook", `class-${classId}`],
      readingTime: Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 230)),
      publishedAt: new Date().toISOString(),
      // External systems may submit content, but Blog publication remains a
      // deliberate admin review action.
      status: "draft",
      href: `/blog/${slug}`
    });

    revalidateBlog(saved.slug);
    return result(1, "发布成功");
  } catch (error) {
    console.error("[send_article] publication failed", { message: error?.message || String(error) });
    return result(0, "数据录入失败，请重试", 500);
  }
}

export function GET() {
  return result(1, "接口在线，请使用 POST 发布文章");
}
