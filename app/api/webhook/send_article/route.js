import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/cmsStore";
import { createBlogWebhookFingerprint, isBlogWebhookAutoPublishEnabled, isBlogWebhookEnabled, publishExternalBlog } from "@/lib/blogWebhookPublisher";
import { enqueueBlogWebhookJob, hashClientIp, markBlogWebhookJobFailed, markBlogWebhookJobPublished } from "@/lib/blogWebhookStore";

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

function result(code, msg, status = 200, extra = {}) {
  return NextResponse.json({ code, msg, ...extra }, { status, headers: { "Cache-Control": "no-store" } });
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
    if (!["https:", "http:"].includes(url.protocol)) return false;
    if (host === "localhost" || host.endsWith(".localhost") || host === "metadata.google.internal") return false;
    if (/^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host)) return false;
    return host !== "::1" && !host.startsWith("fc") && !host.startsWith("fd");
  } catch {
    return false;
  }
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

export async function POST(request) {
  if (!isBlogWebhookEnabled()) return result(0, "Blog webhook is paused", 503);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/x-www-form-urlencoded")) {
    return result(0, "Request format must be application/x-www-form-urlencoded");
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return result(0, "Unable to parse request parameters");
  }

  if (!isAuthorizedSign(value(formData, "sign"))) return result(0, "Invalid sign");
  if (!isWithinRateLimit(clientIp(request))) return result(0, "Too many requests. Retry later.", 429);

  const title = value(formData, "title", MAX_TITLE_LENGTH);
  const content = htmlToMarkdown(value(formData, "content", MAX_CONTENT_LENGTH));
  const classId = value(formData, "class_id", 80) || "31";
  const authorId = value(formData, "author_id", 160);
  const imageUrl = value(formData, "image_url", MAX_FIELD_LENGTH);

  // The upstream platform validates the endpoint with a signed empty POST.
  if (!title && !content) return result(1, "Webhook validation successful", 200, { autoPublish: isBlogWebhookAutoPublishEnabled() });
  if (!title) return result(0, "Article title is required");
  if (!content) return result(0, "Article content is required");
  if (imageUrl && !isSafeImageUrl(imageUrl)) return result(0, "Cover image URL is invalid");

  const slug = stableSlug(title);
  const fingerprint = createBlogWebhookFingerprint({ title, content, classId, authorId });
  const payload = { slug, title, content, classId, authorId, imageUrl, duplicateFingerprint: fingerprint };

  try {
    const queued = await enqueueBlogWebhookJob({ fingerprint, payload, sourceIpHash: hashClientIp(clientIp(request)) });
    if (queued.status === "published") return result(1, "Article already published", 200, { slug: queued.slug || slug, duplicate: true });
    if (!isBlogWebhookAutoPublishEnabled()) return result(1, "Article received while auto publishing is paused", 200, { slug, status: "draft" });

    const publication = await publishExternalBlog(payload);
    await markBlogWebhookJobPublished(fingerprint, publication.slug);
    return result(1, publication.duplicate ? "Article already published" : "Article published successfully", 200, { slug: publication.slug, duplicate: publication.duplicate });
  } catch (error) {
    await markBlogWebhookJobFailed(fingerprint, error).catch(() => {});
    console.error("[send_article] publication failed", { message: error?.message || String(error) });
    return result(0, "Article accepted for retry after a temporary publishing error", 503, { retryAfterSeconds: 60 });
  }
}

export function GET() {
  return result(1, "Webhook online. Use signed POST requests to publish Blog articles.", 200, {
    enabled: isBlogWebhookEnabled(),
    autoPublish: isBlogWebhookAutoPublishEnabled()
  });
}
