import { newsSystemConfig } from "../../config/news-system.config.mjs";

const nowIso = () => new Date().toISOString();
const FETCH_TIMEOUT_MS = Number(process.env.NEWS_FETCH_TIMEOUT_MS || 8000);
const MAX_SOURCE_SIZE_BYTES = Number(process.env.NEWS_MAX_SOURCE_SIZE_BYTES || 1024 * 1024);

function isSafePublicHttpUrl(value = "") {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost" || hostname.endsWith(".localhost")) return false;
    if (/^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(hostname)) return false;
    if (hostname === "::1" || hostname.startsWith("fc") || hostname.startsWith("fd")) return false;
    return true;
  } catch {
    return false;
  }
}

function stripHtml(value = "") {
  return decodeEntities(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function decodeEntities(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag.replace(":", "\\:")}[^>]*>([\\s\\S]*?)<\\/${tag.replace(":", "\\:")}>`, "i"));
  return stripHtml(match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") || "");
}

function getAttribute(block, tag, attr) {
  const match = block.match(new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, "i"));
  return decodeEntities(match?.[1] || "");
}

function absolutizeUrl(url = "", base = "") {
  if (!url) return "";
  try {
    return new URL(url, base || undefined).toString();
  } catch {
    return url;
  }
}

function getMetaContent(html = "", key = "") {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${key}["'][^>]*>`, "i")
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return "";
}

async function fetchSourcePreviewImage(item) {
  if (item.imageUrl || !item.url || !item.allowedUseImage || !isSafePublicHttpUrl(item.url)) return item;
  try {
    const response = await fetch(item.url, {
      headers: { "User-Agent": "CowinmagnetNewsResearch/1.0 (+https://www.cowinmagnet.com)" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) return item;
    const contentLength = Number(response.headers.get("content-length") || 0);
    const contentType = response.headers.get("content-type") || "";
    if ((contentLength && contentLength > MAX_SOURCE_SIZE_BYTES) || !/text\/html|application\/xhtml/i.test(contentType)) return item;
    const html = (await response.text()).slice(0, MAX_SOURCE_SIZE_BYTES);
    const imageUrl =
      getMetaContent(html, "og:image:secure_url") ||
      getMetaContent(html, "og:image") ||
      getMetaContent(html, "twitter:image") ||
      getMetaContent(html, "twitter:image:src");
    if (!imageUrl) return item;
    return {
      ...item,
      imageUrl: absolutizeUrl(imageUrl, item.url),
      imageSourceName: item.sourceName || "Original news source",
      imageSourceUrl: item.url,
      imageLicenseNote: `External news image from ${item.sourceName || "the cited source"}; displayed with source attribution.`
    };
  } catch {
    return item;
  }
}

async function enrichMissingSourceImages(items) {
  return Promise.all(items.map((item) => fetchSourcePreviewImage(item)));
}

function parseRss(xml, source) {
  const sourceUrl = source.sourceUrl || source;
  const sourceName = source.sourceName || new URL(sourceUrl).hostname.replace(/^www\./, "");
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  return items.map((block) => ({
    title: getTag(block, "title"),
    url: getTag(block, "link"),
    canonicalUrl: getTag(block, "guid") || getTag(block, "link"),
    description: getTag(block, "description"),
    sourceName,
    sourceUrl,
    publishedDate: getTag(block, "pubDate"),
    retrievedDate: nowIso(),
    author: getTag(block, "dc:creator") || getTag(block, "author"),
    country: source.region || "",
    region: source.region || "",
    language: source.language || newsSystemConfig.defaultLanguage,
    category: source.category || "",
    imageUrl:
      getAttribute(block, "media:thumbnail", "url") ||
      getAttribute(block, "media:content", "url") ||
      getAttribute(block, "enclosure", "url") ||
      getTag(block, "media:thumbnail"),
    imageSourceName: sourceName,
    imageSourceUrl: sourceUrl,
    imageLicenseNote: source.defaultAttributionText || `${sourceName} / original article image`,
    allowedUseImage: source.allowedUseImage === true,
    provider: "rss"
  }));
}

async function fetchRssFeeds() {
  const results = [];
  const sources = (newsSystemConfig.newsSources || [])
    .filter((source) => source.enabled !== false && source.sourceType === "rss")
    .concat((newsSystemConfig.sources?.rss || []).map((sourceUrl) => ({ sourceType: "rss", sourceUrl })))
    .filter((source, index, all) => all.findIndex((entry) => entry.sourceUrl === source.sourceUrl) === index);

  for (const source of sources) {
    try {
      if (!isSafePublicHttpUrl(source.sourceUrl)) continue;
      const response = await fetch(source.sourceUrl, {
        headers: { "User-Agent": "CowinmagnetNewsResearch/1.0 (+https://www.cowinmagnet.com)" },
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
      });
      if (!response.ok) continue;
      const contentLength = Number(response.headers.get("content-length") || 0);
      if (contentLength && contentLength > MAX_SOURCE_SIZE_BYTES) continue;
      results.push(...parseRss((await response.text()).slice(0, MAX_SOURCE_SIZE_BYTES), source));
    } catch {
      // Continue even when one source is blocked or temporarily unavailable.
    }
  }

  return results;
}

async function fetchBingNews() {
  if (!process.env.BING_NEWS_API_KEY) return [];

  const query = encodeURIComponent(newsSystemConfig.keywords.slice(0, 8).join(" OR "));
  const response = await fetch(`https://api.bing.microsoft.com/v7.0/news/search?q=${query}&freshness=Day&count=20`, {
    headers: { "Ocp-Apim-Subscription-Key": process.env.BING_NEWS_API_KEY },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });

  if (!response.ok) return [];
  const data = await response.json();

  return (data.value || []).map((item) => ({
    title: item.name,
    url: item.url,
    canonicalUrl: item.url,
    description: item.description,
    sourceName: item.provider?.[0]?.name || "Bing News",
    sourceUrl: item.url,
    publishedDate: item.datePublished,
    retrievedDate: nowIso(),
    author: "",
    country: "",
    region: "",
    language: "en",
    category: "api-news",
    imageUrl: item.image?.thumbnail?.contentUrl || "",
    imageSourceName: item.provider?.[0]?.name || "Bing News",
    imageSourceUrl: item.url,
    imageLicenseNote: "External news image preview from the cited source; displayed with source attribution.",
    allowedUseImage: false,
    provider: "bing-news"
  }));
}

async function fetchNewsApi() {
  if (!process.env.NEWSAPI_KEY) return [];

  const query = encodeURIComponent(newsSystemConfig.keywords.slice(0, 10).join(" OR "));
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=20&sortBy=publishedAt&apiKey=${process.env.NEWSAPI_KEY}`,
    { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) }
  );

  if (!response.ok) return [];
  const data = await response.json();

  return (data.articles || []).map((item) => ({
    title: item.title,
    url: item.url,
    canonicalUrl: item.url,
    description: item.description,
    sourceName: item.source?.name || "NewsAPI",
    sourceUrl: item.url,
    publishedDate: item.publishedAt,
    retrievedDate: nowIso(),
    author: item.author || "",
    country: "",
    region: "",
    language: "en",
    category: "api-news",
    imageUrl: item.urlToImage || "",
    imageSourceName: item.source?.name || "NewsAPI",
    imageSourceUrl: item.url,
    imageLicenseNote: "External news image from the cited source; displayed with source attribution.",
    allowedUseImage: false,
    provider: "newsapi"
  }));
}

export function fallbackItems() {
  return [];
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = (item.url || item.title || "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchIndustryNews() {
  const fetched = await Promise.allSettled([fetchBingNews(), fetchNewsApi(), fetchRssFeeds()]);
  const items = fetched.flatMap((entry) => (entry.status === "fulfilled" ? entry.value : []));
  const cleaned = dedupe(items).filter((item) => item.title && item.url);

  return enrichMissingSourceImages(cleaned);
}
