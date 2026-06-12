import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { fetchIndustryNews } from "./fetcher.mjs";
import { scoreNewsItem, passesScoreThreshold } from "./scoring.mjs";
import { matchCowinmagnetProducts } from "./product-match.mjs";
import { buildImagePlan } from "./image-handler.mjs";
import { generateCowinmagnetContent } from "./content-generator.mjs";
import { validateGeneratedArticle } from "./compliance.mjs";
import { buildNewsFingerprints, isDuplicateNewsItem, normalizeUrl, registerNewsUsage } from "./dedupe.mjs";
import { readNewsState, saveDailyRun, saveGeneratedArticle, saveNewsState, todayKey, withNewsJobLock } from "./storage.mjs";
import { getCmsItems, saveCmsItem } from "../cmsStore.js";

function isAllowedItem(item) {
  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  const blocked = newsSystemConfig.excludedKeywords || ["election", "war", "celebrity", "sports", "stock price rumor"];
  if (
    blocked.some((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(text);
    })
  ) {
    return false;
  }

  if (item.sourceName === "Food Safety News") {
    return /metal|contamination|magnet|processing|foreign material|conveyor|inspection/.test(text);
  }

  if (/president|minister|parliament|election|sanction|armed|conflict|war/.test(text) && !/processing|recycling|equipment|plant|coal|ore/.test(text)) {
    return false;
  }

  return true;
}

function runsToday(state) {
  const today = todayKey();
  return (state.runs || []).filter((run) => String(run.startedAt || "").slice(0, 10) === today && run.publishedCount > 0).length;
}

async function readAutomationIndex() {
  const items = await getCmsItems("news", { includeInactive: true });
  const byUrl = new Map();
  for (const post of items) {
    const originalUrl = post?.automation?.originalUrl || post?.canonicalSourceUrl || "";
    if (!originalUrl) continue;
    byUrl.set(normalizeUrl(originalUrl), post);
    if (post?.canonicalSourceUrl) byUrl.set(normalizeUrl(post.canonicalSourceUrl), post);
  }
  return byUrl;
}

function findExistingAutomationPost({ item, fingerprints, state, automationIndex }) {
  const keys = [
    fingerprints?.canonicalUrl,
    normalizeUrl(item?.url || ""),
    normalizeUrl(item?.canonicalUrl || ""),
    normalizeUrl(state?.seenNews?.urls?.[fingerprints?.sourceUrlHash] || "")
  ].filter(Boolean);

  for (const key of keys) {
    const post = automationIndex.get(key);
    if (post) return post;
  }
  return null;
}

function validSourceImageFields(sourceImage) {
  if (sourceImage?.imageStatus !== "valid") {
    return {
      coverImage: "",
      coverAlt: "",
      imageCaption: "",
      imageSourceName: "",
      imageSourceUrl: "",
      imageLicenseNote: "",
      bodyImages: []
    };
  }

  return {
    coverImage: sourceImage.imageUrl || "",
    coverAlt: sourceImage.imageAlt || "",
    imageCaption: sourceImage.imageCaption || "",
    imageSourceName: sourceImage.sourceName || "",
    imageSourceUrl: sourceImage.sourcePageUrl || "",
    imageLicenseNote: `Image source: ${sourceImage.sourceName || "source article"}`,
    bodyImages: []
  };
}

function buildArticleContent(article) {
  return (article.sections || []).map((section) => `${section.heading}\n${section.body}`).join("\n\n");
}

async function publishExistingDraftIfPossible({ existingPost, item, article, cover, quality, mode }) {
  if (!existingPost || existingPost.status !== "draft" || mode !== "published") return null;
  if (quality.publishable === false || quality.passed === false) return null;
  const sourceImage = cover.sourceImage || article.sourceImage || existingPost.sourceImage || null;
  const updated = await saveCmsItem({
    ...existingPost,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category || existingPost.category || "industry-news",
    categoryTitle: article.categoryTitle || existingPost.categoryTitle || "Industry News",
    sections: article.sections,
    faqs: article.faqs || [],
    aboutBrand: article.aboutBrand || "",
    callToAction: article.callToAction || "",
    seoGeoProfile: article.seoGeoProfile || {},
    geoEntities: article.geoEntities || {},
    imageSuggestions: article.imageSuggestions || article.suggestedImages || [],
    internalLinkSuggestions: article.internalLinkSuggestions || [],
    content: buildArticleContent(article),
    sources: article.sources || [],
    source: article.sources?.[0]?.name || item.sourceName || existingPost.source,
    tags: article.seoKeywords || [],
    relatedProducts: article.relatedProducts || [],
    relatedProductRationale: article.relatedProductRationale || "",
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    canonicalSourceUrl: item.url,
    sourceAttributionText: article.sourceAttributionText,
    quality,
    ...validSourceImageFields(sourceImage),
    sourceImage,
    status: "published",
    publishedAt: existingPost.publishedAt || new Date().toISOString().slice(0, 10),
    automation: {
      ...(existingPost.automation || {}),
      originalUrl: item.url,
      originalTitle: item.title,
      originalPublishedAt: item.publishedDate || existingPost.automation?.originalPublishedAt || "",
      retrievedDate: item.retrievedDate || new Date().toISOString(),
      relevanceScore: item.scores?.final_score || item.scores?.finalScore || 0,
      publishMode: "published",
      regeneratedFromDraftAt: new Date().toISOString()
    }
  });

  return {
    ...updated,
    publishResult: {
      status: "published",
      requestedStatus: "published",
      published: true,
      reason: "existing-draft-regenerated-and-published"
    }
  };
}

function selectCandidates({ fetchedItems, state, limit, automationIndex = new Map(), mode = newsSystemConfig.publishMode }) {
  const dedupeReasons = {};
  const candidates = [];

  const scored = fetchedItems
    .filter(isAllowedItem)
    .map((item) => ({ ...item, scores: scoreNewsItem(item) }))
    .filter((item) => passesScoreThreshold(item.scores))
    .sort((a, b) => b.scores.final_score - a.scores.final_score);

  for (const item of scored) {
    const duplicate = isDuplicateNewsItem(item, state, candidates);
    if (duplicate.duplicate) {
      const existingPost = findExistingAutomationPost({ item, fingerprints: duplicate.fingerprints, state, automationIndex });
      if (duplicate.reason === "duplicate-url" && existingPost?.status === "draft" && mode === "published") {
        candidates.push({ ...item, fingerprints: duplicate.fingerprints, existingPost });
        if (candidates.length >= limit) break;
        continue;
      }
      dedupeReasons[duplicate.reason] = (dedupeReasons[duplicate.reason] || 0) + 1;
      continue;
    }

    const fingerprints = duplicate.fingerprints || buildNewsFingerprints(item);
    const existingPost = findExistingAutomationPost({ item, fingerprints, state, automationIndex });
    if (existingPost?.status === "published") {
      dedupeReasons["already-published"] = (dedupeReasons["already-published"] || 0) + 1;
      continue;
    }

    candidates.push({ ...item, fingerprints, existingPost });
    if (candidates.length >= limit) break;
  }

  return { candidates, scoredCount: scored.length, dedupeReasons };
}

async function runNewsAutomationJobUnlocked({
  limit = newsSystemConfig.output.maxItemsPerRun,
  publishLimit = 1,
  dryRun = false,
  mode = newsSystemConfig.publishMode,
  action = "job",
  requestId = ""
} = {}) {
  const startedAt = new Date().toISOString();
  const state = await readNewsState();
  const automationIndex = await readAutomationIndex();
  const fetchedItems = await fetchIndustryNews();
  const { candidates, scoredCount, dedupeReasons } = selectCandidates({ fetchedItems, state, limit, automationIndex, mode });
  const dailyQuotaRemaining = Math.max(0, newsSystemConfig.maxPostsPerDay - runsToday(state));
  const shouldPublish = ["publish", "job", "generate"].includes(action);
  const allowedPublishCount = action === "fetch" ? 0 : Math.min(publishLimit, newsSystemConfig.maxPostsPerRun, dailyQuotaRemaining);

  const items = [];
  let nextState = state;
  let publishedCount = 0;
  let savedArticleCount = 0;

  for (const item of candidates) {
    if (action === "fetch") {
      items.push({
        ...item,
        workflow: {
          status: "scored",
          history: [{ status: "scored", at: new Date().toISOString(), by: "system" }]
        }
      });
      continue;
    }

    const productMatch = matchCowinmagnetProducts(item);
    const generated = await generateCowinmagnetContent({
      item,
      scores: item.scores,
      productMatch,
      imagePlan: await buildImagePlan(item, productMatch)
    });
    const imagePlan = await buildImagePlan(item, productMatch, generated);
    if (imagePlan.sourceImage?.imageStatus !== "valid" || !imagePlan.coverImage?.imageUrl) {
      items.push({
        ...item,
        productMatch,
        imagePlan,
        generated,
        cover: {
          coverImage: "",
          coverAlt: "",
          imageCaption: "",
          imageSourceName: "",
          imageSourceUrl: "",
          imageLicenseNote: "",
          sourceImage: imagePlan.sourceImage
        },
        quality: {
          passed: false,
          publishable: false,
          draftable: false,
          errors: ["No valid source article image was found; automated news publishing requires a referenced source image."],
          warnings: [],
          wordCount: 0
        },
        articleFile: null,
        publishedArticle: null,
        workflow: {
          status: "skipped_no_source_image",
          history: [
            { status: "generated", at: new Date().toISOString(), by: "system" },
            { status: "skipped_no_source_image", at: new Date().toISOString(), by: "system" }
          ]
        }
      });
      continue;
    }
    const articleBase = {
      ...generated,
      scores: item.scores,
      publishedAt: new Date().toISOString().slice(0, 10)
    };
    const cover = imagePlan.coverImage
      ? {
          coverImage: imagePlan.coverImage.imageUrl,
          coverAlt: imagePlan.coverImage.imageAlt,
          imageCaption: imagePlan.coverImage.imageCaption,
          imageSourceName: imagePlan.coverImage.imageSourceName,
          imageSourceUrl: imagePlan.coverImage.imageSourceUrl,
          imageLicenseNote: imagePlan.coverImage.imageAttributionText,
          sourceImage: imagePlan.sourceImage,
          generatedCoverPath: "",
          dateOverlayText: new Date().toISOString().slice(0, 10)
        }
      : {
          coverImage: "",
          coverAlt: "",
          imageCaption: "",
          imageSourceName: "",
          imageSourceUrl: "",
          imageLicenseNote: "",
          sourceImage: imagePlan.sourceImage,
          generatedCoverPath: "",
          dateOverlayText: new Date().toISOString().slice(0, 10)
        };
    const generatedArticle = {
      ...articleBase,
      coverImage: cover.coverImage,
      sourceImage: cover.sourceImage,
      imageCaption: cover.imageCaption,
      bodyImages: imagePlan.bodyImages
    };
    const quality = validateGeneratedArticle(generatedArticle, {
      minInlineImages: 0
    });
    let articleFile = null;
    let publishedArticle = null;

    const republishedDraft = dryRun
      ? null
      : await publishExistingDraftIfPossible({
          existingPost: item.existingPost,
          item,
          article: generatedArticle,
          cover,
          quality,
          mode
        });

    if (republishedDraft) {
      publishedArticle = republishedDraft;
      savedArticleCount += 1;
      publishedCount += 1;
      nextState = registerNewsUsage(nextState, item, republishedDraft);
    }

    if (!publishedArticle && shouldPublish && savedArticleCount < allowedPublishCount && !dryRun) {
      const { publishGeneratedArticle } = await import("./publisher.mjs");
      publishedArticle = await publishGeneratedArticle({
        article: generatedArticle,
        cover,
        item,
        quality,
        publishMode: mode
      });
      savedArticleCount += 1;
      publishedCount += publishedArticle.publishResult.published ? 1 : 0;
      if (publishedArticle.publishResult.published) {
        nextState = registerNewsUsage(nextState, item, publishedArticle);
      }
    } else if (!dryRun && action !== "job") {
      nextState = registerNewsUsage(nextState, item, generatedArticle);
    }

    if (!dryRun) {
      articleFile = await saveGeneratedArticle(
        publishedArticle || {
          ...generatedArticle,
          quality,
          status: "draft",
          href: `/news/${generatedArticle.slug}`
        }
      );
    }

    items.push({
      ...item,
      productMatch,
      imagePlan,
      generated,
      cover,
      quality,
      articleFile,
      publishedArticle,
      workflow: {
        status: publishedArticle?.status || generated.workflowStatus || newsSystemConfig.workflow.defaultStatus,
        history: [
          { status: "generated", at: new Date().toISOString(), by: "system" },
          ...(publishedArticle ? [{ status: publishedArticle.status, at: new Date().toISOString(), by: "system" }] : [])
        ]
      }
    });

    if (savedArticleCount >= allowedPublishCount && action === "job") break;
  }

  const run = {
    requestId,
    date: todayKey(),
    action,
    mode,
    dryRun,
    status: "success",
    startedAt,
    finishedAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    brand: newsSystemConfig.brand,
    sourceCount: fetchedItems.length,
    scoredCount,
    duplicateSummary: dedupeReasons,
    selectedCount: items.length,
    savedArticleCount,
    publishedCount,
    skippedCount: Math.max(0, fetchedItems.length - items.length),
    rejectedCount: Object.values(dedupeReasons).reduce((sum, count) => sum + count, 0),
    dailyQuotaRemaining,
    items
  };

  const paths = dryRun ? null : await saveDailyRun(run);
  if (!dryRun) {
    nextState.runs = [
      {
        startedAt,
        finishedAt: new Date().toISOString(),
        action,
        mode,
        sourceCount: fetchedItems.length,
        scoredCount,
        selectedCount: items.length,
        savedArticleCount,
        publishedCount
      },
      ...(nextState.runs || [])
    ].slice(0, 200);
    await saveNewsState(nextState);
  }
  return { ...run, paths };
}

export async function runNewsAutomationJob(options = {}) {
  const startedAt = new Date().toISOString();
  const requestId = options.requestId || `news-${Date.now().toString(36)}`;
  const lockResult = await withNewsJobLock(() => runNewsAutomationJobUnlocked({ ...options, requestId }));

  if (lockResult.skippedDueToLock) {
    const run = {
      requestId,
      date: todayKey(),
      action: options.action || "job",
      mode: options.mode || newsSystemConfig.publishMode,
      dryRun: Boolean(options.dryRun),
      status: "skipped_due_to_lock",
      startedAt,
      finishedAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      brand: newsSystemConfig.brand,
      sourceCount: 0,
      scoredCount: 0,
      duplicateSummary: {},
      selectedCount: 0,
      savedArticleCount: 0,
      publishedCount: 0,
      skippedCount: 0,
      rejectedCount: 0,
      dailyQuotaRemaining: 0,
      items: []
    };
    const paths = options.dryRun ? null : await saveDailyRun(run);
    return { ...run, paths };
  }

  return lockResult.value;
}

export async function runDailyNewsSystem(options = {}) {
  return runNewsAutomationJob(options);
}
