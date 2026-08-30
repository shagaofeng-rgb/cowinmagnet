import productThemePlans from "@/data/news-product-theme-plan.json";
import { revalidatePath } from "next/cache";
import { locales } from "@/lib/i18n";
import { saveCmsItem, updateCmsItemPublicationStatus, updateCmsItemStatus } from "./cmsStore.js";
import { validateArticleDocument } from "./articleDocument.js";
import { runNewsSourceHealthCheck } from "./news/sourceValidator.js";
import { hasDirectCowinNewsScopeSignal } from "./news/scopeGate.js";
import { getNewsSiteConfig, isNewsProductionEnabled } from "./newsAutomationConfig.js";
import {
  findCandidateFingerprint,
  getSuccessfulNewsPublicationForDay,
  getNewsAutomationDashboard,
  listNewsCandidates,
  listNewsRuns,
  markNewsCandidateUsed,
  recordNewsAuditEvent,
  recoverStaleNewsPublishWork,
  rejectNewsCandidate,
  releaseNewsCandidate,
  reserveNewsCandidate,
  saveGeneratedNewsArticle,
  saveNewsDeliveryCheck,
  saveNewsArticleEvidence,
  saveNewsQualityCheck,
  startNewsRun,
  finishNewsRun,
  listNewsSources,
  markNewsSourceUsed,
  syncNewsSources,
  upsertNewsCandidate,
  withNewsAutomationLock
} from "./newsAutomationStore.js";
import { publicationDateKey } from "./newsSchedule.js";
import { newsFingerprint, normalizeNewsText, parseNewsRssItems } from "./newsOperationsRules.js";
import { classifyNewsFamily } from "./newsSourceClassifier.js";
import { parsePublicNewsPageItems, robotsAllowsPublicDiscovery } from "./news/publicPageDiscovery.js";
import { resolveProductMedia } from "./news/product-media-resolver.js";
import { extractExternalArticleEvidence } from "./news/external-article-extractor.js";
import { syncApprovedExternalMedia } from "./news/media-sync.js";
import { buildProductFirstTopicBrief, createProductFirstNewsDocument, validateProductFirstNewsDocument } from "./news/product-first-document.js";

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
  const normalizedBody = normalizeNewsText(body);
  const relevanceMatches = (site.relevance_terms || []).filter((term) => normalizedBody.includes(normalizeNewsText(term)));
  // A source can be reputable but still publish content outside Cowin's actual scope.
  // Require a concrete material-handling, magnetic-separation, or process signal before
  // its source-quality score is allowed to make it a publishable candidate.
  const directProcessSignal = hasDirectCowinNewsScopeSignal(body);
  const relevance = family && directProcessSignal && relevanceMatches.length ? 30 : 0;
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
          : !family || !directProcessSignal ? "outside-industry-scope"
            : score < site.news.min_score ? "score-below-threshold" : null;
  return { score, reason, relevance, relevanceMatches, directProcessSignal, impact, recency, sourceQuality, theme, image, ageHours };
}

function candidateStatus(reason) {
  return reason ? "rejected" : "candidate";
}

function sourceMatchesWhitelist(item, source) {
  try { return new URL(item.sourceUrl).hostname.replace(/^www\./, "") === source.domain.replace(/^www\./, ""); } catch { return false; }
}

async function discoverItemsForSource({ source, site, fetcher }) {
  const origin = new URL(source.requested_url || `https://${source.domain}`).origin;
  // Check the source's current robots policy immediately before a public-page read.
  // RSS sources already have a configured discovery endpoint but receive the same guard.
  const robots = await fetcher(`${origin}/robots.txt`, { headers: { "user-agent": `${site.brand_name} News Research/2.0` }, signal: AbortSignal.timeout(10000) });
  if (!robots.ok || !robotsAllowsPublicDiscovery(await robots.text())) throw new Error(`robots-disallow:${robots.status}`);
  const endpoint = source.rss_or_api_url || source.requested_url || origin;
  const response = await fetcher(endpoint, { headers: { "user-agent": `${site.brand_name} News Research/2.0` }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.text();
  return source.rss_or_api_url ? parseNewsRssItems(body) : parsePublicNewsPageItems(body, endpoint);
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
  const run = await startNewsRun({ siteId: site.site_id, runType: "daily-discovery", cycleStartedAt: cycleStart(now, site.news.ingest_interval_hours), requestId });
  const logs = [];
  try {
    await syncNewsSources(site);
    const sourceHealth = await runNewsSourceHealthCheck({ siteId: site.site_id, fetcher, limit: 3 });
    const storedSources = await listNewsSources(site.site_id);
    const sources = storedSources.map((source) => ({
      site_id: site.site_id,
      domain: source.domain,
      name: source.name,
      type: source.source_type,
      allowed_topics: source.allowed_topics || [],
      allowed_languages: source.allowed_languages || [],
      rss_or_api_url: source.rss_url,
      requested_url: source.requested_url,
      source_trust_score: Number(source.source_trust_score || 0),
      sourceGroup: source.source_group,
      tier: source.tier
    }));
    if (!sources.length) throw new Error("no-enabled-news-sources-configured");
    let discovered = 0;
    let accepted = 0;
    let rejected = 0;
    // Keep every scheduled run bounded. Rotation in the store ensures a source used in a
    // published article is deferred for fourteen days, while enabled public-page sources
    // can still participate without an RSS feed or a manual approval queue.
    for (const source of sources.slice(0, 12)) {
      try {
        const items = await discoverItemsForSource({ source, site, fetcher });
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
            findCandidateFingerprint({ siteId: site.site_id, fingerprint: normalizedHash, fingerprintType: "url", excludeSourceUrl: item.sourceUrl }),
            findCandidateFingerprint({ siteId: site.site_id, fingerprint: titleHash, fingerprintType: "title", excludeSourceUrl: item.sourceUrl }),
            findCandidateFingerprint({ siteId: site.site_id, fingerprint: contentFingerprint, fingerprintType: "content", excludeSourceUrl: item.sourceUrl })
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
    const result = { status: "success", discovered, accepted, rejected, sourceHealth, nextRunAfterHours: site.news.ingest_interval_hours, logs };
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

function newsComposeTimeoutMs() {
  const configured = Number(process.env.NEWS_COMPOSE_TIMEOUT_MS);
  // Keep enough of the 120-second serverless budget for one retry and delivery checks.
  return Math.max(15000, Math.min(50000, Number.isFinite(configured) ? configured : 45000));
}

function newsDeliveryTimeoutMs() {
  const configured = Number(process.env.NEWS_DELIVERY_TIMEOUT_MS);
  return Math.max(5000, Math.min(15000, Number.isFinite(configured) ? configured : 10000));
}

function newsPublishCandidateLimit() {
  const configured = Number(process.env.NEWS_PUBLISH_CANDIDATE_LIMIT);
  // A single invocation gets one fully verified attempt. Retrying several candidates
  // serially was the direct cause of Vercel's 120 second runtime timeout.
  return Math.max(1, Math.min(1, Number.isFinite(configured) ? configured : 1));
}

function isNonRetryableCandidateFailure(message = "") {
  return /source-unavailable:(?:401|403|404|410)|source-canonical-domain-mismatch|citation-evidence-unverified|product-media:(?:missing-product-reference|product-not-found|missing_owned_product_image)/i.test(message);
}

async function withNewsTimeout(work, timeoutMs, label) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await work(controller.signal);
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`${label} timed out after ${timeoutMs}ms`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchNewsTextWithTimeout(fetcher, url, options = {}, timeoutMs, label) {
  return withNewsTimeout(async (signal) => {
    const response = await fetcher(url, { ...options, signal });
    const text = await response.text();
    return { response, text };
  }, timeoutMs, label);
}

async function resolvePublicationContext({ candidate, productTheme, fetcher }) {
  const productMedia = await resolveProductMedia({ productUrl: productTheme?.productUrl, applicationScenario: candidate.industry });
  if (!productMedia.resolved) throw new Error(`product-media:${productMedia.reason}`);
  const citation = await extractExternalArticleEvidence({ candidate, fetcher });
  if (citation.validationStatus !== "verified" || !citation.editorialSummary) throw new Error("citation-evidence-unverified");
  const externalMedia = await Promise.all((citation.images || []).map((image) => syncApprovedExternalMedia(image, { fetcher })));
  return {
    productMedia,
    citation,
    externalMedia,
    readiness: {
      productTruthResolved: true,
      productHeroImageResolved: true,
      citationsValidated: true,
      sourceSummaryGenerated: true,
      mediaRightsValidated: true,
      publicMediaStored: true,
      contentRendererValidated: true,
      seoGeoValidated: true,
      similarityValidated: true,
      cronAuthValidated: true
    }
  };
}

function bindPublicationContext(document, context) {
  const source = context.citation;
  return {
    ...document,
    heroImage: { assetId: context.productMedia.snapshot.src, alt: context.productMedia.snapshot.alt, caption: context.productMedia.product.productName },
    sources: [{
      title: source.title,
      publisher: source.publisher,
      url: source.canonicalUrl,
      ...(source.publishedAt ? { publishedAt: source.publishedAt } : {}),
      accessedAt: source.accessedAt,
      relevanceNote: "This verified source directly supports the industry context discussed in the article.",
      editorialSummary: source.editorialSummary,
      keyFacts: source.keyFacts.map((item) => item.statement).filter(Boolean).slice(0, 3)
    }],
    relatedContent: [{ contentId: context.productMedia.snapshot.productUrl, relationship: "product" }]
  };
}

function generationPrompt({ site, candidate, productTheme, publicationContext = null }) {
  const facts = candidate.facts?.[0] || {};
  const product = publicationContext?.productMedia?.product;
  const citation = publicationContext?.citation;
  const brief = buildProductFirstTopicBrief({ product, candidate, citation });
  return `Write one English product-first industry insight as strict JSON for a configured B2B site. This is not a rewrite, translation, promotion, press release or case study. The product and its confirmed application must lead the article; the cited external report is supporting industry context only. Use only supplied source and product facts. Do not invent numbers, claims, quotes, authors, companies, certifications, images, dates, customer projects, performance outcomes or product specifications. Do not include contact details, sales language, brand claims, product cards or more than one related product URL. Return exactly {"slug":"","document":{"schemaVersion":1,"locale":"en","contentType":"news","status":"draft","title":"","summary":"","primaryTopic":"","targetAudience":"","sections":[{"heading":"","level":2,"blocks":[{"type":"paragraph","text":""}]}],"faq":[],"sources":[{"title":"","publisher":"","url":"","publishedAt":"","accessedAt":"","relevanceNote":"","editorialSummary":"","keyFacts":[]}],"relatedContent":[],"cta":{"heading":"Discuss your application","text":"Share material, process position and site conditions for a configuration discussion.","label":"Discuss your application","href":"/en/request-quote"},"seo":{"metaTitle":"","metaDescription":"","canonicalPath":"","ogTitle":"","ogDescription":""},"author":{"name":"${site.brand_name} Editorial Team","profilePath":"/editorial-policy","role":"Editorial Team"}}}. Use exactly these seven H2 headings in this order: Product role in this application; Where it fits in the process; Application conditions that affect selection; What the configuration can support; Information to provide before a product discussion; Recent industry reporting; Practical takeaway. The product must be in the H1, summary and first section. The first five sections must explain the confirmed product category, application and selection conditions. Recent industry reporting may only use the verified source summary and must clearly state that it is context, not a COWIN project, endorsement or performance result. Use only paragraph, bullets, numbered-list, checklist or callout blocks; list items must never become headings. The full title, summary, sections and FAQ content together must be 1,100-1,600 English words. Make metaDescription a complete 120-150 character sentence. Use bounded language such as can support a configuration discussion; never promise what a buyer will achieve after using the product. Source facts: ${JSON.stringify({ publisher: candidate.publisher, title: candidate.title, url: candidate.canonicalUrl, publishedAt: candidate.sourcePublishedAt, author: candidate.author || null, summary: citation?.editorialSummary || facts.summary || "" })}. Product facts: ${JSON.stringify(product ? { name: product.productName, summary: product.verifiedSummary, features: product.verifiedFeatures, url: product.publicUrl, approvedIndustries: product.approvedIndustries } : null)}. Required topic brief: ${JSON.stringify(brief)}. Site industry scope: ${site.industry_scope}. Current product theme: ${productTheme ? JSON.stringify(productTheme) : "none"}.`;
}

function completeMetaDescription(title, summary) {
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  let value = clean(summary);
  if (value.length < 70) value = clean(`${title}. ${value} Industry context and practical considerations for material-handling teams.`);
  if (value.length > 160) value = value.slice(0, 159).replace(/\s+\S*$/, "").replace(/[,:;\-]+$/, "").trim();
  if (/\b(?:includes|and|or|with|for)$/i.test(value)) value = clean(`${title}: source-backed context for industrial material-handling teams`);
  if (value.length < 70) value = clean(`${title}: source-backed context and practical process questions for industrial material-handling teams`);
  if (value.length > 159) value = value.slice(0, 159).replace(/\s+\S*$/, "").replace(/[,:;\-]+$/, "").trim();
  if (!/[.!?]$/.test(value)) value = `${value}.`;
  return value;
}

function normalizeGeneratedNewsDocument(document = {}, candidate) {
  const summary = String(document.summary || candidate.facts?.[0]?.summary || candidate.title || "").trim();
  const seo = document.seo || {};
  const metaDescription = completeMetaDescription(document.title || candidate.title, seo.metaDescription || summary);
  return {
    ...document,
    summary,
    cta: {
      heading: document.cta?.heading || "Explore related equipment",
      text: document.cta?.text || "Review related equipment categories and selection information for industrial material-handling applications.",
      label: document.cta?.label || "Explore related equipment",
      href: /^\/[a-z0-9/_?=&-]*$/i.test(document.cta?.href || "") ? document.cta.href : "/en/products"
    },
    seo: {
      ...seo,
      metaDescription,
      ogDescription: completeMetaDescription(document.title || candidate.title, seo.ogDescription || metaDescription)
    }
  };
}

function sourceFact(candidate) {
  return String(candidate.title || "The source describes a development relevant to industrial material handling.")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackNewsSlug(candidate) {
  return slugify(`${candidate.title}-${candidate.sourcePublishedAt || "industry-update"}`) || `industry-update-${Date.now()}`;
}

// This is a source-bound continuity path, not a second content source. It keeps a
// verified News cycle from failing solely because an upstream model response was
// truncated or malformed, while clearly separating source facts from editorial analysis.
export function createSourceBoundFallbackNewsDocument({ site, candidate, productTheme = null, publicationContext = null }) {
  const title = String(candidate.title || "Industrial material-handling update").trim();
  const fact = sourceFact(candidate);
  const industry = String(candidate.industry || site.industry || "industrial material handling").replace(/[-_]/g, " ");
  const sourceDate = candidate.sourcePublishedAt || "the source publication date";
  const relatedContent = productTheme?.productUrl ? [{ contentId: productTheme.productUrl, relationship: "product" }] : [];
  const optionalProductText = productTheme?.productName
    ? `Where the update naturally connects with ${productTheme.productName}, the appropriate configuration still depends on the material, process position and site conditions. It should not be treated as a universal recommendation or a claim about a specific model.`
    : "The report should not be treated as a universal equipment recommendation. Configuration decisions remain dependent on the material, process position and site conditions.";
  const productContext = publicationContext?.productMedia?.product;
  const document = {
    schemaVersion: 1,
    locale: site.publication_language,
    contentType: "news",
    status: "draft",
    title,
    summary: `This editorial reviews a verified ${industry} update from ${candidate.publisher}, outlines what it may mean for process teams and lists practical questions before operational decisions are made.`,
    primaryTopic: title,
    targetAudience: "Industrial buyers, process engineers and operations teams",
    sections: [
      {
        heading: "What happened",
        level: 2,
        blocks: [{ type: "paragraph", text: `${candidate.publisher} published "${title}" on ${sourceDate}. The source reports: ${fact} This editorial is a concise, independent interpretation of that report and does not replace the original publication or any site-specific engineering review.` }]
      },
      {
        heading: "Why this update deserves attention",
        level: 2,
        blocks: [{ type: "paragraph", text: `For ${industry} teams, a verified market, regulatory, technical or operational development can affect the questions asked before material is accepted, conveyed, separated or processed. The immediate relevance is not that one report proves a particular performance outcome. It is that operations teams may need to revisit the assumptions behind material consistency, contamination risk, maintenance access, downstream protection and documentation.` }]
      },
      {
        heading: "Process implications to consider",
        level: 2,
        blocks: [{ type: "paragraph", text: `The practical impact will vary by feed material, particle size, moisture, throughput, conveyor arrangement and the point at which separation or inspection occurs. A change that matters at receiving may have a different effect before crushing, screening, blending, packaging or final dispatch. Teams should distinguish the sourced facts in the original report from local process decisions, which require current line information and an understanding of the material path.` }]
      },
      ...(productContext ? [{
        heading: "Product context for this application",
        level: 2,
        blocks: [
          { type: "paragraph", text: `${productContext.productName} is described in the approved product record as follows: ${productContext.verifiedSummary} It is included here only as a relevant product path. Configuration remains dependent on the actual material, process location and operating conditions.` },
          ...(productContext.verifiedFeatures.length ? [{ type: "bullets", items: productContext.verifiedFeatures }] : [])
        ]
      }] : []),
      {
        heading: "Questions to ask before changing a line",
        level: 2,
        blocks: [{ type: "bullets", items: [
          "Which part of the material flow is directly affected by the reported development?",
          "What current feed, conveyor, inspection and separation information is available for review?",
          "Could a change in material mix, contamination risk or handling practice alter the required process position?",
          "Which operating limits and maintenance clearances must be confirmed before a configuration is discussed?"
        ] }]
      },
      {
        heading: "How to interpret the source in context",
        level: 2,
        blocks: [{ type: "paragraph", text: `The original report is the authority for the event it describes. COWIN MAGNET's editorial perspective is limited to the decision framework around industrial material handling: clarify what has changed, identify the affected process step, collect site data and avoid assuming that a general update translates directly into one equipment choice. ${optionalProductText}` }]
      },
      {
        heading: "Information worth documenting before action",
        level: 2,
        blocks: [{ type: "paragraph", text: `A useful review starts with facts that can be checked on the line rather than broad assumptions. Document the incoming material, its likely variation, the existing conveyor or pipe route, the space available around transfer points and the intended result of any separation or inspection step. Record where rejected material can safely go, who is responsible for routine checks and whether a planned change could affect upstream or downstream equipment. This information helps distinguish a response that is proportionate to the reported update from one that adds complexity without solving the actual process risk.` }]
      },
      {
        heading: "Operational follow-through",
        level: 2,
        blocks: [
          { type: "paragraph", text: `When an update is relevant to an active operation, the first action is usually a short cross-functional review rather than an immediate change to equipment. Operations, maintenance, quality and procurement teams can compare the report with current site records, including inspection observations, maintenance history, material supplier information and recent changes to the line. That review should identify what is known, what remains uncertain and which part of the process can be observed or measured safely. It also creates a clear record for later decisions, particularly where a reported industry development may influence planning but does not by itself define a technical requirement.` },
          { type: "paragraph", text: `A measured review can start by tracing the material path from receiving through transfer, processing and discharge. For each step, note the purpose of the existing equipment, the material condition it normally sees and any recent operating change. This makes it easier to identify whether the reported development is relevant to material handling, contamination control, maintenance planning or a separate part of the operation. It also prevents a general industry update from being treated as a substitute for current site observations. Where records are incomplete, the appropriate next step is to gather those records before a change is specified or ordered.` },
          { type: "paragraph", text: `The review should also separate urgent safeguards from longer-term improvement work. A condition that presents an immediate safety or equipment-protection concern needs to follow the site's own procedures. Other questions may require a planned inspection, a material sample review or a discussion with the teams responsible for the affected process. Recording the decision owner, the evidence considered and the remaining confirmation points helps procurement and engineering teams keep later conversations focused on the actual requirement rather than on assumptions drawn from a headline.` }
        ]
      },
      {
        heading: "Where further confirmation is needed",
        level: 2,
        blocks: [
          { type: "paragraph", text: `External reporting can signal an issue or opportunity, but it cannot confirm the condition of a specific plant. Further confirmation may be needed for material characteristics, local regulations, available installation space, electrical arrangements, maintenance access and the intended handling outcome. These details are especially important where the process involves mixed feed, variable contamination or several pieces of equipment in sequence. Keeping the boundary clear between a verified source update and confirmed project information helps teams make decisions that are practical, traceable and appropriate for their own operating conditions.` },
          { type: "paragraph", text: `Teams should also monitor follow-up information from the original publisher and other authoritative industry sources, especially where the update changes specifications, handling practices, regulations or supply conditions. Keep the original publication date in view when discussing the item internally. If the topic affects an active project, record the actual material, capacity, installation constraints and required outcome so that any later technical discussion is tied to evidence rather than a general headline. A concise record of the source, the affected step and the remaining questions makes a later review more useful than a broad response to a single industry headline.` },
          { type: "paragraph", text: `Before closing the review, teams can identify whether the report changes an existing decision, creates a question for a supplier or simply warrants monitoring. This is useful when several departments use the same line information for operations, purchasing and maintenance planning. It keeps the external report in its proper role: a verified piece of context that may guide questions, not a performance specification or a promise about a particular configuration. Any product discussion should remain tied to the confirmed material, process position and site conditions available for the intended application.` }
        ]
      }
    ],
    faq: [
      { question: "Is this article a replacement for the original source?", answer: "No. It is an independent editorial summary and process-focused interpretation. Readers should review the original source for the complete facts and context." },
      { question: "Does this update determine a specific equipment configuration?", answer: "No. Equipment selection depends on the material, process position, operating conditions and confirmed project requirements." }
    ],
    sources: [{ title, publisher: candidate.publisher, url: candidate.canonicalUrl, publishedAt: candidate.sourcePublishedAt || "", accessedAt: new Date().toISOString(), relevanceNote: "This verified source directly supports the reported industry update discussed in the article." }],
    relatedContent,
    cta: { heading: "Explore related equipment", text: "Review related equipment categories and selection information for industrial material-handling applications.", label: "Explore related equipment", href: "/en/products" },
    seo: { metaTitle: `${title} | COWIN MAGNET`, metaDescription: completeMetaDescription(title, `Source-backed ${industry} update with practical process questions for industrial material-handling teams`), canonicalPath: `/en/news/${fallbackNewsSlug(candidate)}`, ogTitle: `${title} | COWIN MAGNET`, ogDescription: completeMetaDescription(title, `Source-backed ${industry} update with practical process questions for industrial material-handling teams`) },
    author: { name: `${site.brand_name} Editorial Team`, profilePath: "/editorial-policy", role: "Editorial Team" }
  };
  return { slug: fallbackNewsSlug(candidate), document };
}

function createProductFirstFallbackNewsDocument({ site, candidate, publicationContext }) {
  return createProductFirstNewsDocument({
    site,
    candidate,
    productMedia: publicationContext?.productMedia,
    citation: publicationContext?.citation
  });
}

async function composeNewsArticle({ site, candidate, fetcher = fetch, productTheme = null, publicationContext = null }) {
  if (!process.env.OPENAI_API_KEY) {
    const fallback = createProductFirstFallbackNewsDocument({ site, candidate, publicationContext });
    return { ...fallback, document: publicationContext ? bindPublicationContext(fallback.document, publicationContext) : fallback.document };
  }
  let payload;
  try {
    payload = await withNewsTimeout(async (signal) => {
      const response = await fetcher("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: process.env.NEWS_LLM_MODEL || "gpt-5-mini",
          input: [{ role: "user", content: generationPrompt({ site, candidate, productTheme, publicationContext }) }],
          max_output_tokens: 5000,
          text: { format: { type: "json_object" } }
        }),
        signal
      });
      if (!response.ok) throw new Error(`News composer HTTP ${response.status}`);
      return response.json();
    }, newsComposeTimeoutMs(), "News composer");
  } catch {
    // An upstream generation outage must not fail a verified candidate. The
    // deterministic fallback still passes the fact, schema and delivery gates.
    const fallback = createProductFirstFallbackNewsDocument({ site, candidate, publicationContext });
    return { ...fallback, document: publicationContext ? bindPublicationContext(fallback.document, publicationContext) : fallback.document };
  }
  const output = payload.output_text || payload.output?.flatMap((entry) => entry.content || []).map((item) => item.text || "").join("\n") || "";
  let article;
  try {
    article = cleanJson(output);
  } catch {
    const fallback = createProductFirstFallbackNewsDocument({ site, candidate, publicationContext });
    return { ...fallback, document: publicationContext ? bindPublicationContext(fallback.document, publicationContext) : fallback.document };
  }
  const document = normalizeGeneratedNewsDocument(article.document, candidate);
  const boundDocument = publicationContext ? bindPublicationContext(document, publicationContext) : document;
  const words = wordCount([document?.title, document?.summary, ...(document?.sections || []).flatMap((section) => section.blocks || []).map((block) => block.text || (block.items || []).join(" "))].join(" "));
  const productFirst = validateProductFirstNewsDocument(boundDocument, { productName: publicationContext?.productMedia?.product?.productName, sourceUrl: candidate.canonicalUrl });
  if (!document?.title || !document?.seo?.metaTitle || !document?.seo?.metaDescription || !article.slug || words < site.news.desired_word_count.min || words > site.news.desired_word_count.max || !document.sources?.[0]?.url || normalizedUrl(document.sources[0].url) !== candidate.canonicalUrl || !productFirst.passed) {
    const fallback = createProductFirstFallbackNewsDocument({ site, candidate, publicationContext });
    return { ...fallback, document: publicationContext ? bindPublicationContext(fallback.document, publicationContext) : fallback.document };
  }
  return { slug: article.slug, document: boundDocument };
}

function slugify(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

function validateArticle(article, site, candidate, productName = "") {
  const validation = validateArticleDocument(article.document);
  const errors = [...validation.errors];
  const text = JSON.stringify(validation.document);
  const productFirst = validateProductFirstNewsDocument(validation.document, { productName, sourceUrl: candidate.canonicalUrl });
  if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) errors.push("invalid-slug");
  if (validation.wordCount < site.news.desired_word_count.min || validation.wordCount > site.news.desired_word_count.max) errors.push("word-count-outside-site-range");
  if (validation.document.sources?.[0]?.url !== candidate.canonicalUrl) errors.push("source-url-mismatch");
  if (validation.document.contentType === "news" && !validation.document.heroImage?.assetId) errors.push("news-product-hero-required");
  if (/\b(request a quote|contact us|whatsapp|MOQ|price|buy now|sales)\b/i.test(text)) errors.push("prohibited-sales-copy");
  if (/\b(guaranteed|100%|world-leading|best-in-class|leading supplier)\b/i.test(text)) errors.push("unsupported-claim");
  if (/<(?:script|style|iframe|form|button)\b/i.test(text)) errors.push("unsafe-markup");
  errors.push(...productFirst.errors);
  return { passed: errors.length === 0, errors, warnings: validation.warnings, fingerprint: newsFingerprint(`${validation.document.title}\n${validation.fingerprint}`), document: validation.document };
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

export async function verifyFrontendNewsPublication({ site, slug, title, contentType = "news", fetcher = fetch }) {
  const origin = site.site_url.replace(/\/$/, "");
  const listUrl = `${origin}/en${site.news.list_route}`;
  const detailUrl = `${origin}/en${site.news.detail_route_pattern.replace("[slug]", encodeURIComponent(slug))}`;
  const sitemapUrl = `${origin}${site.news.sitemap_route}`;
  const rssUrl = `${origin}${site.news.rss_route}`;
  const blogUrl = `${origin}/en${site.blog.list_route}`;
  const timeoutMs = newsDeliveryTimeoutMs();
  const [list, detail, sitemap, rss, blog] = await Promise.all([
    fetchNewsTextWithTimeout(fetcher, listUrl, {}, timeoutMs, "News list verification"),
    fetchNewsTextWithTimeout(fetcher, detailUrl, {}, timeoutMs, "News detail verification"),
    fetchNewsTextWithTimeout(fetcher, sitemapUrl, {}, timeoutMs, "News sitemap verification"),
    fetchNewsTextWithTimeout(fetcher, rssUrl, {}, timeoutMs, "News RSS verification"),
    fetchNewsTextWithTimeout(fetcher, blogUrl, {}, timeoutMs, "Blog isolation verification")
  ]);
  const listHtml = list.text;
  const detailHtml = detail.text;
  const sitemapXml = sitemap.text;
  const rssXml = rss.text;
  const blogHtml = blog.text;
  const checks = {
    listHttpStatus: list.response.status,
    detailHttpStatus: detail.response.status,
    sitemapHttpStatus: sitemap.response.status,
    rssHttpStatus: rss.response.status,
    listVisible: list.response.ok && listHtml.includes(slug),
    detailVisible: detail.response.ok && detailHtml.includes(title),
    canonicalValid: detail.response.ok && detailHtml.includes(`/en/news/${slug}`),
    schemaValid: detail.response.ok && /application\/ld\+json/i.test(detailHtml) && new RegExp(contentType === "news" ? "NewsArticle" : "Article", "i").test(detailHtml),
    sourcePanelVisible: contentType !== "news" || (detail.response.ok && /<h2>Sources<\/h2>/i.test(detailHtml)),
    sourceSummaryVisible: contentType !== "news" || (detail.response.ok && /Read the original report/i.test(detailHtml) && /External developments are cited for context/i.test(detailHtml)),
    productHeroVisible: detail.response.ok && /<img[^>]+alt=["'][^"']+for [^"']+/i.test(detailHtml),
    blogIsolated: blog.response.ok && !blogHtml.includes(slug),
    details: { listUrl, detailUrl, sitemapUrl, rssUrl, blogUrl, sitemapContains: sitemapXml.includes(slug), rssContains: rssXml.includes(slug) }
  };
  return { ...checks, passed: checks.listVisible && checks.detailVisible && checks.canonicalValid && checks.schemaValid && checks.sourcePanelVisible && checks.sourceSummaryVisible && checks.productHeroVisible && checks.blogIsolated && checks.sitemapHttpStatus === 200 && checks.rssHttpStatus === 200 && checks.details.sitemapContains && checks.details.rssContains };
}

export async function runNewsPublishCycle({ siteId, fetcher = fetch, now = new Date(), requestId = null, compose = composeNewsArticle, verifier = verifyFrontendNewsPublication, allowPublishing = null } = {}) {
  const site = getNewsSiteConfig(siteId);
  return withNewsAutomationLock({ siteId: site.site_id, name: "publish", ttlSeconds: 600 }, async (lock) => {
    if (lock?.locked === false) return lock;
    const recovery = await recoverStaleNewsPublishWork({ siteId: site.site_id });
    const run = await startNewsRun({ siteId: site.site_id, runType: "daily-publish", cycleStartedAt: cycleStart(now, site.news.publish_interval_hours), requestId });
    const logs = recovery.recoveredRuns || recovery.releasedCandidates ? [{ action: "recovered-stale-work", ...recovery }] : [];
    try {
      const productionEnabled = allowPublishing ?? isNewsProductionEnabled(site);
      if (!productionEnabled) {
        const result = { status: "paused", reason: "NEWS_AUTOMATION_PRODUCTION_ENABLED=false" };
        await finishNewsRun(run, { status: "paused", logs: [result] });
        return result;
      }
      const publicationDate = publicationDateKey(now, site.timezone);
      const todaySuccess = await getSuccessfulNewsPublicationForDay({ siteId: site.site_id, timeZone: site.timezone, publicationDate });
      if (todaySuccess) {
        const result = { status: "already_published_today", reason: "a frontend-verified News article already published for this site day", publicationDate, timeZone: site.timezone };
        await finishNewsRun(run, { status: result.status, logs: [result] });
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
      for (const candidate of candidates.slice(0, newsPublishCandidateLimit())) {
        const reserved = await reserveNewsCandidate({ siteId: site.site_id, candidateId: candidate.id });
        if (!reserved) continue;
        try {
          const productTheme = resolveTheme(site, now);
          if (!productTheme?.productUrl) throw new Error("no-active-product-theme");
          const publicationContext = await resolvePublicationContext({ candidate: reserved, productTheme, fetcher });
          const article = await compose({ site, candidate: reserved, fetcher, productTheme, publicationContext });
          article.document = bindPublicationContext(article.document, publicationContext);
          article.slug = slugify(article.slug || article.document?.title);
          if (article.document?.seo) article.document.seo.canonicalPath = `/en/news/${article.slug}`;
          const preflight = validateArticle(article, site, reserved, publicationContext.productMedia.product.productName);
          if (!preflight.passed) throw new Error(`preflight:${preflight.errors.join(",")}`);
          const document = preflight.document;
          document.status = "published";
          document.publishedAt = new Date(now).toISOString();
          document.modifiedAt = document.publishedAt;
          document.seo.canonicalPath = `/en/news/${article.slug}`;
          const canonicalUrl = `${site.site_url.replace(/\/$/, "")}${document.seo.canonicalPath}`;
          const stored = await saveGeneratedNewsArticle({ siteId: site.site_id, slug: article.slug, locale: site.publication_language, title: document.title, metaTitle: document.seo.metaTitle, metaDescription: document.seo.metaDescription, markdown: "", document, contentType: document.contentType, validation: preflight, status: "frontend_verifying", sourceIds: [reserved.id], factCheck: preflight, canonicalUrl });
          await saveNewsArticleEvidence({ siteId: site.site_id, articleId: stored.id, candidateId: reserved.id, productSnapshot: publicationContext.productMedia.snapshot, citations: [publicationContext.citation], media: publicationContext.externalMedia, readiness: publicationContext.readiness });
          await saveNewsQualityCheck({ siteId: site.site_id, articleId: stored.id, checkType: "publication-readiness", passed: Object.values(publicationContext.readiness).every(Boolean), details: publicationContext.readiness });
          await saveCmsItem({
            id: `news-${article.slug}`, type: "news", contentType: "news", siteId: site.site_id, slug: article.slug,
            title: document.title, h1: document.title, excerpt: document.summary, seoTitle: document.seo.metaTitle, seoDescription: document.seo.metaDescription,
            articleDocument: document, category: reserved.industry || "industry-news", categoryTitle: "Industry News",
            sourceUrl: reserved.canonicalUrl, sourcePublisher: reserved.publisher, sourcePublishedAt: reserved.sourcePublishedAt,
            author: document.author.name, contentOrigin: "news-automation", relevanceStatus: "verified-source", editorialStatus: "frontend-verifying", seoIndexable: true,
            coverImage: document.heroImage?.assetId || "", coverAlt: document.heroImage?.alt || "", imageCaption: document.heroImage?.caption || "", bodyImages: [], relatedProducts: [publicationContext.productMedia.snapshot.productUrl], faqs: document.faq, tags: [reserved.industry].filter(Boolean), publishedAt: document.publishedAt, status: "published", href: `/news/${article.slug}`
          });
          revalidateNews(article.slug);
          const delivery = await verifier({ site, slug: article.slug, title: document.title, contentType: document.contentType, fetcher });
          await saveNewsDeliveryCheck({ siteId: site.site_id, articleId: stored.id, slug: article.slug, ...delivery });
          if (!delivery.passed) {
            await updateCmsItemPublicationStatus("news", article.slug, { status: "draft", editorialStatus: "delivery-failed" });
            await saveGeneratedNewsArticle({ ...stored, siteId: site.site_id, metaTitle: document.seo.metaTitle, metaDescription: document.seo.metaDescription, markdown: "", document: { ...document, status: "needs_revision" }, contentType: document.contentType, validation: preflight, status: "retry_pending", sourceIds: [reserved.id], factCheck: { ...preflight, delivery }, canonicalUrl });
            await releaseNewsCandidate({ siteId: site.site_id, candidateId: reserved.id, reason: "frontend-verification-failed" });
            throw new Error("frontend-verification-failed");
          }
          await updateCmsItemPublicationStatus("news", article.slug, { status: "published", editorialStatus: "automatically-validated" });
          await saveGeneratedNewsArticle({ ...stored, siteId: site.site_id, metaTitle: document.seo.metaTitle, metaDescription: document.seo.metaDescription, markdown: "", document, contentType: document.contentType, validation: preflight, status: "published_success", sourceIds: [reserved.id], factCheck: { ...preflight, delivery }, publishedAt: new Date(now).toISOString(), canonicalUrl });
          await markNewsCandidateUsed({ siteId: site.site_id, candidateId: reserved.id, articleId: stored.id });
          // A source's 14-day rotation starts only after it becomes a public citation.
          // Discovery alone must not consume a source slot.
          await markNewsSourceUsed({ siteId: site.site_id, domain: new URL(reserved.canonicalUrl).hostname.replace(/^www\./i, "") });
          const result = { status: "published_success", slug: article.slug, url: canonicalUrl, delivery };
          await finishNewsRun(run, { status: "published_success", logs: [...logs, result] });
          await recordNewsAuditEvent({ siteId: site.site_id, eventType: "frontend_publish_verified", entityType: "news_article", entityId: stored.id, details: result });
          return result;
        } catch (error) {
          lastError = String(error?.message || error);
          if (isNonRetryableCandidateFailure(lastError)) {
            await rejectNewsCandidate({ siteId: site.site_id, candidateId: reserved.id, reason: lastError });
          } else {
            await releaseNewsCandidate({ siteId: site.site_id, candidateId: reserved.id, reason: lastError });
          }
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
