import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { fetchIndustryNews } from "./fetcher.mjs";
import { scoreNewsItem, passesScoreThreshold } from "./scoring.mjs";
import { matchCowinmagnetProducts } from "./product-match.mjs";
import { buildImagePlan } from "./image-handler.mjs";
import { generateCowinmagnetContent } from "./content-generator.mjs";
import { validateGeneratedArticle } from "./compliance.mjs";
import { isDuplicateNewsItem, registerNewsUsage } from "./dedupe.mjs";
import { readNewsState, saveDailyRun, saveGeneratedArticle, saveNewsState, todayKey } from "./storage.mjs";

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

function selectCandidates({ fetchedItems, state, limit }) {
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
      dedupeReasons[duplicate.reason] = (dedupeReasons[duplicate.reason] || 0) + 1;
      continue;
    }

    candidates.push({ ...item, fingerprints: duplicate.fingerprints });
    if (candidates.length >= limit) break;
  }

  return { candidates, scoredCount: scored.length, dedupeReasons };
}

export async function runNewsAutomationJob({
  limit = newsSystemConfig.output.maxItemsPerRun,
  publishLimit = 1,
  dryRun = false,
  mode = newsSystemConfig.publishMode,
  action = "job"
} = {}) {
  const startedAt = new Date().toISOString();
  const state = await readNewsState();
  const fetchedItems = await fetchIndustryNews();
  const { candidates, scoredCount, dedupeReasons } = selectCandidates({ fetchedItems, state, limit });
  const dailyQuotaRemaining = Math.max(0, newsSystemConfig.maxPostsPerDay - runsToday(state));
  const shouldPublish = ["publish", "job", "generate"].includes(action);
  const allowedPublishCount = action === "fetch" ? 0 : Math.min(publishLimit, dailyQuotaRemaining);

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
          generatedCoverPath: "",
          dateOverlayText: new Date().toISOString().slice(0, 10)
        }
      : {
          coverImage: "",
          coverAlt: articleBase.coverAlt || articleBase.title,
          imageCaption: "No approved real image was matched. This article must remain draft until a company-library, licensed source, or photorealistic generated image is attached.",
          imageSourceName: "",
          imageSourceUrl: "",
          imageLicenseNote: "",
          generatedCoverPath: "",
          dateOverlayText: new Date().toISOString().slice(0, 10)
        };
    const generatedArticle = {
      ...articleBase,
      coverImage: cover.coverImage,
      imageCaption: cover.imageCaption,
      bodyImages: imagePlan.bodyImages
    };
    const quality = validateGeneratedArticle(generatedArticle, {
      minInlineImages: newsSystemConfig.imagePolicy.minInlineImages
    });
    let articleFile = null;
    let publishedArticle = null;

    if (shouldPublish && savedArticleCount < allowedPublishCount && !dryRun) {
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
      nextState = registerNewsUsage(nextState, item, publishedArticle);
    } else if (!dryRun) {
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
    date: todayKey(),
    action,
    mode,
    dryRun,
    startedAt,
    generatedAt: new Date().toISOString(),
    brand: newsSystemConfig.brand,
    sourceCount: fetchedItems.length,
    scoredCount,
    duplicateSummary: dedupeReasons,
    selectedCount: items.length,
    savedArticleCount,
    publishedCount,
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

export async function runDailyNewsSystem(options = {}) {
  return runNewsAutomationJob(options);
}
