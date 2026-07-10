import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { runNewsAutomationJob } from "@/lib/news-system/daily-runner.mjs";
import { newsSystemConfig } from "@/config/news-system.config.mjs";
import { listRecentJobRuns, saveDailyRun, todayKey } from "@/lib/news-system/storage.mjs";
import { isCronAuthorized } from "@/lib/cronAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizedTimezone(value = newsSystemConfig.timezone || "Asia/Shanghai") {
  const candidate = String(value || "").trim() || "Asia/Shanghai";
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: candidate }).format(new Date());
    return candidate;
  } catch {
    return "Asia/Shanghai";
  }
}

function zonedDateKey(date = new Date(), timeZone = newsSystemConfig.timezone || "Asia/Shanghai") {
  const timezone = normalizedTimezone(timeZone);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function zonedTimeParts(date = new Date(), timeZone = newsSystemConfig.timezone || "Asia/Shanghai") {
  const timezone = normalizedTimezone(timeZone);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const partValue = (type) => Number(parts.find((part) => part.type === type)?.value || 0);
  return { hour: partValue("hour"), minute: partValue("minute") };
}

function seededNumber(seed) {
  const hash = crypto.createHash("sha256").update(seed).digest();
  return hash.readUInt32BE(0);
}

function dailyRandomPublishSlots(dateKey, dailyLimit) {
  const slotsPerDay = 48;
  const count = Math.max(1, Math.min(Number(dailyLimit || 4), slotsPerDay));
  const slots = new Set();
  let index = 0;
  while (slots.size < count && index < slotsPerDay * 4) {
    slots.add(seededNumber(`${dateKey}:${index}`) % slotsPerDay);
    index += 1;
  }
  return [...slots].sort((a, b) => a - b);
}

function formatSlot(slot) {
  const hour = Math.floor(slot / 2);
  const minute = slot % 2 ? 30 : 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

async function dailyPublishQuotaStatus() {
  const dailyLimit = Number(newsSystemConfig.maxPostsPerDay || 4);
  const timezone = normalizedTimezone(newsSystemConfig.timezone || "Asia/Shanghai");
  const today = zonedDateKey(new Date(), timezone);
  const nowParts = zonedTimeParts(new Date(), timezone);
  const currentSlot = nowParts.hour * 2 + (nowParts.minute >= 30 ? 1 : 0);
  const publishSlots = dailyRandomPublishSlots(today, dailyLimit);
  const dueSlotCount = publishSlots.filter((slot) => slot <= currentSlot).length;
  const recentRuns = await listRecentJobRuns(200);
  const publishedToday = recentRuns.reduce((sum, run) => {
    const publishedCount = Number(run?.publishedCount || 0);
    if (run?.action !== "job" || run?.status !== "success" || publishedCount <= 0) return sum;
    const finishedAt = run?.finishedAt || run?.generatedAt || run?.startedAt;
    if (!finishedAt || zonedDateKey(new Date(finishedAt), timezone) !== today) return sum;
    return sum + publishedCount;
  }, 0);

  return {
    quotaReached: publishedToday >= dailyLimit,
    today,
    timezone,
    publishedToday,
    dailyLimit,
    remainingToday: Math.max(0, dailyLimit - publishedToday),
    publishSlots,
    publishSlotTimes: publishSlots.map(formatSlot),
    currentSlot,
    currentSlotTime: formatSlot(currentSlot),
    dueSlotCount,
    dueNow: publishedToday < dueSlotCount
  };
}

function currentMode() {
  return String(process.env.NEWS_PUBLISH_MODE || newsSystemConfig.publishMode).trim();
}

function publicErrorMessage(error) {
  return String(error?.message || "News automation failed").slice(0, 500);
}

async function recordSkippedRun({ requestId, startedAt, reason, data = {} }) {
  const finishedAt = new Date().toISOString();
  const run = {
    requestId,
    date: todayKey(new Date(startedAt)),
    action: "job",
    mode: currentMode(),
    status: "skipped",
    skipReason: reason,
    startedAt,
    finishedAt,
    generatedAt: finishedAt,
    sourceCount: 0,
    scoredCount: 0,
    selectedCount: 0,
    savedArticleCount: 0,
    publishedCount: 0,
    skippedCount: 1,
    rejectedCount: 0,
    duplicateSummary: { [reason]: 1 },
    diversityLog: {
      selected_source: [],
      rejected_sources: [
        {
          source: "cron",
          domain: "cowinmagnet.com",
          url: "/api/cron/news-automation",
          reason,
          duplication_score: null,
          topic_cluster_id: null,
          information_gain_score: null
        }
      ],
      source_pool: null
    },
    items: [],
    ...data
  };
  await saveDailyRun(run);
  return run;
}

async function recordFailedRun({ requestId, startedAt, error }) {
  try {
    const finishedAt = new Date().toISOString();
    await saveDailyRun({
      requestId,
      date: todayKey(new Date(startedAt)),
      action: "job",
      mode: currentMode(),
      status: "failed",
      startedAt,
      finishedAt,
      generatedAt: finishedAt,
      sourceCount: 0,
      scoredCount: 0,
      selectedCount: 0,
      savedArticleCount: 0,
      publishedCount: 0,
      skippedCount: 0,
      rejectedCount: 0,
      errorMessage: publicErrorMessage(error),
      items: []
    });
  } catch (recordError) {
    console.error("[news-automation] failed to record failed run", {
      requestId,
      message: recordError?.message || String(recordError)
    });
  }
}

async function handleCron(request) {
  const requestId = crypto.randomUUID();
  const startedAt = new Date().toISOString();
  if (!isCronAuthorized(request, { additionalSecrets: [process.env.NEWS_SYSTEM_ADMIN_TOKEN] })) {
    return NextResponse.json(
      { success: false, error: "Unauthorized", requestId },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const quota = await dailyPublishQuotaStatus();
    if (quota.quotaReached) {
      const skippedRun = await recordSkippedRun({
        requestId,
        startedAt,
        reason: "daily-news-quota-reached",
        data: quota
      });
      return NextResponse.json(
        {
          success: true,
          requestId,
          data: {
            date: skippedRun.date,
            status: "quota_reached",
            mode: currentMode(),
            publishedCount: 0,
            savedArticleCount: 0,
            selectedCount: 0,
            skippedCount: 1,
            reason: "daily-news-quota-reached",
            ...quota
          }
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!quota.dueNow) {
      const reason = quota.dueSlotCount <= quota.publishedToday ? "daily-random-window-already-filled" : "daily-random-window-not-due";
      const skippedRun = await recordSkippedRun({
        requestId,
        startedAt,
        reason,
        data: quota
      });
      return NextResponse.json(
        {
          success: true,
          requestId,
          data: {
            date: skippedRun.date,
            status: "skipped",
            mode: currentMode(),
            publishedCount: 0,
            savedArticleCount: 0,
            selectedCount: 0,
            skippedCount: 1,
            reason,
            ...quota
          }
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const run = await runNewsAutomationJob({
      action: "job",
      mode: currentMode(),
      publishLimit: newsSystemConfig.maxPostsPerRun,
      limit: Number(process.env.NEWS_RUN_LIMIT || 20),
      requestId
    });

    return NextResponse.json(
      {
        success: true,
        requestId,
        data: {
          date: run.date,
          status: run.status,
          mode: run.mode,
          sourceCount: run.sourceCount,
          scoredCount: run.scoredCount,
          selectedCount: run.selectedCount,
          savedArticleCount: run.savedArticleCount,
          publishedCount: run.publishedCount,
          duplicateSummary: run.duplicateSummary,
          diversityLog: run.diversityLog,
          items: run.items.map((item) => ({
            title: item.generated?.title || item.title,
            source: item.sourceName,
            score: item.scores.final_score,
            status: item.workflow.status,
            href: item.publishedArticle?.href || null,
            qualityPassed: item.quality?.passed || false
          }))
        }
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[news-automation] cron failed", {
      requestId,
      message: error?.message || String(error),
      stack: error?.stack || ""
    });
    await recordFailedRun({ requestId, startedAt, error });
    return NextResponse.json(
      { success: false, error: "News automation failed", errorMessage: publicErrorMessage(error), requestId },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function GET(request) {
  return handleCron(request);
}

export async function POST(request) {
  return handleCron(request);
}
