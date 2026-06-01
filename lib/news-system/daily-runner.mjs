import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { fetchIndustryNews } from "./fetcher.mjs";
import { scoreNewsItem, passesScoreThreshold } from "./scoring.mjs";
import { matchCowinmagnetProducts } from "./product-match.mjs";
import { buildImagePlan } from "./image-handler.mjs";
import { generateCowinmagnetContent } from "./content-generator.mjs";
import { saveDailyRun, todayKey } from "./storage.mjs";

function isAllowedItem(item) {
  const text = `${item.title || ""} ${item.description || ""}`.toLowerCase();
  const blocked = ["election", "war", "celebrity", "sports", "stock price rumor"];
  return !blocked.some((term) => text.includes(term));
}

export async function runDailyNewsSystem({ limit = newsSystemConfig.output.maxItemsPerRun, dryRun = false } = {}) {
  const fetchedItems = await fetchIndustryNews();
  let scored = fetchedItems
    .filter(isAllowedItem)
    .map((item) => ({ ...item, scores: scoreNewsItem(item) }))
    .filter((item) => passesScoreThreshold(item.scores))
    .sort((a, b) => b.scores.final_score - a.scores.final_score)
    .slice(0, limit);

  const items = [];

  for (const item of scored) {
    const productMatch = matchCowinmagnetProducts(item);
    const imagePlan = await buildImagePlan(item, productMatch);
    const generated = await generateCowinmagnetContent({
      item,
      scores: item.scores,
      productMatch,
      imagePlan
    });

    items.push({
      ...item,
      productMatch,
      imagePlan,
      generated,
      workflow: {
        status: generated.workflowStatus || newsSystemConfig.workflow.defaultStatus,
        history: [{ status: "generated", at: new Date().toISOString(), by: "system" }]
      }
    });
  }

  const run = {
    date: todayKey(),
    generatedAt: new Date().toISOString(),
    brand: newsSystemConfig.brand,
    sourceCount: fetchedItems.length,
    selectedCount: items.length,
    items
  };

  const paths = dryRun ? null : await saveDailyRun(run);
  return { ...run, paths };
}
