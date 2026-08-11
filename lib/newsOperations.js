import catalog from "../data/product-application-catalog.json" with { type: "json" };
import initialPlans from "../data/initial-news-editorial-plans.json" with { type: "json" };
import { getProductBySlugWithCms } from "./productCms.js";
import { saveCmsItem, slugify, textToSections, updateCmsItemStatus } from "./cmsStore.js";
import { runSitemapMaintenanceSafely } from "./sitemap/service.js";
import { site } from "../data/site";
import {
  listEditorialPlans,
  listGeneratedArticles,
  listNewsCandidates,
  listNewsSources,
  saveEditorialPlan,
  saveGeneratedArticle,
  saveArticleSources,
  saveIndexingObservation,
  startNewsPublicationRun,
  finishNewsPublicationRun,
  upsertNewsCandidate,
  withNewsPublicationLock
} from "./newsOperationsStore.js";
import { newsFingerprint, normalizeGeneratedSourceClaims, normalizeNewsText, parseNewsRssItems, validateNewsArticle } from "./newsOperationsRules.js";
import { classifyNewsFamily } from "./newsSourceClassifier.js";
import { sanitizeArticleContent } from "./articleContent.js";
import { getProductCardSummary } from "../data/productDetailProfiles";

const DAY = 24 * 60 * 60 * 1000;

export function getNewsAutomationConfig() {
  return {
    enabled: String(process.env.NEWS_AUTOPUBLISH_ENABLED || "false").toLowerCase() === "true",
    timezone: process.env.NEWS_TIMEZONE || "Asia/Shanghai",
    model: process.env.NEWS_LLM_MODEL || "gpt-5-mini",
    hasGenerator: Boolean(process.env.OPENAI_API_KEY),
    maxSources: Math.min(20, Math.max(1, Number(process.env.NEWS_DISCOVERY_MAX_SOURCES || 8))),
    cadenceHours: 48
  };
}

export function fingerprint(value = "") {
  return newsFingerprint(value);
}

function scoreCandidate({ source, item, family }) {
  const publishedAt = new Date(item.publishedAt || 0);
  const ageDays = Number.isNaN(publishedAt.getTime()) ? 999 : (Date.now() - publishedAt.getTime()) / DAY;
  const credibility = source.priority === 1 ? 1 : 0.8;
  const relevance = family ? 0.8 : 0;
  const novelty = ageDays >= 0 && ageDays <= 90 ? 1 : 0;
  return {
    credibility,
    relevance,
    novelty,
    eligible: Boolean(family && item.summary && item.summary.length >= 80 && ageDays >= -2 && ageDays <= 90)
  };
}

export async function runDailyNewsDiscovery({ fetcher = fetch } = {}) {
  const run = await startNewsPublicationRun("daily-discovery");
  const logs = [];
  try {
    const sources = (await listNewsSources()).filter((source) => source.allowed && source.active && source.rssUrl).slice(0, getNewsAutomationConfig().maxSources);
    for (const source of sources) {
      try {
        const response = await fetcher(source.rssUrl, { headers: { "user-agent": "CowinMagnet-NewsResearch/1.0 (+https://www.cowinmagnet.com)" }, signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const items = parseNewsRssItems(await response.text());
        let accepted = 0;
        let rejected = 0;
        for (const item of items.slice(0, 30)) {
          const family = classifyNewsFamily(`${item.title} ${item.summary}`, source.domain);
          const scores = scoreCandidate({ source, item, family });
          await upsertNewsCandidate({
            sourceUrl: item.sourceUrl,
            canonicalUrl: item.sourceUrl,
            publisher: source.name,
            title: item.title,
            author: item.author,
            publishedAt: item.publishedAt || null,
            language: "en",
            industry: family?.industries?.[0] || "",
            materials: family?.materials || [],
            processStage: family?.processStages?.[0] || "",
            productFamilies: family ? [family.id] : [],
            credibilityScore: scores.credibility,
            relevanceScore: scores.relevance,
            noveltyScore: scores.novelty,
            facts: item.summary ? [{ claim: item.summary.slice(0, 500), sourceUrl: item.sourceUrl, sourceTitle: item.title }] : [],
            imageRightsStatus: "not-licensed-for-reuse",
            duplicateFingerprint: fingerprint(`${item.title}|${item.publishedAt}`),
            status: scores.eligible ? "verified" : "rejected",
            rejectionReason: scores.eligible ? null : "missing-industry-product-match-summary-or-recent-date"
          });
          if (scores.eligible) accepted += 1;
          else rejected += 1;
        }
        logs.push({ source: source.domain, status: "ok", accepted, rejected });
      } catch (error) {
        logs.push({ source: source.domain, status: "failed", message: error instanceof Error ? error.message : String(error) });
      }
    }
    await finishNewsPublicationRun(run, { status: "success", logs });
    return { status: "success", logs };
  } catch (error) {
    await finishNewsPublicationRun(run, { status: "failed", logs, errorSummary: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}

export async function seedInitialEditorialPlans() {
  const existing = await listEditorialPlans(100);
  const existingByTitle = new Map(existing.map((plan) => [plan.reason, plan]));
  const created = [];
  for (const item of initialPlans) {
    const saved = existingByTitle.get(item.title);
    if (saved) {
      const primaryProductId = saved.primary_product_id || saved.primaryProductId;
      if (!primaryProductId && saved.status !== "published") {
        created.push(await saveEditorialPlan({ ...saved, ...item, id: saved.id, status: "planned", reason: item.title }));
      }
      continue;
    }
    created.push(await saveEditorialPlan({ ...item, status: "planned", reason: item.title }));
  }
  return created;
}

export function validateGeneratedArticle(article, { knownArticleFingerprints = [] } = {}) {
  return validateNewsArticle(article, { catalog, knownArticleFingerprints });
}

function markdownToText(markdown = "") {
  return sanitizeArticleContent(markdown)
    .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function verifyPublishedNews(slug, fetcher = fetch) {
  const canonicalUrl = `${site.url}/en/news/${slug}`;
  const sitemapResult = await runSitemapMaintenanceSafely({ trigger: "news-publication", submit: false, dryRun: false });
  const response = await fetcher(canonicalUrl, { cache: "no-store", signal: AbortSignal.timeout(20000) });
  const html = await response.text();
  const canonicalValid = html.includes(`href="${canonicalUrl}"`) || html.includes(`href='${canonicalUrl}'`);
  const structuredDataValid = /application\/ld\+json/i.test(html) && /Article/i.test(html);
  const robotsIndexable = !/name=["']robots["'][^>]+noindex/i.test(html);
  return { sitemapPresent: Boolean(sitemapResult?.success), httpStatus: response.status, canonicalValid, structuredDataValid, robotsIndexable, passed: response.ok && canonicalValid && structuredDataValid && robotsIndexable };
}

async function verifySourceClaims(sourceClaims = [], fetcher = fetch) {
  const checked = [];
  for (const claim of sourceClaims) {
    if (!claim?.sourceUrl || !/^https:\/\//i.test(claim.sourceUrl)) {
      throw new Error("A source claim is missing a valid HTTPS URL");
    }
    let response = await fetcher(claim.sourceUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "CowinMagnet-NewsResearch/1.0 (+https://www.cowinmagnet.com)" }
    });
    if (!response.ok && [403, 405].includes(response.status)) {
      response = await fetcher(claim.sourceUrl, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: {
          accept: "text/html,application/xhtml+xml",
          range: "bytes=0-4095",
          "user-agent": "CowinMagnet-NewsResearch/1.0 (+https://www.cowinmagnet.com)"
        }
      });
    }
    if (!response.ok) throw new Error(`Source check failed with HTTP ${response.status}`);
    await response.body?.cancel();
    checked.push({ url: claim.sourceUrl, status: response.status });
  }
  return checked;
}

function sourceForCms(source) {
  return {
    name: source.publisher || "External source",
    title: source.sourceTitle || source.title || "Source reference",
    date: source.publishedAt ? new Date(source.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Publication date not supplied",
    url: source.sourceUrl,
    accessedDate: new Date().toISOString().slice(0, 10)
  };
}

export async function publishAutomaticallyValidatedArticle(article) {
  const config = getNewsAutomationConfig();
  if (!config.enabled) return { status: "skipped", reason: "NEWS_AUTOPUBLISH_ENABLED=false" };
  const published = await listGeneratedArticles({ status: "published", limit: 30 });
  const validation = validateGeneratedArticle(article, { knownArticleFingerprints: published.map((item) => fingerprint(`${item.title}\n${item.markdown}`)) });
  if (!validation.passed) {
    const stored = await saveGeneratedArticle({ ...article, status: "rejected", factCheck: validation });
    return { status: "skipped", article: stored, validation, reason: validation.errors.join(", ") };
  }
  try {
    await verifySourceClaims(article.sourceClaims);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const stored = await saveGeneratedArticle({ ...article, status: "rejected", factCheck: { ...validation, sourceCheckFailure: reason } });
    return { status: "skipped", article: stored, validation: { ...validation, errors: [...validation.errors, "source-accessibility-check-failed"] }, reason };
  }
  const product = await getProductBySlugWithCms(article.primaryProductId);
  if (!product?.image) {
    const failedValidation = { ...validation, passed: false, errors: [...validation.errors, "missing-local-product-media"] };
    const stored = await saveGeneratedArticle({ ...article, status: "rejected", factCheck: failedValidation });
    return { status: "skipped", article: stored, validation: failedValidation, reason: failedValidation.errors.join(", ") };
  }
  const content = markdownToText(article.articleMarkdown);
  await saveCmsItem({
    type: "news", slug: article.slug, title: article.title, excerpt: article.metaDescription, category: article.industry || "industry-news", categoryTitle: "Industry News",
    coverImage: product.image, coverAlt: `${product.name} used in ${article.industry || "industrial"} process context`, imageCaption: `COWIN MAGNET product image: ${product.name}.`,
    content, sections: textToSections(content), sources: article.sourceClaims.map(sourceForCms), author: "COWIN MAGNET Editorial", seoTitle: article.metaTitle, seoDescription: article.metaDescription,
    bodyImages: article.mediaPlan.filter((media) => media.kind !== "product-image" && /^\//.test(media.url || "")).map((media, index) => ({
      imageUrl: media.url,
      imageAlt: media.alt || "COWIN MAGNET process flow diagram",
      imageCaption: media.caption || "Illustrative process diagram prepared by COWIN MAGNET for this article.",
      imageAttributionText: media.license || "COWIN MAGNET original editorial graphic.",
      relatedSection: media.relatedSection || "Process position and equipment roles",
      displayOrder: index + 1
    })),
    faqs: article.faq || [], relatedProducts: article.relatedProducts || [product.name], relatedProductRationale: article.relatedProductRationale || "These product references describe equipment roles only. Final selection depends on material and site conditions.",
    tags: [article.primaryKeyword, article.industry].filter(Boolean), publishedAt: new Date().toISOString(), status: "published", href: `/news/${article.slug}`,
    contentOrigin: "news-operations", editorialStatus: "automatically-validated", seoIndexable: true, sourceUrl: article.sourceClaims[0]?.sourceUrl || ""
  });
  const stored = await saveGeneratedArticle({ ...article, status: "published", publishedAt: new Date().toISOString(), canonicalUrl: `https://www.cowinmagnet.com/en/news/${article.slug}`, factCheck: validation });
  await saveArticleSources(stored.id, article.sourceClaims);
  try {
    const health = await verifyPublishedNews(article.slug);
    await saveIndexingObservation({ articleId: stored.id, ...health, searchConsoleState: "unknown" });
    if (!health.passed) throw new Error(`Post-publication health check failed: HTTP ${health.httpStatus}`);
    return { status: "published", article: stored, validation, health };
  } catch (error) {
    await updateCmsItemStatus("news", article.slug, "draft");
    const reason = error instanceof Error ? error.message : String(error);
    const failed = await saveGeneratedArticle({ ...article, id: stored.id, status: "rejected", factCheck: { ...validation, postPublishFailure: reason } });
    return { status: "skipped", article: failed, validation: { ...validation, errors: [...validation.errors, "post-publication-health-check-failed"] }, reason };
  }
}

function responseText(payload) {
  if (typeof payload?.output_text === "string") return payload.output_text;
  for (const output of payload?.output || []) {
    for (const content of output?.content || []) {
      if (typeof content?.text === "string") return content.text;
    }
  }
  return "";
}

function generationPrompt({ plan, product, candidates }) {
  const facts = candidates.map((candidate) => ({
    publisher: candidate.publisher,
    publishedAt: candidate.published_at || candidate.publishedAt,
    title: candidate.title,
    url: candidate.source_url || candidate.sourceUrl,
    facts: candidate.facts || []
  }));
  return `Create one original English COWIN MAGNET industry article as strict JSON. Do not quote or rewrite source prose. Use only the supplied facts and product context. Do not claim certifications, performance numbers, customers, ownership, market rank, price, or availability. Avoid promotional superlatives and claims including world-leading, industry-leading, market-leading, leading supplier, best-in-class, the best, guaranteed, recovery rate, ROI, payback, and 100%. The article needs 1200-1800 words and must explain a real process position, selection conditions, limitations, FAQ, source and method note, and a CTA. It must use exactly one primary product and at most two secondary products. The product is ${product.name}; its reviewed public summary is: ${getProductCardSummary(product)}. The planned angle is ${plan.angle}. The candidate evidence is: ${JSON.stringify(facts)}. Return fields title, metaTitle, metaDescription, slug, primaryKeyword, secondaryKeywords, articleMarkdown, faq, internalLinks, sourceClaims, mediaPlan, editorNote. metaTitle must be 45-65 characters and metaDescription must be 120-160 characters. articleMarkdown may use plain paragraphs, Markdown headings, and simple lists only: never output raw HTML, code blocks, code snippets, Markdown tables, or embedded scripts. mediaPlan must include a local product-image URL ${product.image} and a self-made-process-diagram. sourceClaims must cite 2-4 supplied source URLs.`;
}

function fitMetadata(value, maxLength, preferredMinimum = 0) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength + 1);
  if (preferredMinimum > 0) {
    const sentenceEnd = Math.max(clipped.lastIndexOf("."), clipped.lastIndexOf("!"), clipped.lastIndexOf("?"));
    if (sentenceEnd >= preferredMinimum - 1) return clipped.slice(0, sentenceEnd + 1).trim();
  }
  const wordBoundary = clipped.lastIndexOf(" ");
  const fitted = clipped.slice(0, wordBoundary >= Math.floor(maxLength * 0.7) ? wordBoundary : maxLength).replace(/[,:;\-]+$/, "").trim();
  return preferredMinimum > 0 && !/[.!?]$/.test(fitted) ? `${fitted}.` : fitted;
}

async function generateWithOpenAI({ plan, product, candidates, fetcher = fetch }) {
  const config = getNewsAutomationConfig();
  const response = await fetcher("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: config.model,
      input: [{ role: "user", content: generationPrompt({ plan, product, candidates }) }],
      text: { format: { type: "json_object" } }
    }),
    signal: AbortSignal.timeout(90000)
  });
  if (!response.ok) throw new Error(`News generator HTTP ${response.status}`);
  const generated = JSON.parse(responseText(await response.json()));
  generated.metaTitle = fitMetadata(generated.metaTitle || generated.title, 65);
  generated.metaDescription = fitMetadata(generated.metaDescription, 160, 120);
  const sourceClaims = normalizeGeneratedSourceClaims(generated.sourceClaims, candidates);
  return {
    ...generated,
    slug: slugify(generated.slug || generated.title),
    primaryProductId: plan.primary_product_id || plan.primaryProductId,
    productIds: [plan.primary_product_id || plan.primaryProductId, ...(plan.secondary_product_ids || plan.secondaryProductIds || [])].filter(Boolean),
    industry: plan.industry,
    country: plan.country,
    sourceIds: candidates.map((candidate) => candidate.id),
    sourceClaims,
    mediaPlan: Array.isArray(generated.mediaPlan) ? generated.mediaPlan : [
      { kind: "product-image", url: product.image, license: "COWIN MAGNET product media" },
      { kind: "self-made-process-diagram", url: "/images/news/process-flow-placeholder.svg", alt: "Industrial process flow diagram", license: "COWIN MAGNET original editorial graphic" }
    ]
  };
}

export async function getNewsOperationsDashboard() {
  const config = getNewsAutomationConfig();
  const [sources, candidates, plans, articles] = await Promise.all([listNewsSources(), listNewsCandidates({ limit: 10 }), listEditorialPlans(10), listGeneratedArticles({ limit: 10 })]);
  return { config, sources, candidates, plans, articles };
}

export async function runNewsPublishCycle() {
  return withNewsPublicationLock(async () => {
    const run = await startNewsPublicationRun("48-hour-publish");
    const logs = [];
    try {
      const config = getNewsAutomationConfig();
      if (!config.enabled) {
        const result = { status: "skipped", reason: "NEWS_AUTOPUBLISH_ENABLED=false" };
        await finishNewsPublicationRun(run, { status: "skipped", logs: [result] });
        return result;
      }
      if (!config.hasGenerator) {
        const result = { status: "needs_configuration", reason: "OPENAI_API_KEY is not configured" };
        await finishNewsPublicationRun(run, { status: "needs_configuration", logs: [result] });
        return result;
      }
      const [plans, candidates] = await Promise.all([listEditorialPlans(30), listNewsCandidates({ status: "verified", limit: 100 })]);
      const published = await listGeneratedArticles({ status: "published", limit: 1 });
      const lastPublishedAt = new Date(published[0]?.published_at || published[0]?.publishedAt || 0).getTime();
      if (lastPublishedAt && Date.now() - lastPublishedAt < 48 * 60 * 60 * 1000) {
        const result = { status: "skipped", reason: "48-hour publication interval has not elapsed" };
        await finishNewsPublicationRun(run, { status: "skipped", logs: [result] });
        return result;
      }
      const planned = plans.filter((item) => item.status === "planned");
      if (!planned.length) {
        const result = { status: "skipped", reason: "No planned topic is available" };
        await finishNewsPublicationRun(run, { status: "skipped", logs: [result] });
        return result;
      }
      const recent = await listGeneratedArticles({ status: "published", limit: 4 });
      const recentIndustries = recent.slice(0, 2).map((item) => item.industry);
      const recentProducts = recent.slice(0, 3).flatMap((item) => item.product_ids || item.productIds || []);
      const recentCountries = recent.slice(0, 4).map((item) => item.country).filter(Boolean);
      const eligiblePlans = planned.filter((item) => {
        const balanced = !recentIndustries.includes(item.industry)
          && recentProducts.filter((productId) => productId === (item.primary_product_id || item.primaryProductId)).length < 3
          && (!item.country || recentCountries.filter((country) => country === item.country).length < 4);
        if (!balanced) return false;
        const publishers = new Set(candidates.filter((candidate) => candidate.industry === item.industry).map((candidate) => candidate.publisher));
        return publishers.size >= 2;
      });
      let plan = null;
      let product = null;
      for (const candidatePlan of eligiblePlans) {
        const candidateProduct = await getProductBySlugWithCms(candidatePlan.primary_product_id || candidatePlan.primaryProductId);
        if (candidateProduct) {
          plan = candidatePlan;
          product = candidateProduct;
          break;
        }
        await saveEditorialPlan({
          ...candidatePlan,
          status: "skipped",
          reason: "Primary product is unavailable; skipped automatically",
        });
        logs.push({ planId: candidatePlan.id, result: "skipped", reason: "Primary product is unavailable" });
      }
      if (!plan) {
        const result = { status: "skipped", reason: "No balanced publishable topic currently has an available product and two independent eligible sources" };
        await finishNewsPublicationRun(run, { status: "skipped", logs: [...logs, result] });
        return result;
      }
      const matching = candidates.filter((candidate) => candidate.industry === plan.industry).filter((candidate, index, array) => array.findIndex((item) => item.publisher === candidate.publisher) === index).slice(0, 4);
      if (matching.length < 2) {
        const result = { status: "skipped", reason: "Two independent eligible sources are required before generation", planId: plan.id };
        await finishNewsPublicationRun(run, { status: "skipped", logs: [result] });
        return result;
      }
      await saveEditorialPlan({ ...plan, status: "generating" });
      const article = await generateWithOpenAI({ plan, product, candidates: matching });
      const publication = await publishAutomaticallyValidatedArticle(article);
      await saveEditorialPlan({ ...plan, status: publication.status === "published" ? "published" : "planned", reason: publication.validation?.errors?.join(", ") || publication.reason || plan.reason });
      logs.push({ planId: plan.id, result: publication.status, reason: publication.reason || publication.validation?.errors || null });
      await finishNewsPublicationRun(run, { status: publication.status, logs });
      return publication;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await finishNewsPublicationRun(run, { status: "failed", logs, errorSummary: message });
      throw error;
    }
  });
}
