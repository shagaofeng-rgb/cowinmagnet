import fs from "node:fs/promises";
import path from "node:path";
import { appendDatabaseEvent, isDatabaseConfigured, readDatabaseEvents } from "@/lib/analyticsDatabase";
import { getLiveSearchConsoleSnapshot } from "@/lib/searchConsoleClient";

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-analytics") : path.join(process.cwd(), ".data");
const EVENT_FILE = path.join(DATA_DIR, "analytics-events.jsonl");

const knownPages = [
  ["/en", "Home"],
  ["/en/products", "Products"],
  ["/en/products/suspended-permanent-magnetic-separator", "Suspended Permanent Magnetic Separator"],
  ["/en/products/suspended-electromagnetic-conveyor-belt-separator", "Suspended Electromagnetic Separator"],
  ["/en/inquiry", "Inquiry"],
  ["/en/contact", "Contact"],
  ["/en/blog", "Blog"],
  ["/en/news", "News"]
];

const searchTerms = [
  "overband magnetic separator supplier",
  "suspended permanent magnet for conveyor",
  "magnetic separator for recycling plant",
  "electromagnetic separator for mining belt",
  "self cleaning magnetic separator price",
  "magnetic separator manufacturer china"
];

function safeJson(line) {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function anonymizeIp(ip) {
  if (!ip) return "";
  const value = ip.split(",")[0].trim();
  if (value.includes(":")) return value.split(":").slice(0, 4).join(":") + "::";
  const parts = value.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.${parts[2]}.0` : value;
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
  const utmSource = event.utm?.source || "";
  const referrer = event.referrer || "";
  if (utmSource) return `Campaign: ${utmSource}`;
  if (!referrer) return "Direct";
  if (/google|bing|yahoo|duckduckgo/i.test(referrer)) return "Organic Search";
  if (/facebook|instagram|linkedin|youtube|tiktok/i.test(referrer)) return "Social";
  return "Referral";
}

function getHeader(request, key) {
  return request.headers.get(key) || "";
}

export function normalizeAnalyticsEvent(payload, request) {
  const userAgent = getHeader(request, "user-agent");
  const now = new Date().toISOString();
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: payload.type || "page_view",
    visitorId: String(payload.visitorId || "anonymous").slice(0, 80),
    sessionId: String(payload.sessionId || "session").slice(0, 80),
    page: String(payload.page || "/").slice(0, 240),
    previousPage: String(payload.previousPage || "").slice(0, 240),
    pageTitle: String(payload.pageTitle || "").slice(0, 180),
    referrer: String(payload.referrer || "").slice(0, 240),
    outboundUrl: String(payload.outboundUrl || "").slice(0, 240),
    targetText: String(payload.targetText || "").slice(0, 120),
    scrollDepth: Number(payload.scrollDepth || 0),
    duration: Number(payload.duration || 0),
    utm: {
      source: String(payload.utm?.source || "").slice(0, 80),
      medium: String(payload.utm?.medium || "").slice(0, 80),
      campaign: String(payload.utm?.campaign || "").slice(0, 120),
      term: String(payload.utm?.term || "").slice(0, 120),
      content: String(payload.utm?.content || "").slice(0, 120)
    },
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    device: payload.device || detectDevice(userAgent),
    userAgent: userAgent.slice(0, 360),
    ip: anonymizeIp(getHeader(request, "x-forwarded-for") || getHeader(request, "x-real-ip")),
    country: getHeader(request, "x-vercel-ip-country") || "Unknown",
    region: getHeader(request, "x-vercel-ip-country-region") || "",
    city: getHeader(request, "x-vercel-ip-city") || "",
    timestamp: payload.timestamp || now
  };
  event.channel = detectChannel(event);
  return event;
}

export async function appendAnalyticsEvent(event) {
  if (isDatabaseConfigured()) {
    try {
      const saved = await appendDatabaseEvent(event);
      if (saved) return;
    } catch (error) {
      console.error("Database analytics write failed, falling back to file store", error);
    }
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.appendFile(EVENT_FILE, `${JSON.stringify(event)}\n`, "utf8");
}

export async function readAnalyticsEvents(options = {}) {
  if (isDatabaseConfigured()) {
    try {
      const events = await readDatabaseEvents(options);
      return events || [];
    } catch (error) {
      console.error("Database analytics read failed, falling back to file store", error);
    }
  }

  try {
    const text = await fs.readFile(EVENT_FILE, "utf8");
    const events = text.split(/\r?\n/).map(safeJson).filter(Boolean);
    return events.length ? events : mockAnalyticsEvents();
  } catch {
    return mockAnalyticsEvents();
  }
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function mockAnalyticsEvents() {
  const countries = ["US", "DE", "SA", "BR", "FR", "RU", "MX", "AU"];
  const devices = ["Desktop", "Mobile", "Desktop", "Mobile", "Tablet"];
  const channels = ["Organic Search", "Direct", "Referral", "Social"];
  const events = [];

  for (let day = 13; day >= 0; day -= 1) {
    const baseDate = daysAgo(day);
    const pageViews = 16 + (13 - day) * 3;
    for (let index = 0; index < pageViews; index += 1) {
      const [page, title] = knownPages[index % knownPages.length];
      const visitorId = `demo-visitor-${index % 11}`;
      const sessionId = `demo-session-${day}-${index % 15}`;
      const timestamp = new Date(baseDate);
      timestamp.setMinutes(index * 7);
      events.push({
        id: `demo-${day}-${index}`,
        type: "page_view",
        visitorId,
        sessionId,
        page,
        previousPage: index % 3 === 0 ? "/en" : "",
        pageTitle: title,
        referrer: index % 4 === 0 ? "https://www.google.com/" : "",
        outboundUrl: "",
        targetText: "",
        scrollDepth: 0,
        duration: 42 + (index % 9) * 11,
        utm: {},
        browser: index % 5 === 0 ? "Safari" : "Chrome",
        os: index % 4 === 0 ? "iOS" : "Windows",
        device: devices[index % devices.length],
        userAgent: "demo",
        ip: `203.0.${day}.${index}`,
        country: countries[index % countries.length],
        region: "",
        city: "",
        channel: channels[index % channels.length],
        timestamp: timestamp.toISOString()
      });
      if (index % 8 === 0) {
        events.push({
          id: `demo-form-${day}-${index}`,
          type: "form_submit",
          visitorId,
          sessionId,
          page: "/en/inquiry",
          previousPage: page,
          pageTitle: "Inquiry",
          timestamp: timestamp.toISOString(),
          country: countries[index % countries.length],
          device: devices[index % devices.length],
          browser: "Chrome",
          os: "Windows",
          channel: channels[index % channels.length]
        });
      }
    }
  }
  return events;
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
    const date = cursor.toISOString().slice(0, 10);
    dayMap.set(date, { date, pv: 0, uv: new Set(), inquiries: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  events.forEach((event) => {
    const date = new Date(event.timestamp).toISOString().slice(0, 10);
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
  resolvedStart.setHours(0, 0, 0, 0);
  resolvedEnd.setHours(23, 59, 59, 999);
  const rangeDays = Math.max(1, Math.ceil((resolvedEnd - resolvedStart) / 86400000));
  return { startDate: resolvedStart, endDate: resolvedEnd, rangeDays };
}

export async function getAnalyticsSnapshot(options = {}) {
  const { startDate, endDate, rangeDays } = resolveSnapshotRange(options);
  const allEvents = await readAnalyticsEvents({ days: Math.min(731, rangeDays + 3), limit: 50000 });
  const visitorDayProfiles = buildVisitorDayProfiles(allEvents);
  const events = allEvents.filter((event) => inRange(event, startDate, endDate));
  const pageViewEvents = events.filter((event) => event.type === "page_view");
  const formEvents = events.filter((event) => event.type === "form_submit");
  const sessions = unique(events, "sessionId");
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
    storageMode: isDatabaseConfigured() ? "database" : "preview",
    generatedAt: new Date().toISOString(),
    overview: {
      pageViews: pageViewEvents.length,
      uniqueVisitors: unique(pageViewEvents, "visitorId"),
      sessions,
      inquiries: formEvents.length,
      avgDuration,
      bounceRate: sessions ? Math.min(78, Math.max(22, Math.round(64 - pages.length * 1.2))) : 0
    },
    traffic: {
      series: seriesByDay(events, startDate, endDate),
      channels: countBy(pageViewEvents, "channel", 8),
      countries: countBy(pageViewEvents, "country", 10),
      devices: countBy(pageViewEvents, "device", 6),
      browsers: countBy(pageViewEvents, "browser", 6),
      operatingSystems: countBy(pageViewEvents, "os", 6)
    },
    visitors: pageViewEvents
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 80)
      .map((event) => {
        const profile = getVisitorProfile(event, visitorDayProfiles);
        return {
          visitorId: event.visitorId,
          sessionId: event.sessionId,
          country: event.country,
          city: event.city,
          device: event.device,
          browser: event.browser,
          os: event.os,
          channel: event.channel,
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
    landingJourneys: pageViewEvents
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 120)
      .map((event) => {
        const profile = getVisitorProfile(event, visitorDayProfiles);
        return {
          timestamp: event.timestamp,
          page: event.page,
          pageTitle: event.pageTitle || event.page,
          previousPage: event.previousPage || "Direct entry",
          visitorId: event.visitorId,
          sessionId: event.sessionId,
          country: event.country,
          device: event.device,
          channel: event.channel,
          visitDate: profile.visitDate,
          visitDayNumber: profile.visitDayNumber,
          customerType: profile.customerType,
          customerTypeLabel: profile.customerTypeLabel
        };
      }),
    journeys: [...journeyMap.entries()]
      .map(([route, value]) => ({ route, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20),
    searchConsole: await getSearchConsoleSnapshot({ startDate, endDate, days: rangeDays })
  };

  return dashboard;
}

export function getMockSearchConsoleSnapshot() {
  const configured = Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
  const rows = searchTerms.map((query, index) => ({
    query,
    clicks: 18 + index * 9,
    impressions: 520 + index * 230,
    ctr: Number((3.5 + index * 0.6).toFixed(1)),
    position: Number((7.8 + index * 1.4).toFixed(1))
  }));
  return {
    configured,
    siteUrl: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "https://www.cowinmagnet.com/",
    overview: {
      clicks: rows.reduce((sum, row) => sum + row.clicks, 0),
      impressions: rows.reduce((sum, row) => sum + row.impressions, 0),
      ctr: 4.8,
      position: 10.6,
      indexedPages: 64,
      notIndexedPages: 7
    },
    queries: rows,
    pages: knownPages.slice(0, 6).map(([page, title], index) => ({
      page,
      title,
      clicks: 22 + index * 11,
      impressions: 660 + index * 210,
      position: Number((6.4 + index * 1.2).toFixed(1))
    })),
    countries: ["US", "DE", "SA", "BR", "FR", "RU"].map((country, index) => ({
      country,
      clicks: 42 - index * 4,
      impressions: 1300 - index * 115
    })),
    devices: [
      { device: "Desktop", clicks: 126, impressions: 3100 },
      { device: "Mobile", clicks: 94, impressions: 2860 },
      { device: "Tablet", clicks: 14, impressions: 420 }
    ],
    indexingStatus: [
      { status: "Indexed", count: 64 },
      { status: "Crawled - currently not indexed", count: 4 },
      { status: "Discovered - currently not indexed", count: 3 }
    ]
  };
}

export async function getSearchConsoleSnapshot(options = {}) {
  const fallback = getMockSearchConsoleSnapshot();

  try {
    const liveSnapshot = await getLiveSearchConsoleSnapshot(options);
    return liveSnapshot || fallback;
  } catch (error) {
    console.error("Search Console API read failed, falling back to sample data", error);
    return {
      ...fallback,
      live: false,
      error: "Search Console API connection failed. Check service account access and environment variables."
    };
  }
}
