import productThemePlans from "@/data/news-product-theme-plan.json";
import { revalidatePath } from "next/cache";
import { locales } from "@/lib/i18n";
import { saveCmsItem, textToSections, updateCmsItemStatus } from "./cmsStore.js";
import { getNewsSiteConfig, getNewsSiteSources, isNewsProductionEnabled } from "./newsAutomationConfig.js";
import {
  findCandidateFingerprint,
  getLastSuccessfulNewsPublication,
  getNewsAutomationDashboard,
  listNewsCandidates,
  listNewsRuns,
  markNewsCandidateUsed,
  recordNewsAuditEvent,
  releaseNewsCandidate,
  reserveNewsCandidate,
  saveGeneratedNewsArticle,
  saveNewsDeliveryCheck,
  startNewsRun,
  finishNewsRun,
  syncNewsSources,
  upsertNewsCandidate,
  withNewsAutomationLock
} from "./newsAutomationStore.js";
import { newsFingerprint, normalizeNewsText, parseNewsRssItems } from "./newsOperationsRules.js";
import { classifyNewsFamily } from "./newsSourceClassifier.js";

const HOUR = 60 * 60 * 1000;

function normalizedUrl(url) {
  const value = new URL(url);
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((key) => value.searchParams.delete(key));
  value.hash = "";
  return value.toString();
}

function iso(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function cycleStart(now, intervalHours) {
  const milliseconds = intervalHours * HOUR;
  return new Date(Math.floor(new Date(now).getTime() / milliseconds) * milliseconds).toISOString();
}

function wordCount(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function industryLabel(family) {
  if (!family?.id) return "industrial magnetic separation";
  return family.id.replaceAll("-", " ");
}

function scoreCandidate({ source, item, site, family, now }) {
  const publishedAt = new Date(item.publishedAt || 0).getTime();
  const ageHours = publishedAt ? (new Date(now).getTime() - publishedAt) / HOUR : Infinity;
  const body = `${item.title} ${item.summary}`;
  const relevanceMatches = (site.relevance_terms || []).filter((term) => normalizeNewsText(body).includes(normalizeNewsText(term))).length;
  const relevance = family && relevanceMatches ? 30 : 0;
  const impact = /regulat|standard|safety|supply|processing|recovery|separation|plant|conveyor|crusher|ore|recycl/i.test(body) ? 20 : 8;
  const recency = ageHours >= 0 && ageHours <= 24 ? 15 : ageHours <= 72 ? 10 : ageHours <= site.news.fallback_candidate_max_age_days * 24 ? 5 : 0;
  const sourceQuality = Math.min(15, Math.round(Number(source.source_trust_score || source.sourceTrustScore || 0) / 6));
  const theme = family ? 12 : 0;
  const image = 5; // No third-party image is copied; published pages use a neutral owned-media state unless rights are verified.
  const score = relevance + impact + recency + sourceQuality + theme + image;
  const reason = !item.summary || item.summary.length < 80 ? "summary-too-short"
    : !publishedAt ? "source-date-unverified"
      : ageHours < -2 ? "source-date-in-future"
        : ageHours > site.news.fallback_candidate_max_age_days * 24 ? "source-too-old"
          : !family ? "outside-industry-scope"
            : score < site.news.min_score ? "score-below-threshold" : null;
  return { score, reason, relevance, impact, recency, sourceQuality, theme, image, ageHours };
}

function candidateStatus(reason) {
  return reason ? "rejected" : "candidate";
}

function sourceMatchesWhitelist(item, source) {
  try { return new URL(item.sourceUrl).hostname.replace(/^www\./, "") === source.domain.replace(/^www\./, ""); } catch { return false; }
}

export function getNewsAutomationConfig(siteId) {
  const site = getNewsSiteConfig(siteId);
  return {
    siteId: site.site_id,
    timezone: site.timezone,
    ingestIntervalHours: site.news.ingest_interval_hours,
    publishIntervalHours: site.news.publish_interval_hours,
    productionEnabled: isNewsProductionEnabled(site),
    hasGenerator: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.NEWS_LLM_MODEL || "gpt-5-mini"
  };
}

export async function runNewsIngestCycle({ siteId, fetcher = fetch, now = new Date(), includeFallback = false, requestId = null } = {}) {
  const site = getNewsSiteConfig(siteId);
  const run = await startNewsRun({ siteId: site.site_id, runType: "12-hour-ingest", cycleStartedAt: cycleStart(now, site.news.ingest_interval_hours), requestId });
  const logs = [];
  try {
    await syncNewsSources(site);
    const sources = getNewsSiteSources(site, { includeFallback });
    let discovered = 0;
    let accepted = 0;
    let rejected = 0;
    for (const source of sources) {
      try {
        const response = await fetcher(source.rss_or_api_url, {
          headers: { "user-agent": `${site.brand_name} News Research/2.0` },
          signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const items = parseNewsRssItems(await response.text());
        let sourceAccepted = 0;
        let sourceRejected = 0;
        for (const item of items) {
          discovered += 1;
          if (!item?.title || !item?.sourceUrl) {
            sourceRejected += 1;
            rejected += 1;
            continue;
          }
          if (!sourceMatchesWhitelist(item, source)) { sourceRejected += 1; rejected += 1; continue; }
          const publishedAt = iso(item.publishedAt);
          const canonicalUrl = normalizedUrl(item.sourceUrl);
          const text = `${item.title}\n${item.summary}`;
          const family = classifyNewsFamily(text, "", site.relevance_terms);
          const assessment = scoreCandidate({ source, item: { ...item, publishedAt }, site, family, now });
          const normalizedHash = newsFingerprint(canonicalUrl);
          const titleHash = newsFingerprint(item.title);
          const contentFingerprint = newsFingerprint(`${item.title}\n${item.summary}`);
          const duplicate = await Promise.all([
            findCandidateFingerprint({ siteId: site.site_id, fingerprint: normalizedHash, fingerprintType: "url" }),
            findCandidateFingerprint({ siteId: site.site_id, fingerprint: titleHash, fingerprintType: "title" }),
            findCandidateFingerprint({ siteId: site.site_id, fingerprint: contentFingerprint, fingerprintType: "content" })
          ]).then((ids) => ids.some(Boolean));
          const rejectionReason = duplicate ? "duplicate-fingerprint" : assessment.reason;
          const saved = await upsertNewsCandidate({
            siteId: site.site_id, sourceUrl: item.sourceUrl, canonicalUrl, publisher: source.name, author: item.author,
            title: item.title,
            publishedAt, language: site.publication_language, industry: industryLabel(family), credibilityScore: assessment.sourceQuality,
            noveltyScore: assessment.recency, relevanceScore: assessment.relevance, candidateScore: assessment.score,
            sourceType: source.type, imageRightsStatus: "neutral-site-asset", facts: [{ title: item.title, summary: item.summary.slice(0, 1200), sourceUrl: canonicalUrl, sourcePublishedAt: publishedAt }],
            duplicateFingerprint: contentFingerprint, normalizedUrlHash: normalizedHash, titleHash, contentFingerprint,
            status: candidateStatus(rejectionReason), rejectionReason
          });
          if (saved.status === "candidate") { accepted += 1; sourceAccepted += 1; } else { rejected += 1; sourceRejected += 1; }
        }
        logs.push({ source: source.domain, status: "completed", accepted: sourceAccepted, rejected: sourceRejected });
      } catch (error) {
        logs.push({ source: source.domain, status: "failed", reason: String(error?.message || error).slice(0, 300) });
      }
    }
    const result = { status: "success", discovered, accepted, rejected, nextRunAfterHours: site.news.ingest_interval_hours, logs };
    await finishNewsRun(run, { status: "success", logs: [result] });
    await recordNewsAuditEvent({ siteId: site.site_id, eventType: "ingest_completed", entityType: "run", entityId: run.id, details: result });
    return result;
  } catch (error) {
    const message = String(error?.message || error);
    await finishNewsRun(run, { status: "failed", logs, errorSummary: message });
    throw error;
  }
}

function cleanJson(text) {
  const match = String(text || "").match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : text);
}

function generationPrompt({ site, candidate, productTheme }) {
  const facts = candidate.facts?.[0] || {};
  return `Write one English industry news editorial in JSON for a configured B2B site. The article is an independent summary and analysis of the cited source, not a rewrite, translation, promotion, press release or sales page. Use only the supplied source facts. Do not invent numbers, claims, quotes, authors, companies, certifications, images or dates. Do not include inquiries, contact details, quotations, sales language, brand claims, product cards or more than one optional internal URL. Return exactly this JSON shape: {"title":"","metaTitle":"","metaDescription":"","slug":"","markdown":"","optionalProductContext":"","sourcePanel":{"name":"","url":"","publishedAt":"","title":"","author":""},"editorialDisclaimer":""}. The markdown must be 700-1000 words, have these headings: News facts, What changed, Why this matters, Editorial perspective. It must distinguish sourced facts from editorial perspective and use no raw HTML. Source facts: ${JSON.stringify({ publisher: candidate.publisher, title: candidate.title, url: candidate.canonicalUrl, publishedAt: candidate.sourcePublishedAt, author: candidate.author || null, summary: facts.summary || "" })}. Site industry scope: ${site.industry_scope}. Current optional product theme: ${productTheme ? JSON.stringify(productTheme) : "none; omit optionalProductContext"}.`;
}

async function composeNewsArticle({ site, candidate, fetcher = fetch, productTheme = null }) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required to compose a News editorial");
  const response = await fetcher("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.NEWS_LLM_MODEL || "gpt-5-mini", input: [{ role: "user", content: generationPrompt({ site, candidate, productTheme }) }] })
  });
  if (!response.ok) throw new Error(`News composer HTTP ${response.status}`);
  const payload = await response.json();
  const output = payload.output_text || payload.output?.flatMap((entry) => entry.content || []).map((item) => item.text || "").join("\n") || "";
  const article = cleanJson(output);
  const words = wordCount(article.markdown);
  if (!article.title || !article.metaTitle || !article.metaDescription || !article.slug || !article.markdown) throw new Error("Composer returned incomplete News JSON");
  if (words < site.news.desired_word_count.min || words > site.news.desired_word_count.max) throw new Error("Composer returned a News editorial outside the configured word range");
  if (/<(?:script|style|iframe|form|button)\b/i.test(article.markdown)) throw new Error("Composer returned unsafe markup");
  if (!article.sourcePanel?.url || normalizedUrl(article.sourcePanel.url) !== candidate.canonicalUrl) throw new Error("Composer source panel does not match the selected candidate");
  return article;
}

function slugify(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

function validateArticle(article, site, candidate) {
  const errors = [];
  const text = `${article.title}\n${article.metaTitle}\n${article.metaDescription}\n${article.markdown}`;
  if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) errors.push("invalid-slug");
  if (wordCount(article.markdown) < site.news.desired_word_count.min || wordCount(article.markdown) > site.news.desired_word_count.max) errors.push("word-count-outside-site-range");
  if (article.sourcePanel?.url !== candidate.canonicalUrl) errors.push("source-url-mismatch");
  if (/\b(request a quote|contact us|whatsapp|MOQ|price|buy now|sales)\b/i.test(text)) errors.push("prohibited-sales-copy");
  if (/\b(guaranteed|100%|world-leading|best-in-class|leading supplier)\b/i.test(text)) errors.push("unsupported-claim");
  if (/<(?:script|style|iframe|form|button)\b/i.test(text)) errors.push("unsafe-markup");
  return { passed: errors.length === 0, errors, fingerprint: newsFingerprint(`${article.title}\n${article.markdown}`) };
}

function resolveTheme(site, now = new Date()) {
  const pointInTime = new Date(now).getTime();
  const plan = productThemePlans
    .filter((item) => item.site_id === site.site_id && item.status === "active")
    .filter((item) => {
      const startsAt = item.start_at ? new Date(item.start_at).getTime() : -Infinity;
      const endsAt = item.end_at ? new Date(item.end_at).getTime() : Infinity;
      return pointInTime >= startsAt && pointInTime <= endsAt;
    })
    .sort((left, right) => new Date(right.start_at || 0).getTime() - new Date(left.start_at || 0).getTime())[0];

  // A theme guides relevance only. It is never a reason to force a product link into a News item.
  return plan ? {
    themeId: plan.theme_id,
    productName: plan.product_name,
    productUrl: plan.product_url,
    status: plan.status
  } : null;
}

function revalidateNews(slug) {
  for (const locale of locales) {
    revalidatePath(`/${locale}/news`);
    revalidatePath(`/${locale}/news/${slug}`);
  }
  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  revalidatePath("/news-sitemap.xml");
  revalidatePath("/sitemap.xml");
}

export async function verifyFrontendNewsPublication({ site, slug, title, fetcher = fetch }) {
  const origin = site.site_url.replace(/\/$/, "");
  const listUrl = `${origin}/en${site.news.list_route}`;
  const detailUrl = `${origin}/en${site.news.detail_route_pattern.replace("[slug]", encodeURIComponent(slug))}`;
  const sitemapUrl = `${origin}${site.news.sitemap_route}`;
  const rssUrl = `${origin}${site.news.rss_route}`;
  const blogUrl = `${origin}/en${site.blog.list_route}`;
  const [list, detail, sitemap, rss, blog] = await Promise.all([fetcher(listUrl), fetcher(detailUrl), fetcher(sitemapUrl), fetcher(rssUrl), fetcher(blogUrl)]);
  const [listHtml, detailHtml, sitemapXml, rssXml, blogHtml] = await Promise.all([list.text(), detail.text(), sitemap.text(), rss.text(), blog.text()]);
  const checks = {
    listHttpStatus: list.status,
    detailHttpStatus: detail.status,
    sitemapHttpStatus: sitemap.status,
    rssHttpStatus: rss.status,
    listVisible: list.ok && listHtml.includes(slug),
    detailVisible: detail.ok && detailHtml.includes(title),
    canonicalValid: detail.ok && detailHtml.includes(`/en/news/${slug}`),
    schemaValid: detail.ok && /application\/ld\+json/i.test(detailHtml) && /NewsArticle/i.test(detailHtml),
    sourcePanelVisible: detail.ok && /Original source|Source References/i.test(detailHtml),
    blogIsolated: blog.ok && !blogHtml.includes(slug),
    details: { listUrl, detailUrl, sitemapUrl, rssUrl, blogUrl, sitemapContains: sitemapXml.includes(slug), rssContains: rssXml.includes(slug) }
  };
  return { ...checks, passed: checks.listVisible && checks.detailVisible && checks.canonicalValid && checks.schemaValid && checks.sourcePanelVisible && checks.blogIsolated && checks.sitemapHttpStatus === 200 && checks.rssHttpStatus === 200 && checks.details.sitemapContains && checks.details.rssContains };
}

export async function runNewsPublishCycle({ siteId, fetcher = fetch, now = new Date(), requestId = null, compose = composeNewsArticle, verifier = verifyFrontendNewsPublication, allowPublishing = null } = {}) {
  const site = getNewsSiteConfig(siteId);
  return withNewsAutomationLock({ siteId: site.site_id, name: "publish", ttlSeconds: 600 }, async (lock) => {
    if (lock?.locked === false) return lock;
    const run = await startNewsRun({ siteId: site.site_id, runType: "48-hour-publish", cycleStartedAt: cycleStart(now, site.news.publish_interval_hours), requestId });
    const logs = [];
    try {
      const productionEnabled = allowPublishing ?? isNewsProductionEnabled(site);
      if (!productionEnabled) {
        const result = { status: "paused", reason: "NEWS_AUTOMATION_PRODUCTION_ENABLED=false" };
        await finishNewsRun(run, { status: "paused", logs: [result] });
        return result;
      }
      const lastSuccess = await getLastSuccessfulNewsPublication(site.site_id);
      if (lastSuccess?.finished_at && new Date(now).getTime() - new Date(lastSuccess.finished_at).getTime() < site.news.publish_interval_hours * HOUR) {
        const result = { status: "not_due", reason: "48-hour publication interval has not elapsed" };
        await finishNewsRun(run, { status: "not_due", logs: [result] });
        return result;
      }
      let candidates = await listNewsCandidates({ siteId: site.site_id, status: "candidate", limit: 100 });
      if (!candidates.length) {
        const ingest = await runNewsIngestCycle({ siteId: site.site_id, fetcher, now, includeFallback: true, requestId });
        logs.push({ action: "fallback-ingest", accepted: ingest.accepted });
        candidates = await listNewsCandidates({ siteId: site.site_id, status: "candidate", limit: 100 });
      }
      if (!candidates.length) {
        const result = { status: "retry_pending", reason: "no-eligible-candidate-after-fallback-ingest" };
        await finishNewsRun(run, { status: result.status, logs: [...logs, result] });
        return result;
      }
      let lastError = null;
      for (const candidate of candidates) {
        const reserved = await reserveNewsCandidate({ siteId: site.site_id, candidateId: candidate.id });
        if (!reserved) continue;
        try {
          const article = await compose({ site, candidate: reserved, fetcher, productTheme: resolveTheme(site, now) });
          article.slug = slugify(article.slug || article.title);
          const preflight = validateArticle(article, site, reserved);
          if (!preflight.passed) throw new Error(`preflight:${preflight.errors.join(",")}`);
          const canonicalUrl = `${site.site_url.replace(/\/$/, "")}/en/news/${article.slug}`;
          const stored = await saveGeneratedNewsArticle({ siteId: site.site_id, slug: article.slug, locale: site.publication_language, title: article.title, metaTitle: article.metaTitle, metaDescription: article.metaDescription, markdown: article.markdown, status: "frontend_verifying", sourceIds: [reserved.id], factCheck: preflight, canonicalUrl });
          await saveCmsItem({
            id: `news-${article.slug}`, type: "news", contentType: "news", siteId: site.site_id, slug: article.slug,
            title: article.title, h1: article.title, excerpt: article.metaDescription, seoTitle: article.metaTitle, seoDescription: article.metaDescription,
            content: article.markdown, sections: textToSections(article.markdown), category: reserved.industry || "industry-news", categoryTitle: "Industry News",
            sources: [{ name: article.sourcePanel.name || reserved.publisher, title: article.sourcePanel.title || reserved.title, url: reserved.canonicalUrl, date: reserved.sourcePublishedAt, author: article.sourcePanel.author || reserved.author || "" }],
            sourceUrl: reserved.canonicalUrl, sourcePublisher: article.sourcePanel.name || reserved.publisher, sourcePublishedAt: reserved.sourcePublishedAt,
            editorialDisclaimer: article.editorialDisclaimer || "This page is an independent editorial summary and analysis. The original reporting remains the property of the source named above.",
            author: `${site.brand_name} ${site.news.default_author_type}`, contentOrigin: "news-automation", relevanceStatus: "verified-source", editorialStatus: "frontend-verifying", seoIndexable: true,
            coverImage: "", coverAlt: "", imageCaption: "", bodyImages: [], relatedProducts: [], faqs: [], tags: [reserved.industry].filter(Boolean), publishedAt: new Date(now).toISOString(), status: "published", href: `/news/${article.slug}`
          });
          revalidateNews(article.slug);
          const delivery = await verifier({ site, slug: article.slug, title: article.title, fetcher });
          await saveNewsDeliveryCheck({ siteId: site.site_id, articleId: stored.id, slug: article.slug, ...delivery });
          if (!delivery.passed) {
            await updateCmsItemStatus("news", article.slug, "draft");
            await saveGeneratedNewsArticle({ ...stored, siteId: site.site_id, metaTitle: article.metaTitle, metaDescription: article.metaDescription, markdown: article.markdown, status: "retry_pending", sourceIds: [reserved.id], factCheck: { ...preflight, delivery }, canonicalUrl });
            await releaseNewsCandidate({ siteId: site.site_id, candidateId: reserved.id, reason: "frontend-verification-failed" });
            throw new Error("frontend-verification-failed");
          }
          await saveGeneratedNewsArticle({ ...stored, siteId: site.site_id, metaTitle: article.metaTitle, metaDescription: article.metaDescription, markdown: article.markdown, status: "published_success", sourceIds: [reserved.id], factCheck: { ...preflight, delivery }, publishedAt: new Date(now).toISOString(), canonicalUrl });
          await markNewsCandidateUsed({ siteId: site.site_id, candidateId: reserved.id, articleId: stored.id });
          const result = { status: "published_success", slug: article.slug, url: canonicalUrl, delivery };
          await finishNewsRun(run, { status: "published_success", logs: [...logs, result] });
          await recordNewsAuditEvent({ siteId: site.site_id, eventType: "frontend_publish_verified", entityType: "news_article", entityId: stored.id, details: result });
          return result;
        } catch (error) {
          lastError = String(error?.message || error);
          await releaseNewsCandidate({ siteId: site.site_id, candidateId: reserved.id, reason: lastError });
          logs.push({ candidateId: reserved.id, result: "rejected-for-cycle", reason: lastError.slice(0, 300) });
        }
      }
      const result = { status: "retry_pending", reason: lastError || "all-candidates-failed" };
      await finishNewsRun(run, { status: result.status, logs: [...logs, result] });
      return result;
    } catch (error) {
      const message = String(error?.message || error);
      await finishNewsRun(run, { status: "failed", logs, errorSummary: message });
      throw error;
    }
  });
}

export async function getNewsOperationsDashboard(siteId) {
  return getNewsAutomationDashboard(siteId);
}

export async function getNewsAutomationRunbook(siteId) {
  const site = getNewsSiteConfig(siteId);
  const runs = await listNewsRuns({ siteId: site.site_id, limit: 20 });
  return { site, config: getNewsAutomationConfig(site.site_id), runs };
}

export function fingerprint(value = "") { return newsFingerprint(value); }
