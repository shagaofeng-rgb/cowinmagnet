import { applications } from "@/data/applications";
import { blogPosts } from "@/data/blogs";
import { newsPosts, getNewsPosts } from "@/data/contentHub";
import { products } from "@/data/products";
import { site } from "@/data/site";

const stopWords = new Set([
  "the", "and", "for", "with", "from", "into", "that", "this", "your", "our", "are", "can", "will", "not",
  "magnetic", "separator", "separation", "cowin", "magnet", "equipment", "product", "products", "industry"
]);

const safeDomains = new Set([
  "cowinmagnet.com",
  "www.cowinmagnet.com",
  "google.com",
  "www.google.com",
  "googletagmanager.com",
  "www.googletagmanager.com",
  "facebook.com",
  "www.facebook.com",
  "linkedin.com",
  "www.linkedin.com",
  "twitter.com",
  "x.com",
  "wa.me",
  "api.whatsapp.com",
  "tiktok.com",
  "www.tiktok.com",
  "tomra.com",
  "www.tomra.com",
  "axios.com",
  "www.axios.com",
  "eriez.com",
  "www.eriez.com",
  "geomechanics.io",
  "phys.org",
  "www.phys.org",
  "eurekalert.org",
  "www.eurekalert.org",
  "bakermckenzie.com",
  "www.bakermckenzie.com",
  "api.whatsapp.com"
]);

const riskPattern = /(casino|betting|poker|porn|adult|sex|loan|payday|viagra|pharma|replica|counterfeit|forex|binary|crypto-giveaway|hack|malware|torrent|download-free|blackhat|escort)/i;

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function normalizeNewsPost(post) {
  const body = [
    post.title,
    post.categoryTitle || post.category,
    post.excerpt,
    post.content,
    ...(post.sections || []).flatMap((section) => [section.heading, section.body]),
    ...(post.tags || [])
  ].join(" ");

  return {
    type: "news",
    slug: post.slug,
    title: post.title,
    href: `/news/${post.slug}`,
    category: post.categoryTitle || post.category || "News",
    description: post.excerpt || "",
    anchor: post.title,
    text: body
  };
}

function getStaticContentPages(newsList = newsPosts) {
  const productPages = products.map((product) => ({
    type: "product",
    slug: product.slug,
    title: product.name,
    href: `/products/${product.slug}`,
    category: product.category,
    description: product.summary,
    anchor: product.name,
    text: [
      product.name,
      product.category,
      product.summary,
      product.principle,
      ...(product.keywords || []),
      ...(product.features || []),
      ...(product.applications || [])
    ].join(" ")
  }));

  const blogPages = blogPosts.map((post) => ({
    type: "blog",
    slug: post.slug,
    title: post.title,
    href: `/blog/${post.slug}`,
    category: post.category,
    description: post.excerpt,
    anchor: post.title,
    text: [post.title, post.category, post.excerpt, post.content, ...(post.keywords || [])].join(" ")
  }));

  const applicationPages = applications.map((application) => ({
    type: "application",
    slug: application.slug,
    title: application.name,
    href: `/industries/${application.industrySlug || application.slug}`,
    category: "Application",
    description: application.summary,
    anchor: `${application.name} application`,
    text: [
      application.name,
      application.summary,
      ...(application.painPoints || []),
      ...(application.recommendedProducts || [])
    ].join(" ")
  }));

  return [...productPages, ...applicationPages, ...blogPages, ...newsList.map(normalizeNewsPost)];
}

function scoreCandidate(current, candidate) {
  const currentTokens = new Set(tokenize(current.text));
  const candidateTokens = new Set(tokenize(candidate.text));
  let score = 0;

  for (const token of candidateTokens) {
    if (currentTokens.has(token)) score += 3;
  }

  if (current.category && candidate.category && current.category === candidate.category) score += 8;
  if (current.type !== candidate.type) score += 3;
  if (current.type === "product" && candidate.type === "application") score += 6;
  if ((current.type === "blog" || current.type === "news") && candidate.type === "product") score += 6;
  if (current.type === "news" && candidate.type === "blog") score += 4;

  return score;
}

function selectSuggestedLinks(current, pages, limit = 5) {
  const ranked = pages
    .filter((candidate) => !(candidate.type === current.type && candidate.slug === current.slug))
    .map((candidate) => ({ ...candidate, score: scoreCandidate(current, candidate) }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const selected = [];
  const preferredTypes = current.type === "product"
    ? ["application", "blog", "news", "product"]
    : current.type === "blog"
      ? ["product", "application", "blog", "news"]
      : ["product", "blog", "application", "news"];

  for (const type of preferredTypes) {
    const match = ranked.find((item) => item.type === type && !selected.some((selectedItem) => selectedItem.href === item.href));
    if (match) selected.push(match);
    if (selected.length >= limit) break;
  }

  for (const item of ranked) {
    if (selected.length >= limit) break;
    if (!selected.some((selectedItem) => selectedItem.href === item.href)) selected.push(item);
  }

  return selected.slice(0, limit).map(({ score, text, ...link }) => link);
}

export function getStaticInternalLinkSuggestions({ type, slug, limit = 5 }) {
  const pages = getStaticContentPages();
  const current = pages.find((page) => page.type === type && page.slug === slug);
  if (!current) return [];
  return selectSuggestedLinks(current, pages, limit);
}

export async function getInternalLinkSuggestions({ type, slug, limit = 5 }) {
  const liveNewsPosts = await getNewsPosts();
  const pages = getStaticContentPages(liveNewsPosts);
  const current = pages.find((page) => page.type === type && page.slug === slug);
  if (!current) return [];
  return selectSuggestedLinks(current, pages, limit);
}

function toDomain(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function classifyExternalLink(url) {
  const domain = toDomain(url);
  if (!domain) {
    return { risk: "needs-confirmation", reason: "URL format needs manual confirmation." };
  }
  if (riskPattern.test(url) || riskPattern.test(domain)) {
    return { risk: "high-risk", reason: "Domain or URL contains spam, adult, finance, malware, or black-hat terms." };
  }
  if (safeDomains.has(domain) || safeDomains.has(`www.${domain}`)) {
    return { risk: "safe", reason: "Known official platform, industry source, map, analytics, or approved social/service link." };
  }
  return { risk: "needs-confirmation", reason: "Third-party domain is not on the current allowlist." };
}

function collectExternalLinks(newsList) {
  const rows = [];
  const add = (url, source, anchor = "") => {
    if (!url || !/^https?:\/\//i.test(url)) return;
    const classification = classifyExternalLink(url);
    rows.push({
      url,
      domain: toDomain(url),
      source,
      anchor,
      risk: classification.risk,
      reason: classification.reason,
      recommendedRel: classification.risk === "safe" ? "noopener noreferrer nofollow" : "review before publishing"
    });
  };

  add(`https://wa.me/${site.whatsapp}`, "Site contact / WhatsApp", "WhatsApp");
  add(site.social.facebook, "Footer social", "Facebook");
  add(site.social.tiktok, "Footer social", "TikTok");
  add("https://www.google.com/maps/search/?api=1&query=Room%20110%2C%201st%20Floor%2C%20Building%202%2C%20Qushidai%20Future%20Building%2C%20Kecheng%20District%2C%20Quzhou%20City%2C%20Zhejiang%20Province%2C%20China", "Map navigation", "View on Google Maps");

  for (const post of newsList) {
    for (const source of post.sources || []) {
      add(source.url, `News source: ${post.title}`, source.name || source.title);
    }
  }

  const unique = new Map();
  for (const row of rows) {
    if (!unique.has(row.url)) unique.set(row.url, row);
  }
  return Array.from(unique.values());
}

export async function getLinkAuditReport() {
  const liveNewsPosts = await getNewsPosts();
  const pages = getStaticContentPages(liveNewsPosts);
  const internalRows = pages.map((page) => ({
    type: page.type,
    title: page.title,
    href: page.href,
    category: page.category,
    suggestions: selectSuggestedLinks(page, pages, 5)
  }));
  const externalRows = collectExternalLinks(liveNewsPosts);
  const riskCounts = externalRows.reduce(
    (acc, row) => {
      acc[row.risk] = (acc[row.risk] || 0) + 1;
      return acc;
    },
    { safe: 0, "needs-confirmation": 0, "high-risk": 0 }
  );

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      pages: internalRows.length,
      pagesWithEnoughInternalLinks: internalRows.filter((row) => row.suggestions.length >= 2).length,
      externalLinks: externalRows.length,
      safeExternalLinks: riskCounts.safe || 0,
      confirmExternalLinks: riskCounts["needs-confirmation"] || 0,
      highRiskExternalLinks: riskCounts["high-risk"] || 0
    },
    internalRows,
    externalRows,
    disavowSuggestions: [],
    recommendations: [
      "每次发布产品、Blog 或 News 时，至少保留 2-5 个自然内链，优先链接到相关产品页、应用页和历史文章。",
      "新闻引用第三方来源时使用 noopener noreferrer nofollow，避免把权重无控制传递给引用站。",
      "外部垃圾反链需要从 Google Search Console、Ahrefs 或 Semrush 导出后再生成 disavow.txt，当前代码库内未发现黑链。",
      "新增内容发布后检查 sitemap、canonical、breadcrumb 和推荐阅读模块，避免孤立页面。"
    ]
  };
}
