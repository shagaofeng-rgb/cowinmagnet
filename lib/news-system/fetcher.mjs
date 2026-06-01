import { newsSystemConfig } from "../../config/news-system.config.mjs";

const nowIso = () => new Date().toISOString();

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return stripHtml(match?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, "") || "");
}

function parseRss(xml, sourceUrl) {
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  return items.map((block) => ({
    title: getTag(block, "title"),
    url: getTag(block, "link"),
    description: getTag(block, "description"),
    sourceName: new URL(sourceUrl).hostname.replace(/^www\./, ""),
    sourceUrl,
    publishedDate: getTag(block, "pubDate"),
    retrievedDate: nowIso(),
    author: getTag(block, "dc:creator") || getTag(block, "author"),
    country: "",
    provider: "rss"
  }));
}

async function fetchRssFeeds() {
  const results = [];

  for (const sourceUrl of newsSystemConfig.sources.rss) {
    try {
      const response = await fetch(sourceUrl, { next: { revalidate: 1800 } });
      if (!response.ok) continue;
      results.push(...parseRss(await response.text(), sourceUrl));
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
    headers: { "Ocp-Apim-Subscription-Key": process.env.BING_NEWS_API_KEY }
  });

  if (!response.ok) return [];
  const data = await response.json();

  return (data.value || []).map((item) => ({
    title: item.name,
    url: item.url,
    description: item.description,
    sourceName: item.provider?.[0]?.name || "Bing News",
    sourceUrl: item.url,
    publishedDate: item.datePublished,
    retrievedDate: nowIso(),
    author: "",
    country: "",
    provider: "bing-news"
  }));
}

async function fetchNewsApi() {
  if (!process.env.NEWSAPI_KEY) return [];

  const query = encodeURIComponent(newsSystemConfig.keywords.slice(0, 10).join(" OR "));
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=20&sortBy=publishedAt&apiKey=${process.env.NEWSAPI_KEY}`
  );

  if (!response.ok) return [];
  const data = await response.json();

  return (data.articles || []).map((item) => ({
    title: item.title,
    url: item.url,
    description: item.description,
    sourceName: item.source?.name || "NewsAPI",
    sourceUrl: item.url,
    publishedDate: item.publishedAt,
    retrievedDate: nowIso(),
    author: item.author || "",
    country: "",
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
