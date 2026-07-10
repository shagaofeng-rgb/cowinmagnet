import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { fetchIndustryNews, resolveOriginalArticleUrl } from "./fetcher.mjs";
import { scoreNewsItem, passesScoreThreshold } from "./scoring.mjs";
import { matchCowinmagnetProducts } from "./product-match.mjs";
import { buildImagePlan } from "./image-handler.mjs";
import { generateCowinmagnetContent } from "./content-generator.mjs";
import { validateGeneratedArticle } from "./compliance.mjs";
import { buildNewsFingerprints, isDuplicateNewsItem, normalizeUrl, registerNewsUsage } from "./dedupe.mjs";
import {
  buildDiversityContext,
  compactRejectedSource,
  evaluateNewsDiversity,
  registerDiversityUsage
} from "./diversity.mjs";
import {
  listRecentJobRuns,
  readNewsState,
  saveDailyRun,
  saveGeneratedArticle,
  saveNewsState,
  todayKey,
  withNewsJobLock
} from "./storage.mjs";
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
  return (state.runs || []).reduce((sum, run) => {
    if (String(run.startedAt || "").slice(0, 10) !== today) return sum;
    return sum + Math.max(0, Number(run.publishedCount || 0));
  }, 0);
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
  return { byUrl, publishedPosts: items.filter((post) => post.status === "published") };
}

function findExistingAutomationPost({ item, fingerprints, state, automationIndex }) {
  const keys = [
    fingerprints?.canonicalUrl,
    normalizeUrl(item?.url || ""),
    normalizeUrl(item?.canonicalUrl || ""),
    normalizeUrl(state?.seenNews?.urls?.[fingerprints?.sourceUrlHash] || "")
  ].filter(Boolean);

  for (const key of keys) {
    const post = automationIndex.byUrl?.get(key) || automationIndex.get?.(key);
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

function processedNewsImageUrl(imageUrl = "", sourcePageUrl = "", width = 980) {
  if (!/^https?:\/\//i.test(String(imageUrl))) return "";
  const query = new URLSearchParams({ src: imageUrl, ref: sourcePageUrl || "", w: String(width) });
  return `/api/news-image?${query.toString()}`;
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
      selectedSource: item.diversity?.selected_source || existingPost.automation?.selectedSource || null,
      sourceDomain: item.diversity?.sourceDomain || existingPost.automation?.sourceDomain || "",
      sourceGroup: item.diversity?.sourceGroup || existingPost.automation?.sourceGroup || "",
      duplicationScore: item.diversity?.duplication_score ?? existingPost.automation?.duplicationScore ?? null,
      topicClusterId: item.diversity?.topic_cluster_id || existingPost.automation?.topicClusterId || "",
      eventClusterId: item.diversity?.eventClusterId || existingPost.automation?.eventClusterId || "",
      informationGainScore: item.diversity?.information_gain_score ?? existingPost.automation?.informationGainScore ?? null,
      informationGainBreakdown: item.diversity?.information_gain_breakdown || existingPost.automation?.informationGainBreakdown || null,
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

function recentNoImageUrlSet(runs = []) {
  const urls = new Set();
  const retryWindowMs = Number(process.env.NEWS_NO_IMAGE_RETRY_WINDOW_MS || 6 * 60 * 60 * 1000);
  const now = Date.now();
  for (const run of runs || []) {
    const runTime = new Date(run?.finishedAt || run?.generatedAt || run?.startedAt || 0).getTime();
    if (!Number.isFinite(runTime) || now - runTime > retryWindowMs) continue;
    for (const item of run?.items || []) {
      if (item?.workflow?.status !== "skipped_no_source_image") continue;
      const url = normalizeUrl(item?.url || item?.canonicalUrl || item?.canonicalSourceUrl || "");
      if (url) urls.add(url);
    }
  }
  return urls;
}

function isGoogleNewsItem(item = {}) {
  try {
    return new URL(item.url || "").hostname.toLowerCase().replace(/^www\./, "") === "news.google.com";
  } catch {
    return false;
  }
}

function selectCandidates({ fetchedItems, state, limit, automationIndex = new Map(), mode = newsSystemConfig.publishMode, noImageUrls = new Set() }) {
  const dedupeReasons = {};
  const rejectedSources = [];
  const candidates = [];
  const diversityContext = buildDiversityContext({ state, publishedPosts: automationIndex.publishedPosts || [] });

  const scored = fetchedItems
    .filter(isAllowedItem)
    .map((item) => ({ ...item, scores: scoreNewsItem(item) }))
    .filter((item) => passesScoreThreshold(item.scores))
    .map((item) => {
      const diversity = evaluateNewsDiversity(item, diversityContext, candidates);
      return { ...item, diversity };
    })
    .sort((a, b) => {
      const infoDiff = (b.diversity?.information_gain_score || 0) - (a.diversity?.information_gain_score || 0);
      return infoDiff || b.scores.final_score - a.scores.final_score;
    });

  const fetchedGroups = [...new Set(fetchedItems.map((item) => item.sourceGroup || item.provider || "unknown").filter(Boolean))];
  const fetchedDomains = [
    ...new Set(
      fetchedItems
        .map((item) => {
          try {
            return new URL(item.publisherUrl || item.url || item.sourceUrl || "").hostname.replace(/^www\./, "");
          } catch {
            return "";
          }
        })
        .filter(Boolean)
    )
  ];
  const recent72hDomains = new Set(diversityContext.recent72h.map((entry) => entry.sourceDomain).filter(Boolean));
  const fetchedNewDomains = fetchedDomains.filter((domain) => !recent72hDomains.has(domain));
  const requiredGroups = newsSystemConfig.sourcePool?.requiredGroupsPerRun || 3;
  const requiredNewDomains = newsSystemConfig.sourcePool?.requiredNewDomainsPerRun || 2;
  const sourcePoolReady = fetchedGroups.length >= requiredGroups && fetchedNewDomains.length >= requiredNewDomains;

  if (!sourcePoolReady) {
    const reason =
      fetchedGroups.length < requiredGroups
        ? "source-pool-insufficient-groups"
        : "source-pool-insufficient-new-domains";
    dedupeReasons[reason] = fetchedItems.length || 1;
    return {
      candidates: [],
      scoredCount: scored.length,
      dedupeReasons,
      diversityLog: {
        selected_source: [],
        rejected_sources: scored.slice(0, 80).map((item) => compactRejectedSource(item, item.diversity, reason)),
        source_pool: {
          fetched_group_count: fetchedGroups.length,
          fetched_groups: fetchedGroups,
          fetched_domain_count: fetchedDomains.length,
          fetched_domains_sample: fetchedDomains.slice(0, 30),
          fetched_new_domain_count: fetchedNewDomains.length,
          fetched_new_domains_sample: fetchedNewDomains.slice(0, 30)
        },
        rules: {
          required_groups_per_run: requiredGroups,
          required_new_domains_per_run: requiredNewDomains,
          same_domain_recent_10_limit: newsSystemConfig.diversity?.maxSameDomainInRecent10,
          semantic_reject_threshold: newsSystemConfig.diversity?.semanticSimilarityRejectThreshold,
          topic_24h_limit: newsSystemConfig.diversity?.topicLimits?.per24h,
          topic_7d_limit: newsSystemConfig.diversity?.topicLimits?.per7d,
          minimum_information_gain_score: newsSystemConfig.diversity?.minimumInformationGainScore
        }
      }
    };
  }

  for (const item of scored) {
    if (noImageUrls.has(normalizeUrl(item.url || item.canonicalUrl || ""))) {
      dedupeReasons["skipped-no-source-image-recent"] = (dedupeReasons["skipped-no-source-image-recent"] || 0) + 1;
      rejectedSources.push(compactRejectedSource(item, item.diversity, "skipped-no-source-image-recent"));
      continue;
    }

    item.diversity = evaluateNewsDiversity(item, diversityContext, candidates);
    if (item.diversity?.rejected) {
      item.diversity.rejected_reasons.forEach((reason) => {
        dedupeReasons[reason] = (dedupeReasons[reason] || 0) + 1;
      });
      rejectedSources.push(compactRejectedSource(item, item.diversity));
      continue;
    }

    const duplicate = isDuplicateNewsItem(item, state, candidates);
    if (duplicate.duplicate) {
      const existingPost = findExistingAutomationPost({ item, fingerprints: duplicate.fingerprints, state, automationIndex });
      if (duplicate.reason === "duplicate-url" && existingPost?.status === "draft" && mode === "published") {
        candidates.push({ ...item, fingerprints: duplicate.fingerprints, existingPost });
        if (candidates.length >= limit) break;
        continue;
      }
      dedupeReasons[duplicate.reason] = (dedupeReasons[duplicate.reason] || 0) + 1;
      rejectedSources.push(compactRejectedSource(item, item.diversity, duplicate.reason));
      continue;
    }

    const fingerprints = duplicate.fingerprints || buildNewsFingerprints(item);
    const existingPost = findExistingAutomationPost({ item, fingerprints, state, automationIndex });
    if (existingPost?.status === "published") {
      dedupeReasons["already-published"] = (dedupeReasons["already-published"] || 0) + 1;
      rejectedSources.push(compactRejectedSource(item, item.diversity, "already-published"));
      continue;
    }

    candidates.push({ ...item, fingerprints, existingPost });
    if (candidates.length >= limit) break;
  }

  return {
    candidates,
    scoredCount: scored.length,
    dedupeReasons,
    diversityLog: {
      selected_source: candidates.map((item) => item.diversity?.selected_source).filter(Boolean),
      rejected_sources: rejectedSources.slice(0, 80),
      source_pool: {
        fetched_group_count: fetchedGroups.length,
        fetched_groups: fetchedGroups,
        fetched_domain_count: fetchedDomains.length,
        fetched_domains_sample: fetchedDomains.slice(0, 30),
        fetched_new_domain_count: fetchedNewDomains.length,
        fetched_new_domains_sample: fetchedNewDomains.slice(0, 30)
      },
      rules: {
        required_groups_per_run: requiredGroups,
        required_new_domains_per_run: requiredNewDomains,
        same_domain_recent_10_limit: newsSystemConfig.diversity?.maxSameDomainInRecent10,
        semantic_reject_threshold: newsSystemConfig.diversity?.semanticSimilarityRejectThreshold,
        topic_24h_limit: newsSystemConfig.diversity?.topicLimits?.per24h,
        topic_7d_limit: newsSystemConfig.diversity?.topicLimits?.per7d,
        minimum_information_gain_score: newsSystemConfig.diversity?.minimumInformationGainScore
      }
    }
  };
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
  const recentRuns = await listRecentJobRuns(100);
  const noImageUrls = recentNoImageUrlSet(recentRuns);
  const fetchedItems = await fetchIndustryNews();
  const { candidates, scoredCount, dedupeReasons, diversityLog } = selectCandidates({
    fetchedItems,
    state,
    limit,
    automationIndex,
    mode,
    noImageUrls
  });
  const dailyQuotaRemaining = Math.max(0, newsSystemConfig.maxPostsPerDay - runsToday(state));
  const shouldPublish = ["publish", "job", "generate"].includes(action);
  const allowedPublishCount = action === "fetch" ? 0 : Math.min(publishLimit, newsSystemConfig.maxPostsPerRun, dailyQuotaRemaining);

  const items = [];
  let nextState = state;
  let publishedCount = 0;
  let savedArticleCount = 0;
  let googleDecodeAttempts = 0;
  const maxGoogleDecodeAttempts = Math.max(1, Number(process.env.NEWS_GOOGLE_DECODE_ATTEMPTS || 6));

  for (const candidate of candidates) {
    if (isGoogleNewsItem(candidate)) {
      if (googleDecodeAttempts >= maxGoogleDecodeAttempts) {
        dedupeReasons["google-news-decode-budget-exhausted"] =
          (dedupeReasons["google-news-decode-budget-exhausted"] || 0) + 1;
        diversityLog.rejected_sources.push(
          compactRejectedSource(candidate, candidate.diversity, "google-news-decode-budget-exhausted")
        );
        continue;
      }
      googleDecodeAttempts += 1;
    }
    const item = await resolveOriginalArticleUrl(candidate);
    if (isGoogleNewsItem(candidate) && item.resolutionError) {
      dedupeReasons["google-news-url-unresolved"] = (dedupeReasons["google-news-url-unresolved"] || 0) + 1;
      diversityLog.rejected_sources.push(compactRejectedSource(candidate, candidate.diversity, "google-news-url-unresolved"));
      continue;
    }
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

    const resolvedDuplicate = item.url !== candidate.url ? isDuplicateNewsItem(item, state, items) : { duplicate: false };
    if (resolvedDuplicate.duplicate) {
      dedupeReasons[resolvedDuplicate.reason] = (dedupeReasons[resolvedDuplicate.reason] || 0) + 1;
      continue;
    }

    const productMatch = matchCowinmagnetProducts(item);
    const imagePlan = await buildImagePlan(item, productMatch);
    const generated = await generateCowinmagnetContent({
      item,
      scores: item.scores,
      productMatch,
      imagePlan
    });
    if (imagePlan.sourceImage?.imageStatus !== "valid" || !imagePlan.coverImage?.imageUrl) {
      dedupeReasons["no-valid-source-image"] = (dedupeReasons["no-valid-source-image"] || 0) + 1;
      diversityLog.rejected_sources.push(compactRejectedSource(item, item.diversity, "no-valid-source-image"));
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
          coverImage: processedNewsImageUrl(imagePlan.coverImage.originalImageUrl || imagePlan.coverImage.imageUrl, imagePlan.sourceImage?.sourcePageUrl || item.url),
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
      bodyImages: []
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
      nextState = registerDiversityUsage(nextState, item, republishedDraft);
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
        nextState = registerDiversityUsage(nextState, item, publishedArticle);
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
    diversityLog,
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
