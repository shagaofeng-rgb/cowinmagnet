import crypto from "node:crypto";
import fs from "node:fs/promises";

const tokenUrl = "https://oauth2.googleapis.com/token";
const readonlyScope = "https://www.googleapis.com/auth/webmasters.readonly";
const manageScope = "https://www.googleapis.com/auth/webmasters";
const googleRequestTimeoutMs = Math.max(3000, Number(process.env.GOOGLE_REQUEST_TIMEOUT_MS || 12000));
const tokenCache = new Map();

async function fetchGoogle(url, options = {}, fetchImpl = globalThis.fetch) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), googleRequestTimeoutMs);
  try {
    return await fetchImpl(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function base64Url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function normalizePrivateKey(value = "") {
  return value.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
}

function dateDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

async function resolveCredentials() {
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return { clientEmail: process.env.GOOGLE_CLIENT_EMAIL, privateKey: normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY) };
  }

  const credentialsPath = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_PATH;
  if (!credentialsPath) return null;
  const credentials = JSON.parse(await fs.readFile(credentialsPath, "utf8"));
  if (!credentials.client_email || !credentials.private_key) return null;
  return { clientEmail: credentials.client_email, privateKey: normalizePrivateKey(credentials.private_key) };
}

export function isSearchConsoleConfigured() {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL &&
      ((process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) || process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_PATH)
  );
}

export function isSearchConsoleSubmissionEnabled() {
  return String(process.env.GOOGLE_SEARCH_CONSOLE_ENABLED || "false").toLowerCase() === "true";
}

async function getAccessToken(scope = readonlyScope, fetchImpl = globalThis.fetch) {
  const cached = tokenCache.get(scope);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.accessToken;

  const credentials = await resolveCredentials();
  if (!credentials) throw new Error("Google Search Console credentials are not configured");
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.clientEmail,
    scope,
    aud: tokenUrl,
    exp: now + 3600,
    iat: now
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(credentials.privateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const response = await fetchGoogle(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`
    })
  }, fetchImpl);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google OAuth token request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  tokenCache.set(scope, {
    accessToken: data.access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600)) * 1000
  });
  return data.access_token;
}

function rowMetric(row = {}) {
  return {
    clicks: Math.round(row.clicks || 0),
    impressions: Math.round(row.impressions || 0),
    ctr: Number(((row.ctr || 0) * 100).toFixed(1)),
    position: Number((row.position || 0).toFixed(1))
  };
}

async function querySearchAnalytics(accessToken, { dimensions = [], rowLimit = 10, startDate, endDate } = {}) {
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  const apiUrl = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const response = await fetchGoogle(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions,
      rowLimit,
      startRow: 0
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Search Console query failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

function normalizeDate(value) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export async function getLiveSearchConsoleSnapshot({ days = 28, startDate, endDate } = {}) {
  if (!isSearchConsoleConfigured()) return null;

  const queryEndDate = normalizeDate(endDate) || dateDaysAgo(2);
  const queryStartDate = normalizeDate(startDate) || dateDaysAgo(days + 1);
  const accessToken = await getAccessToken(readonlyScope);
  const [overviewData, queryData, pageData, countryData, deviceData] = await Promise.all([
    querySearchAnalytics(accessToken, { startDate: queryStartDate, endDate: queryEndDate, rowLimit: 1 }),
    querySearchAnalytics(accessToken, { startDate: queryStartDate, endDate: queryEndDate, dimensions: ["query"], rowLimit: 20 }),
    querySearchAnalytics(accessToken, { startDate: queryStartDate, endDate: queryEndDate, dimensions: ["page"], rowLimit: 20 }),
    querySearchAnalytics(accessToken, { startDate: queryStartDate, endDate: queryEndDate, dimensions: ["country"], rowLimit: 12 }),
    querySearchAnalytics(accessToken, { startDate: queryStartDate, endDate: queryEndDate, dimensions: ["device"], rowLimit: 8 })
  ]);

  const overview = rowMetric(overviewData.rows?.[0]);

  return {
    configured: true,
    live: true,
    siteUrl: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
    dateRange: { startDate: queryStartDate, endDate: queryEndDate },
    overview,
    queries: (queryData.rows || []).map((row) => ({
      query: row.keys?.[0] || "Unknown query",
      ...rowMetric(row)
    })),
    pages: (pageData.rows || []).map((row) => ({
      page: row.keys?.[0] || "",
      title: row.keys?.[0] || "Unknown page",
      ...rowMetric(row)
    })),
    countries: (countryData.rows || []).map((row) => ({
      country: row.keys?.[0] || "Unknown",
      clicks: Math.round(row.clicks || 0),
      impressions: Math.round(row.impressions || 0)
    })),
    devices: (deviceData.rows || []).map((row) => ({
      device: row.keys?.[0] || "Unknown",
      clicks: Math.round(row.clicks || 0),
      impressions: Math.round(row.impressions || 0)
    })),
    indexingStatus: [
      { status: "Search Analytics Connected", count: overview.impressions },
      { status: "URL Inspection can be added later", count: 0 }
    ]
  };
}

async function fetchWithRetry(url, options, { fetchImpl = globalThis.fetch, retries = 2 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchGoogle(url, options, fetchImpl);
      if (response.ok || ![429, 500, 502, 503, 504].includes(response.status) || attempt === retries) return response;
      lastError = new Error(`Google API temporary error: ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === retries) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
  }
  throw lastError || new Error("Google API request failed");
}

function configuredSitemapUrl() {
  if (process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL) return process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL;
  try {
    return `${new URL(process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL).origin}/sitemap.xml`;
  } catch {
    return "";
  }
}

export async function submitSitemapToSearchConsole({
  siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL,
  sitemapUrl = configuredSitemapUrl(),
  fetchImpl = globalThis.fetch,
  checkAvailability = true
} = {}) {
  if (!isSearchConsoleConfigured()) throw new Error("Google Search Console is not configured");
  if (!siteUrl || !sitemapUrl) throw new Error("Search Console site URL or sitemap URL is missing");

  const parsedSitemapUrl = new URL(sitemapUrl);
  if (parsedSitemapUrl.protocol !== "https:") throw new Error("Sitemap URL must use HTTPS");

  if (checkAvailability) {
    const sitemapResponse = await fetchGoogle(
      sitemapUrl,
      { method: "GET", headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.1" } },
      fetchImpl
    );
    const contentType = sitemapResponse.headers.get("content-type") || "";
    if (!sitemapResponse.ok || !/xml/i.test(contentType)) {
      throw new Error(`Sitemap availability check failed: ${sitemapResponse.status} ${contentType || "unknown-content-type"}`);
    }
  }

  const accessToken = await getAccessToken(manageScope, fetchImpl);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const response = await fetchWithRetry(
    endpoint,
    { method: "PUT", headers: { Authorization: `Bearer ${accessToken}` } },
    { fetchImpl }
  );
  if (!response.ok) {
    const body = (await response.text()).slice(0, 1000);
    throw new Error(`Search Console sitemap submission failed: ${response.status} ${body}`);
  }

  return { attempted: true, success: true, statusCode: response.status, siteUrl, sitemapUrl };
}

export async function maybeSubmitSitemap(options = {}) {
  if (!isSearchConsoleSubmissionEnabled()) {
    return { attempted: false, success: false, reason: "disabled" };
  }
  return submitSitemapToSearchConsole(options);
}

export function resetSearchConsoleTokenCacheForTests() {
  tokenCache.clear();
}
