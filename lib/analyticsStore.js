import fs from "node:fs/promises";
import path from "node:path";
import {
  appendDatabaseEvent,
  isDatabaseConfigured,
  readDatabaseEvents,
  readDatabaseVisitorHistory
} from "@/lib/analyticsDatabase";
import { getLiveSearchConsoleSnapshot } from "@/lib/searchConsoleClient";
import { attributionToUtm, classifyTraffic } from "@/lib/trafficAttribution";

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-analytics") : path.join(process.cwd(), ".data");
const EVENT_FILE = path.join(DATA_DIR, "analytics-events.jsonl");
const SNAPSHOT_CACHE_TTL_MS = Number(process.env.ADMIN_ANALYTICS_CACHE_TTL_MS || 2 * 60 * 1000);
const snapshotCache = new Map();

function canUseFileAnalytics() {
  if (!process.env.VERCEL) return true;
  return process.env.DISABLE_ANALYTICS_FILE_FALLBACK !== "1";
}

export function getAnalyticsStorageMode() {
  if (isDatabaseConfigured()) return "database";
  if (!canUseFileAnalytics()) return "not-configured";
  return process.env.VERCEL ? "server-file-fallback" : "local-file";
}

function safeJson(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function normalizeClientIp(ip) {
  if (!ip) return "";
  const value = ip.split(",")[0].trim();
  return value;
}

function detectDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "Tablet";
  if (/mobile|iphone|android/.test(ua)) return "Mobile";
  return "Desktop";
}

function detectBrowser(userAgent = "") {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return "Safari";
  if (/firefox/i.test(userAgent)) return "Firefox";
  return "Other";
}

function detectOs(userAgent = "") {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/iphone|ipad|ios/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/mac os|macintosh/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function detectChannel(event) {
  if (event.attribution?.sessionTouch?.channel) return event.attribution.sessionTouch.channel;
  const utmSource = event.utm?.source || "";
  const utmMedium = event.utm?.medium || "";
  const referrer = event.referrer || "";
  if (utmSource) return utmMedium || `campaign:${utmSource}`;
  if (!referrer) return "Direct";
  if (isAiSearchReferrer(referrer)) return "AI Search";
  if (/google|bing|yahoo|duckduckgo|yandex|baidu/i.test(referrer)) return "Organic Search";
  if (/facebook|instagram|linkedin|youtube|tiktok/i.test(referrer)) return "Social";
  return "Referral";
}

function hostFromUrl(value = "") {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function isAiSearchReferrer(value = "") {
  const host = hostFromUrl(value).toLowerCase();
  return /(^|\.)((ai|search).*index|chatgpt|openai|perplexity|claude|gemini|copilot|you|phind)\./i.test(host);
}

function detectAiSearchPlatform(value = "") {
  const host = hostFromUrl(value).toLowerCase();
  if (!host) return "";
  if (/chatgpt|openai/.test(host)) return "ChatGPT";
  if (/perplexity/.test(host)) return "Perplexity";
  if (/claude/.test(host)) return "Claude";
  if (/gemini/.test(host)) return "Gemini";
  if (/copilot|bing\.com\/chat/.test(`${host} ${value.toLowerCase()}`)) return "Microsoft Copilot";
  if (/phind/.test(host)) return "Phind";
  if (/you\.com/.test(host)) return "You.com";
  if (/aisearchindex/.test(host)) return "AI Search Index";
  return "";
}

function detectSourcePlatform(event) {
  if (event.attribution?.sessionTouch?.platform) return event.attribution.sessionTouch.platform;
  const source = String(event.utm?.source || "").toLowerCase();
  const referrer = String(event.referrer || "").toLowerCase();
  const combined = `${source} ${referrer}`;
  const aiSearchPlatform = detectAiSearchPlatform(event.referrer || "");

  if (/google/.test(combined)) return "Google";
  if (/facebook|fb\.com/.test(combined)) return "Facebook";
  if (/instagram/.test(combined)) return "Instagram";
  if (/linkedin/.test(combined)) return "LinkedIn";
  if (/tiktok/.test(combined)) return "TikTok";
  if (/youtube|youtu\.be/.test(combined)) return "YouTube";
  if (/\bx\b|twitter/.test(combined)) return "X / Twitter";
  if (/bing/.test(combined)) return "Bing";
  if (/yahoo/.test(combined)) return "Yahoo";
  if (/duckduckgo/.test(combined)) return "DuckDuckGo";
  if (aiSearchPlatform) return aiSearchPlatform;
  if (event.utm?.source) return event.utm.source;
  if (event.referrer) return hostFromUrl(event.referrer) || "Referral";
  return "Direct entry";
}

function sourceDetail(event) {
  if (event.attribution?.sessionTouch?.source) {
    const touch = event.attribution.sessionTouch;
    return [
      `source=${touch.source}`,
      touch.medium ? `medium=${touch.medium}` : "",
      touch.campaign ? `campaign=${touch.campaign}` : "",
      touch.clickIdType ? `click_id=${touch.clickIdType}` : ""
    ].filter(Boolean).join(" / ");
  }
  if (event.utm?.source) {
    const parts = [
      `utm_source=${event.utm.source}`,
      event.utm.medium ? `utm_medium=${event.utm.medium}` : "",
      event.utm.campaign ? `utm_campaign=${event.utm.campaign}` : ""
    ].filter(Boolean);
    return parts.join(" / ");
  }
  return event.referrer ? hostFromUrl(event.referrer) || event.referrer : "No referrer or UTM";
}

function attributeEvent(event) {
  return {
    ...event,
    channel: detectChannel(event),
    sourcePlatform: detectSourcePlatform(event),
    sourceDetail: sourceDetail(event)
  };
}

function cleanStoredEvent(event) {
  if (!event || typeof event !== "object") return event;
  return {
    ...event,
    page: cleanPagePath(event.page || "/"),
    previousPage: event.previousPage ? cleanPagePath(event.previousPage) : ""
  };
}

function getHeader(request, key) {
  return request.headers.get(key) || "";
}

function cleanPagePath(value = "/") {
  const raw = String(value || "/").slice(0, 300);
  try {
    const url = raw.startsWith("http") ? new URL(raw) : new URL(raw, "https://cowinmagnet.com");
    ["fbclid", "gclid", "gbraid", "wbraid", "msclkid", "ttclid", "li_fat_id"].forEach((key) =>
      url.searchParams.delete(key)
    );
    [...url.searchParams.keys()].forEach((key) => {
      if (key.startsWith("utm_")) url.searchParams.delete(key);
    });
    const query = url.searchParams.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`.slice(0, 240) || "/";
  } catch {
    return raw.split("?")[0] || "/";
  }
}

export function normalizeAnalyticsEvent(payload, request) {
  const userAgent = getHeader(request, "user-agent");
  const now = new Date().toISOString();
  const currentUrl = payload.currentUrl || payload.page || request.url;
  const serverTouch = classifyTraffic({
    currentUrl,
    search: currentUrl.includes("?") ? currentUrl.split("?").slice(1).join("?") : "",
    referrer: payload.referrer || getHeader(request, "referer"),
    countryCode: getHeader(request, "x-vercel-ip-country") || "Unknown",
    locale: payload.sourceLanguage || ""
  });
  const attribution = payload.attribution && typeof payload.attribution === "object"
    ? {
        firstTouch: payload.attribution.firstTouch || serverTouch,
        lastTouch: payload.attribution.lastTouch || serverTouch,
        sessionTouch: payload.attribution.sessionTouch || serverTouch
      }
    : { firstTouch: serverTouch, lastTouch: serverTouch, sessionTouch: serverTouch };
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: payload.type || "page_view",
    visitorId: String(payload.visitorId || "anonymous").slice(0, 80),
    sessionId: String(payload.sessionId || "session").slice(0, 80),
    page: cleanPagePath(payload.page || "/"),
    previousPage: payload.previousPage ? cleanPagePath(payload.previousPage) : "",
    pageTitle: String(payload.pageTitle || "").slice(0, 180),
    referrer: String(payload.referrer || "").slice(0, 240),
    outboundUrl: String(payload.outboundUrl || "").slice(0, 240),
    targetText: String(payload.targetText || "").slice(0, 120),
    scrollDepth: Number(payload.scrollDepth || 0),
    duration: Number(payload.duration || 0),
    utm: attributionToUtm(attribution.sessionTouch),
    attribution,
    eventId: String(payload.eventId || "").slice(0, 160),
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    device: payload.device || detectDevice(userAgent),
    userAgent: userAgent.slice(0, 360),
    ip: normalizeClientIp(getHeader(request, "x-forwarded-for") || getHeader(request, "x-real-ip")),
    country: getHeader(request, "x-vercel-ip-country") || "Unknown",
    region: getHeader(request, "x-vercel-ip-country-region") || "",
    city: getHeader(request, "x-vercel-ip-city") || "",
    clientTimestamp: payload.timestamp || "",
    timestamp: now
  };
  event.channel = detectChannel(event);
  event.sourcePlatform = detectSourcePlatform(event);
  event.sourceDetail = sourceDetail(event);
  return event;
}

export async function appendAnalyticsEvent(event) {
  if (isDatabaseConfigured()) {
    try {
      const saved = await appendDatabaseEvent(event);
      if (saved) return { ok: true, storageMode: "database" };
    } catch (error) {
      console.error("Database analytics write failed", error);
      throw error;
    }
  }

  if (!canUseFileAnalytics()) {
    return {
      ok: false,
      storageMode: "not-configured",
      message: "DATABASE_URL is not configured, so production analytics events are not persisted."
    };
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(EVENT_FILE, `${JSON.stringify(event)}\n`, "utf8");
  return { ok: true, storageMode: getAnalyticsStorageMode() };
}

export async function readAnalyticsEvents(options = {}) {
  if (isDatabaseConfigured()) {
    try {
      const events = await readDatabaseEvents(options);
      return events || [];
    } catch (error) {
      console.error("Database analytics read failed", error);
      return [];
    }
  }

  if (!canUseFileAnalytics()) return [];

  try {
    const text = await fs.readFile(EVENT_FILE, "utf8");
    const events = text.split(/\r?\n/).map(safeJson).filter(Boolean);
    return events;
  } catch {
    return [];
  }
}

async function readVisitorHistoryEvents(options = {}) {
  if (isDatabaseConfigured()) {
    try {
      const events = await readDatabaseVisitorHistory(options);
      return events || [];
    } catch (error) {
      console.error("Database visitor history read failed", error);
      return [];
    }
  }

  const events = await readAnalyticsEvents(options);
  return events
    .filter((event) => event.type === "page_view" && event.visitorId)
    .map((event) => ({
      type: "page_view",
      visitorId: event.visitorId,
      timestamp: event.timestamp
    }));
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function inRange(event, startDate, endDate) {
  const time = new Date(event.timestamp).getTime();
  return time >= startDate.getTime() && time <= endDate.getTime();
}

function unique(events, key) {
  return new Set(events.map((event) => event[key]).filter(Boolean)).size;
}

function dayKey(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function buildVisitorDayProfiles(events) {
  const daysByVisitor = new Map();

  events
    .filter((event) => event.type === "page_view" && event.visitorId)
    .forEach((event) => {
      const date = dayKey(event.timestamp);
      if (!date) return;
      if (!daysByVisitor.has(event.visitorId)) daysByVisitor.set(event.visitorId, new Set());
      daysByVisitor.get(event.visitorId).add(date);
    });

  const profileMap = new Map();

  daysByVisitor.forEach((dates, visitorId) => {
    [...dates]
      .sort()
      .forEach((date, index) => {
        const visitDayNumber = index + 1;
        profileMap.set(`${visitorId}::${date}`, {
          visitDate: date,
          visitDayNumber,
          customerType: visitDayNumber === 1 ? "New Customer" : "Returning Customer",
          customerTypeLabel: visitDayNumber === 1 ? "新客户" : "老客户"
        });
      });
  });

  return profileMap;
}

function buildVisitorNumbers(events) {
  const firstSeen = new Map();

  events
    .filter((event) => event.type === "page_view" && event.visitorId)
    .forEach((event) => {
      const time = new Date(event.timestamp).getTime();
      if (Number.isNaN(time)) return;
      const existing = firstSeen.get(event.visitorId);
      if (!existing || time < existing) firstSeen.set(event.visitorId, time);
    });

  return new Map(
    [...firstSeen.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(([visitorId], index) => [visitorId, index + 1])
  );
}

function getVisitorProfile(event, profileMap) {
  const fallback = {
    visitDate: dayKey(event.timestamp),
    visitDayNumber: 1,
    customerType: "New Customer",
    customerTypeLabel: "新客户"
  };

  if (!event.visitorId) return fallback;
  return profileMap.get(`${event.visitorId}::${dayKey(event.timestamp)}`) || fallback;
}

function countBy(events, key, limit = 12) {
  const map = new Map();
  events.forEach((event) => {
    const value = event[key] || "Unknown";
    map.set(value, (map.get(value) || 0) + 1);
  });
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function attributionTouch(event, model = "session") {
  if (model === "first") return event.attribution?.firstTouch || {};
  if (model === "last") return event.attribution?.lastTouch || {};
  return event.attribution?.sessionTouch || {};
}

function acquisitionRows(events, model = "session") {
  const map = new Map();
  events.filter((event) => event.type === "page_view").forEach((event) => {
    const touch = attributionTouch(event, model);
    const key = `${touch.source || event.sourcePlatform || "unknown"}::${touch.medium || event.channel || "unknown"}::${touch.campaign || ""}::${touch.platform || event.sourcePlatform || "Unknown"}::${touch.landingPage || event.page || "/"}`;
    const item = map.get(key) || {
      source: touch.source || event.sourcePlatform || "unknown",
      medium: touch.medium || event.channel || "unknown",
      channel: touch.channel || touch.medium || event.channel || "unknown",
      platform: touch.platform || event.sourcePlatform || "Unknown",
      campaign: touch.campaign || "",
      landingPage: touch.landingPage || event.page || "/",
      visitors: new Set(),
      sessions: new Set(),
      pageViews: 0,
      leads: 0
    };
    item.visitors.add(event.visitorId);
    item.sessions.add(event.sessionId);
    item.pageViews += 1;
    map.set(key, item);
  });

  events.filter((event) => ["submit_inquiry", "form_submit"].includes(event.type)).forEach((event) => {
    const touch = attributionTouch(event, model);
    const match = [...map.values()].find((item) =>
      item.source === (touch.source || event.sourcePlatform || "unknown") &&
      item.medium === (touch.medium || event.channel || "unknown") &&
      item.campaign === (touch.campaign || "")
    );
    if (match) match.leads += 1;
  });

  return [...map.values()]
    .map((item) => ({
      ...item,
      visitors: item.visitors.size,
      sessions: item.sessions.size,
      conversionRate: item.pageViews ? Number(((item.leads / item.pageViews) * 100).toFixed(2)) : 0
    }))
    .sort((a, b) => b.pageViews - a.pageViews);
}

function pageStats(events) {
  const map = new Map();
  events
    .filter((event) => event.type === "page_view")
    .forEach((event) => {
      const item = map.get(event.page) || {
        page: event.page,
        title: event.pageTitle || event.page,
        views: 0,
        visitors: new Set(),
        avgDuration: 0,
        durationTotal: 0,
        inquiries: 0
      };
      item.views += 1;
      item.visitors.add(event.visitorId);
      item.durationTotal += Number(event.duration || 0);
      map.set(event.page, item);
    });

  events
    .filter((event) => event.type === "form_submit")
    .forEach((event) => {
      const item = map.get(event.page);
      if (item) item.inquiries += 1;
    });

  return [...map.values()]
    .map((item) => ({
      ...item,
      visitors: item.visitors.size,
      avgDuration: item.views ? Math.round(item.durationTotal / item.views) : 0,
      conversionRate: item.views ? Number(((item.inquiries / item.views) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.views - a.views);
}

function seriesByDay(events, startDate, endDate) {
  const dayMap = new Map();
  const cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  while (cursor <= end) {
    const date = dayKey(cursor);
    dayMap.set(date, { date, pv: 0, uv: new Set(), inquiries: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  events.forEach((event) => {
    const date = dayKey(event.timestamp);
    if (!dayMap.has(date)) return;
    const item = dayMap.get(date);
    if (event.type === "page_view") {
      item.pv += 1;
      item.uv.add(event.visitorId);
    }
    if (event.type === "form_submit") item.inquiries += 1;
  });
  return [...dayMap.values()].map((item) => ({ ...item, uv: item.uv.size }));
}

function resolveSnapshotRange({ days = 14, startDate, endDate } = {}) {
  const resolvedEnd = endDate ? new Date(endDate) : new Date();
  const resolvedStart = startDate ? new Date(startDate) : daysAgo(days - 1);
  if (!startDate) resolvedStart.setHours(0, 0, 0, 0);
  if (!endDate) resolvedEnd.setHours(23, 59, 59, 999);
  const rangeDays = Math.max(1, Math.ceil((resolvedEnd - resolvedStart + 1) / 86400000));
  return { startDate: resolvedStart, endDate: resolvedEnd, rangeDays };
}

function snapshotCacheKey({ startDate, endDate, includeSearchConsole }) {
  return [
    startDate.toISOString(),
    endDate.toISOString(),
    includeSearchConsole ? "gsc" : "analytics",
    getAnalyticsStorageMode()
  ].join("|");
}

export async function getAnalyticsSnapshot(options = {}) {
  const { startDate, endDate, rangeDays } = resolveSnapshotRange(options);
  const includeSearchConsole = options.includeSearchConsole === true;
  const useCache = options.cache !== false;
  const cacheKey = snapshotCacheKey({ startDate, endDate, includeSearchConsole });
  const cached = snapshotCache.get(cacheKey);
  if (useCache && cached && Date.now() - cached.createdAt < SNAPSHOT_CACHE_TTL_MS) {
    return {
      ...cached.value,
      cache: {
        status: "hit",
        generatedAt: cached.value.generatedAt,
        ttlMs: SNAPSHOT_CACHE_TTL_MS
      }
    };
  }

  const [currentEvents, historyEvents] = await Promise.all([
    readAnalyticsEvents({ startDate, endDate, days: Math.min(731, rangeDays + 3), limit: 50000 }),
    readVisitorHistoryEvents({ days: 731, limit: 100000 })
  ]);
  const visitorDayProfiles = buildVisitorDayProfiles(historyEvents);
  const visitorNumbers = buildVisitorNumbers(historyEvents);
  const events = currentEvents.map(cleanStoredEvent).filter((event) => inRange(event, startDate, endDate));
  const pageViewEvents = events.filter((event) => event.type === "page_view");
  const attributedPageViewEvents = pageViewEvents.map(attributeEvent);
  const formEvents = events.filter((event) => event.type === "form_submit");
  const sessions = unique(pageViewEvents, "sessionId");
  const sessionPageViews = new Map();
  pageViewEvents.forEach((event) => {
    const sessionId = event.sessionId || event.visitorId || event.id;
    sessionPageViews.set(sessionId, (sessionPageViews.get(sessionId) || 0) + 1);
  });
  const bounceRate = sessionPageViews.size
    ? Math.round(
        ([...sessionPageViews.values()].filter((views) => views <= 1).length / sessionPageViews.size) * 100
      )
    : 0;
  const avgDuration = pageViewEvents.length
    ? Math.round(pageViewEvents.reduce((sum, event) => sum + Number(event.duration || 0), 0) / pageViewEvents.length)
    : 0;
  const journeyMap = new Map();

  events.forEach((event) => {
    if (!event.previousPage || event.type !== "page_view") return;
    const key = `${event.previousPage} -> ${event.page}`;
    journeyMap.set(key, (journeyMap.get(key) || 0) + 1);
  });

  const pages = pageStats(events);
  const dashboard = {
    rangeDays,
    rangeStart: startDate.toISOString(),
    rangeEnd: endDate.toISOString(),
    storageMode: getAnalyticsStorageMode(),
    trackingConfigured: isDatabaseConfigured() || canUseFileAnalytics(),
    generatedAt: new Date().toISOString(),
    overview: {
      pageViews: pageViewEvents.length,
      uniqueVisitors: unique(pageViewEvents, "visitorId"),
      sessions,
      inquiries: formEvents.length,
      avgDuration,
      bounceRate
    },
    traffic: {
      series: seriesByDay(events, startDate, endDate),
      channels: countBy(attributedPageViewEvents, "channel", 8),
      countries: countBy(pageViewEvents, "country", 10),
      sourcePlatforms: countBy(attributedPageViewEvents, "sourcePlatform", 10),
      devices: countBy(pageViewEvents, "device", 6),
      browsers: countBy(pageViewEvents, "browser", 6),
      operatingSystems: countBy(pageViewEvents, "os", 6)
    },
    acquisition: {
      session: acquisitionRows(attributedPageViewEvents.concat(formEvents), "session"),
      first: acquisitionRows(attributedPageViewEvents.concat(formEvents), "first"),
      last: acquisitionRows(attributedPageViewEvents.concat(formEvents), "last"),
      campaigns: acquisitionRows(attributedPageViewEvents.concat(formEvents), "session")
        .filter((row) => row.campaign)
        .map((row) => ({
          utm_campaign: row.campaign,
          utm_source: row.source,
          utm_medium: row.medium,
          visitors: row.visitors,
          sessions: row.sessions,
          pageViews: row.pageViews,
          leads: row.leads,
          conversionRate: row.conversionRate
        }))
    },
    visitors: attributedPageViewEvents
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 80)
      .map((event) => {
        const profile = getVisitorProfile(event, visitorDayProfiles);
        return {
          visitorId: event.visitorId,
          customerNumber: visitorNumbers.get(event.visitorId) || 0,
          sessionId: event.sessionId,
          country: event.country,
          city: event.city,
          device: event.device,
          browser: event.browser,
          os: event.os,
          channel: event.channel,
          sourcePlatform: event.sourcePlatform,
          sourceDetail: event.sourceDetail,
          referrer: event.referrer || "",
          page: event.page,
          ip: event.ip,
          timestamp: event.timestamp,
          visitDate: profile.visitDate,
          visitDayNumber: profile.visitDayNumber,
          customerType: profile.customerType,
          customerTypeLabel: profile.customerTypeLabel
        };
      }),
    pages,
    landingJourneys: attributedPageViewEvents
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 120)
      .map((event) => {
        const profile = getVisitorProfile(event, visitorDayProfiles);
        return {
          timestamp: event.timestamp,
          customerNumber: visitorNumbers.get(event.visitorId) || 0,
          page: event.page,
          pageTitle: event.pageTitle || event.page,
          previousPage: event.previousPage || "Direct entry",
          visitorId: event.visitorId,
          sessionId: event.sessionId,
          country: event.country,
          device: event.device,
          channel: event.channel,
          sourcePlatform: event.sourcePlatform,
          sourceDetail: event.sourceDetail,
          visitDate: profile.visitDate,
          visitDayNumber: profile.visitDayNumber,
          customerType: profile.customerType,
          customerTypeLabel: profile.customerTypeLabel
        };
      }),
    journeys: [...journeyMap.entries()]
      .map(([route, value]) => ({ route, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 500),
    searchConsole: includeSearchConsole
      ? await getSearchConsoleSnapshot({ startDate, endDate, days: rangeDays })
      : getEmptySearchConsoleSnapshot()
  };

  if (useCache) {
    snapshotCache.set(cacheKey, { createdAt: Date.now(), value: dashboard });
    if (snapshotCache.size > 20) {
      const oldestKey = snapshotCache.keys().next().value;
      snapshotCache.delete(oldestKey);
    }
  }

  return dashboard;
}

export function getEmptySearchConsoleSnapshot() {
  const configured = Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );

  return {
    configured,
    live: false,
    siteUrl: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.cowinmagnet.com/",
    overview: {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      indexedPages: 0,
      notIndexedPages: 0
    },
    queries: [],
    pages: [],
    countries: [],
    devices: [],
    indexingStatus: []
  };
}

export async function getSearchConsoleSnapshot(options = {}) {
  const fallback = getEmptySearchConsoleSnapshot();

  try {
    const liveSnapshot = await getLiveSearchConsoleSnapshot(options);
    return liveSnapshot || fallback;
  } catch (error) {
    console.error("Search Console API read failed", error);
    return {
      ...fallback,
      live: false,
      error: "Search Console API connection failed. Check service account permissions and environment variables."
    };
  }
}
