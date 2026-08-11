import crypto from "node:crypto";
import { hasUnsafeArticleMarkup } from "./articleContent.js";

const FORBIDDEN_CLAIMS = /\b(FDA|HACCP|ATEX|CE certified|food[- ]grade|sterile|guaranteed|100%|payback|ROI|recovery rate|world[- ]leading|industry[- ]leading|market[- ]leading|leading (supplier|manufacturer|brand)|best[- ]in[- ]class|the best)\b/i;

export function normalizeNewsText(value = "") {
  return String(value).toLowerCase().replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
}

export function newsFingerprint(value = "") {
  return crypto.createHash("sha256").update(normalizeNewsText(value)).digest("hex");
}

function tagValue(block, tag) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").trim() : "";
}

export function parseNewsRssItems(xml = "") {
  const blocks = String(xml).match(/<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi) || [];
  return blocks.map((block) => {
    const sourceUrl = tagValue(block, "link") || (block.match(/<link[^>]+href=["']([^"']+)["']/i) || [])[1] || "";
    return { title: tagValue(block, "title"), sourceUrl, publishedAt: tagValue(block, "pubDate") || tagValue(block, "published") || tagValue(block, "updated"), summary: tagValue(block, "description") || tagValue(block, "summary"), author: tagValue(block, "author") };
  }).filter((item) => item.title && /^https:\/\//i.test(item.sourceUrl));
}

function sourceCount(article) {
  return Array.isArray(article.sourceClaims) ? new Set(article.sourceClaims.map((item) => item?.sourceUrl).filter(Boolean)).size : 0;
}

function articleWords(article) {
  return String(article.articleMarkdown || article.markdown || "").trim().split(/\s+/).filter(Boolean).length;
}

export function validateNewsArticle(article, { catalog, knownArticleFingerprints = [] } = {}) {
  const errors = [];
  const family = catalog?.families?.find((item) => item.productSlugs.includes(article.primaryProductId));
  if (!family) errors.push("primary-product-not-in-catalog");
  if (sourceCount(article) < 2 || sourceCount(article) > 4) errors.push("requires-two-to-four-independent-sources");
  if (articleWords(article) < 1200) errors.push("article-must-have-at-least-1200-words");
  if (!article.title || !article.metaTitle || !article.metaDescription || !article.slug) errors.push("missing-seo-fields");
  if (String(article.metaTitle || "").length > 65 || String(article.metaDescription || "").length > 170) errors.push("metadata-length-outside-target");
  if (FORBIDDEN_CLAIMS.test(`${article.articleMarkdown || ""} ${article.title || ""}`)) errors.push("contains-unverified-or-prohibited-claim");
  if (hasUnsafeArticleMarkup(article.articleMarkdown || article.markdown || "")) errors.push("contains-code-or-raw-markup");
  if (!Array.isArray(article.mediaPlan) || !article.mediaPlan.some((media) => media?.kind === "product-image" && /^\//.test(media.url || ""))) errors.push("requires-local-product-image");
  if (!Array.isArray(article.mediaPlan) || !article.mediaPlan.some((media) => (media?.kind === "licensed-industry-image" || media?.kind === "self-made-process-diagram") && /^\//.test(media.url || ""))) errors.push("requires-local-licensed-industry-media-or-self-made-diagram");
  if ((article.productIds || []).length > 3) errors.push("more-than-one-primary-and-two-secondary-products");
  const contentFingerprint = newsFingerprint(`${article.title}\n${article.articleMarkdown || ""}`);
  if (knownArticleFingerprints.includes(contentFingerprint)) errors.push("duplicate-article-fingerprint");
  return { passed: errors.length === 0, errors, contentFingerprint, family };
}
