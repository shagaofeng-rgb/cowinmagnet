import { runNewsAutomationJob } from "../lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "../config/news-system.config.mjs";

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

const command = process.argv[2] || "job";
const actionMap = {
  fetch: "fetch",
  generate: "generate",
  publish: "publish",
  job: "job",
  daily: "job"
};

const action = actionMap[command] || "job";
const dryRun = process.argv.includes("--dry-run");
// Command-line collection is review-only as well. A published status may only
// be set by an editor in the CMS after the article has been reviewed.
const mode = "draft";
const limit = Number(argValue("limit", process.env.NEWS_RUN_LIMIT || "8"));
const publishLimit = Number(argValue("publish-limit", "1"));

const run = await runNewsAutomationJob({ action, dryRun, mode, limit, publishLimit });

console.log(
  JSON.stringify(
    {
      date: run.date,
      action: run.action,
      mode: run.mode,
      dryRun: run.dryRun,
      sourceCount: run.sourceCount,
      scoredCount: run.scoredCount,
      selectedCount: run.selectedCount,
      savedArticleCount: run.savedArticleCount,
      publishedCount: run.publishedCount,
      duplicateSummary: run.duplicateSummary,
      selected_source: run.diversityLog?.selected_source || [],
      rejected_sources: run.diversityLog?.rejected_sources || [],
      source_pool: run.diversityLog?.source_pool || null,
      jsonPath: run.paths?.jsonPath,
      markdownPath: run.paths?.markdownPath
    },
    null,
    2
  )
);
