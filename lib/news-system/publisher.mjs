import { saveCmsItem, getCmsItems, slugify } from "../cmsStore.js";
import { newsSystemConfig } from "../../config/news-system.config.mjs";

function buildContent(article) {
  return (article.sections || []).map((section) => `${section.heading}\n${section.body}`).join("\n\n");
}

function normalizeStatus({ requestedStatus, quality }) {
  if (requestedStatus === "published" && quality.publishable) return "published";
  if (requestedStatus === "auto" && quality.publishable) return "published";
  return "draft";
}

async function uniqueSlug(baseSlug) {
  const existing = await getCmsItems("news", { includeInactive: true });
  const existingSlugs = new Set(existing.map((item) => item.slug));
  let slug = slugify(baseSlug);
  if (!existingSlugs.has(slug)) return slug;

  const dateSuffix = new Date().toISOString().slice(0, 10);
  slug = slugify(`${baseSlug}-${dateSuffix}`);
  if (!existingSlugs.has(slug)) return slug;

  for (let index = 2; index < 50; index += 1) {
    const candidate = slugify(`${baseSlug}-${dateSuffix}-${index}`);
    if (!existingSlugs.has(candidate)) return candidate;
  }

  return slugify(`${baseSlug}-${Date.now()}`);
}

export async function publishGeneratedArticle({ article, cover, item, quality, publishMode = newsSystemConfig.publishMode }) {
  const normalizedPublishMode = String(publishMode || "").trim();
  const requestedStatus = normalizedPublishMode === "auto" ? "auto" : normalizedPublishMode === "published" ? "published" : "draft";
  const status = normalizeStatus({ requestedStatus, quality });
  const slug = await uniqueSlug(article.slug);
  const publishedAt = new Date().toISOString().slice(0, 10);
  const content = buildContent(article);

  const cmsItem = await saveCmsItem({
    type: "news",
    slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category || "industry-news",
    categoryTitle: article.categoryTitle || "Industry News",
    categoryDescription: "Industry news references with Cowinmagnet original analysis and buyer-focused magnetic separation viewpoints.",
    coverImage: cover.coverImage,
    coverAlt: cover.coverAlt || article.coverAlt,
    imageCaption: cover.imageCaption || article.imageCaption,
    imageSourceName: cover.imageSourceName,
    imageSourceUrl: cover.imageSourceUrl,
    imageLicenseNote: cover.imageLicenseNote,
    sourceImage: cover.sourceImage || article.sourceImage || null,
    bodyImages: article.bodyImages || [],
    generatedCoverPath: cover.generatedCoverPath,
    dateOverlayText: cover.dateOverlayText,
    sections: article.sections,
    faqs: article.faqs || [],
    aboutBrand: article.aboutBrand || "",
    callToAction: article.callToAction || "",
    seoGeoProfile: article.seoGeoProfile || {},
    geoEntities: article.geoEntities || {},
    imageSuggestions: article.imageSuggestions || article.suggestedImages || [],
    internalLinkSuggestions: article.internalLinkSuggestions || [],
    content,
    sources: article.sources || [],
    author: "Cowinmagnet Editorial Team",
    source: article.sources?.[0]?.name || item.sourceName || "Industry source",
    tags: article.seoKeywords || [],
    relatedProducts: article.relatedProducts || [],
    relatedProductRationale: article.relatedProductRationale || "",
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalSourceUrl: item.url,
    sourceAttributionText: article.sourceAttributionText,
    quality,
    views: 0,
    publishedAt,
    status,
    href: `/news/${slug}`,
    automation: {
      provider: item.provider || "rss",
      originalUrl: item.url,
      originalTitle: item.title,
      originalPublishedAt: item.publishedDate || "",
      retrievedDate: item.retrievedDate || new Date().toISOString(),
      relevanceScore: item.scores?.final_score || item.scores?.finalScore || 0,
      selectedSource: item.diversity?.selected_source || null,
      sourceDomain: item.diversity?.sourceDomain || "",
      sourceGroup: item.diversity?.sourceGroup || "",
      duplicationScore: item.diversity?.duplication_score ?? null,
      topicClusterId: item.diversity?.topic_cluster_id || "",
      eventClusterId: item.diversity?.eventClusterId || "",
      informationGainScore: item.diversity?.information_gain_score ?? null,
      informationGainBreakdown: item.diversity?.information_gain_breakdown || null,
      publishMode: normalizedPublishMode
    }
  });

  return {
    ...cmsItem,
    publishResult: {
      status,
      requestedStatus,
      published: status === "published",
      reason: status === "published" ? "quality-passed" : quality.errors.join("; ") || "draft-mode"
    }
  };
}
