import googleNewsUrlDecoder from "google-news-url-decoder";
import { newsSystemConfig } from "../../config/news-system.config.mjs";

const nowIso = () => new Date().toISOString();
const FETCH_TIMEOUT_MS = Number(process.env.NEWS_FETCH_TIMEOUT_MS || 15000);
const MAX_SOURCE_SIZE_BYTES = Number(process.env.NEWS_MAX_SOURCE_SIZE_BYTES || 1024 * 1024);
const GOOGLE_NEWS_DECODE_TIMEOUT_MS = Number(process.env.GOOGLE_NEWS_DECODE_TIMEOUT_MS || 12000);
const { GoogleDecoder } = googleNewsUrlDecoder;
const googleNewsDecoder = new GoogleDecoder();
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

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

function getRawTag(block, tag) {
  const escaped = tag.replace(":", "\\:");
  const match = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return String(match?.[1] || "").replace(/<!\[CDATA\[|\]\]>/g, "");
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

function firstMarkupImage(markup = "") {
  const tag = String(markup).match(/<img\b[^>]*>/i)?.[0] || "";
  if (!tag) return "";
  const srcset =
    tag.match(/\bdata-srcset=["']([^"']+)["']/i)?.[1] ||
    tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1] ||
    "";
  const largestSrcset = String(srcset)
    .split(",")
    .map((entry) => entry.trim().split(/\s+/))
    .filter(([url]) => url)
    .sort((a, b) => Number(String(b[1] || "").replace(/\D/g, "")) - Number(String(a[1] || "").replace(/\D/g, "")))[0]?.[0];
  return decodeEntities(
    largestSrcset ||
      tag.match(/\bdata-original=["']([^"']+)["']/i)?.[1] ||
      tag.match(/\bdata-lazy-src=["']([^"']+)["']/i)?.[1] ||
      tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ||
      tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ||
      ""
  );
}

function isGoogleNewsUrl(value = "") {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "") === "news.google.com";
  } catch {
    return false;
  }
}

export async function resolveOriginalArticleUrl(item = {}) {
  if (!isGoogleNewsUrl(item.url)) return item;

  try {
    const decoded = await Promise.race([
      googleNewsDecoder.decode(item.url),
      new Promise((resolve) =>
        setTimeout(() => resolve({ status: false, message: "google-news-decode-timeout" }), GOOGLE_NEWS_DECODE_TIMEOUT_MS)
      )
    ]);
    const decodedUrl = decoded?.status ? decoded.decoded_url : "";
    if (!decodedUrl || !isSafePublicHttpUrl(decodedUrl) || isGoogleNewsUrl(decodedUrl)) {
      return { ...item, originalAggregatorUrl: item.url, resolutionError: decoded?.message || "google-news-decode-failed" };
    }

    return {
      ...item,
      url: decodedUrl,
      canonicalUrl: decodedUrl,
      originalAggregatorUrl: item.url,
      sourceName: item.publisherName || item.sourceName,
      sourceUrl: item.publisherUrl || item.sourceUrl,
      imageSourceName: item.publisherName || item.imageSourceName || item.sourceName,
      imageSourceUrl: decodedUrl,
      resolutionError: ""
    };
  } catch (error) {
    return {
      ...item,
      originalAggregatorUrl: item.url,
      resolutionError: String(error?.message || "google-news-decode-failed").slice(0, 160)
    };
  }
}

export function parseRss(xml, source) {
  const sourceUrl = source.sourceUrl || source;
  const sourceName = source.sourceName || new URL(sourceUrl).hostname.replace(/^www\./, "");
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  const googleFeed = isGoogleNewsUrl(sourceUrl);
  return items.map((block) => {
    const articleUrl = getTag(block, "link");
    const publisherName = googleFeed ? getTag(block, "source") : "";
    const publisherUrl = googleFeed ? getAttribute(block, "source", "url") : "";
    const descriptionMarkup = getRawTag(block, "description") || getRawTag(block, "content:encoded");
    const itemSourceName = publisherName || sourceName;
    return {
      title: getTag(block, "title"),
      url: articleUrl,
      canonicalUrl: articleUrl,
      description: getTag(block, "description") || getTag(block, "content:encoded"),
      sourceName: itemSourceName,
      sourceUrl,
      publisherName,
      publisherUrl,
      sourceGroup: source.sourceGroup || "",
      sourceFeedUrl: sourceUrl,
      publishedDate: getTag(block, "pubDate") || getTag(block, "published") || getTag(block, "updated"),
      retrievedDate: nowIso(),
      author: getTag(block, "dc:creator") || getTag(block, "author"),
      country: source.region || "",
      region: source.region || "",
      language: source.language || newsSystemConfig.defaultLanguage,
      category: source.category || "",
      imageUrl: absolutizeUrl(
        getAttribute(block, "media:thumbnail", "url") ||
          getAttribute(block, "media:content", "url") ||
          getAttribute(block, "enclosure", "url") ||
          getTag(block, "media:thumbnail") ||
          firstMarkupImage(descriptionMarkup),
        articleUrl
      ),
      imageSourceName: itemSourceName,
      imageSourceUrl: articleUrl,
      imageLicenseNote: source.defaultAttributionText || `${itemSourceName} / original article image`,
      allowedUseImage: source.allowedUseImage === true,
      provider: "rss"
    };
  });
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
        headers: {
          "User-Agent": BROWSER_UA,
          Accept: "application/rss+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9"
        },
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
    sourceGroup: "industry-news",
    sourceFeedUrl: "bing-news",
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
    sourceGroup: "industry-news",
    sourceFeedUrl: "newsapi",
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

  return cleaned;
}
