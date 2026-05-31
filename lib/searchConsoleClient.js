import crypto from "node:crypto";

const tokenUrl = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/webmasters.readonly";

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

function isConfigured() {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: process.env.GOOGLE_CLIENT_EMAIL,
    scope,
    aud: tokenUrl,
    exp: now + 3600,
    iat: now
  };
  const unsigned = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY), "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google OAuth token request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
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
  const response = await fetch(apiUrl, {
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
  if (!isConfigured()) return null;

  const queryEndDate = normalizeDate(endDate) || dateDaysAgo(2);
  const queryStartDate = normalizeDate(startDate) || dateDaysAgo(days + 1);
  const accessToken = await getAccessToken();
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
