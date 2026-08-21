const CONTENT_TYPES = new Set([
  "news",
  "technical-guide",
  "application-guide",
  "product-update",
  "case-study",
  "procurement-guide"
]);

const BLOCK_TYPES = new Set(["paragraph", "bullets", "numbered-list", "checklist", "callout", "image", "table"]);
const PRIVATE_KEYS = new Set([
  "prompt", "sourceClaims", "internalLinkPlan", "seoFields", "cmsChecklist", "evidenceFiles",
  "authoringNotes", "llmCommentary", "qaNotes", "reviewNotes", "workflow", "internal"
]);
const FORBIDDEN_HEADING = /^(?:update\s+note\s*\d*|industry\s+update|context|source\s+and\s+method\s+note|original\s+source|call\s+to\s+action|seo\s+meta|ai\s+citation\s+ready(?:\s+summary)?|internal\s+linking(?:\s+suggestions)?|cms\s+publishing\s+checklist|sourceclaims|prompt(?:\s+instructions)?)$/i;
const INCOMPLETE_META_ENDING = /\b(?:includes|and|or|with|for)\s*[.,;:!?-]*$/i;
const RAW_MARKDOWN = /(^|\n)\s*(?:#{1,6}\s+|```|[-*+]\s+|\d+[.)]\s+)/m;
const PROHIBITED_CLAIMS = /\b(?:100%|guaranteed|world[-\s]?leading|best[-\s]?in[-\s]?class|certified|patented|tested performance|proven performance)\b/i;

function cleanText(value = "") {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value = "") {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function wordCount(value = "") {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

function asItems(value) {
  return Array.isArray(value) ? value.map(cleanText).filter(Boolean) : [];
}

function safeBlock(block) {
  if (!block || !BLOCK_TYPES.has(block.type)) return null;
  if (block.type === "paragraph") {
    const text = cleanText(block.text);
    return text ? { type: "paragraph", text } : null;
  }
  if (["bullets", "numbered-list", "checklist"].includes(block.type)) {
    const items = asItems(block.items);
    return items.length ? { type: block.type, items } : null;
  }
  if (block.type === "callout") {
    const title = cleanText(block.title);
    const text = cleanText(block.text);
    return title && text ? { type: "callout", title, text, tone: block.tone === "warning" ? "warning" : "info" } : null;
  }
  if (block.type === "image") {
    const assetId = cleanText(block.assetId);
    const alt = cleanText(block.alt);
    return assetId && alt ? { type: "image", assetId, alt, ...(cleanText(block.caption) ? { caption: cleanText(block.caption) } : {}) } : null;
  }
  const columns = asItems(block.columns);
  const rows = Array.isArray(block.rows) ? block.rows.map((row) => asItems(row)).filter((row) => row.length === columns.length) : [];
  return columns.length && rows.length ? { type: "table", columns, rows } : null;
}

function textBlocks(value = "") {
  const lines = String(value || "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let paragraph = [];
  let bullets = [];
  let ordered = [];
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: cleanText(paragraph.join(" ")) });
    if (bullets.length) blocks.push({ type: "bullets", items: bullets.map(cleanText).filter(Boolean) });
    if (ordered.length) blocks.push({ type: "numbered-list", items: ordered.map(cleanText).filter(Boolean) });
    paragraph = [];
    bullets = [];
    ordered = [];
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    const bullet = line.match(/^[-*+]\s+(.+)/);
    const orderedItem = line.match(/^\d+[.)]\s+(.+)/);
    if (bullet) { if (paragraph.length || ordered.length) flush(); bullets.push(bullet[1]); continue; }
    if (orderedItem) { if (paragraph.length || bullets.length) flush(); ordered.push(orderedItem[1]); continue; }
    if (/^#{1,6}\s+/.test(line)) { flush(); continue; }
    if (bullets.length || ordered.length) flush();
    paragraph.push(line);
  }
  flush();
  return blocks.filter((block) => block.type !== "paragraph" || block.text);
}

function legacySections(post = {}) {
  const sourceSections = Array.isArray(post.sections) ? post.sections : [];
  const sections = sourceSections.map((section, index) => {
    const heading = cleanText(section?.heading).replace(/^#{1,6}\s+/, "");
    const blocks = textBlocks(section?.body || "");
    if (!blocks.length) return null;
    return {
      heading: heading && !FORBIDDEN_HEADING.test(heading) ? heading : index === 0 ? "Overview" : `Key Consideration ${index + 1}`,
      level: 2,
      blocks
    };
  }).filter(Boolean);
  if (sections.length) return sections;
  const blocks = textBlocks(post.content || "");
  return blocks.length ? [{ heading: "Overview", level: 2, blocks }] : [];
}

function documentText(document) {
  return [
    document.title,
    document.summary,
    ...document.sections.flatMap((section) => [section.heading, ...section.blocks.flatMap((block) => block.type === "paragraph" ? [block.text] : block.items || [block.title, block.text])]),
    ...document.faq.flatMap((entry) => [entry.question, entry.answer])
  ].join(" ");
}

export function normalizeArticleDocument(document = {}) {
  const contentType = CONTENT_TYPES.has(document.contentType) ? document.contentType : "technical-guide";
  const sections = Array.isArray(document.sections) ? document.sections.map((section) => {
    const heading = cleanText(section?.heading).replace(/^#{1,6}\s+/, "");
    const blocks = Array.isArray(section?.blocks) ? section.blocks.map(safeBlock).filter(Boolean) : [];
    return heading && blocks.length ? { heading, level: section.level === 3 ? 3 : 2, blocks } : null;
  }).filter(Boolean) : [];
  const faq = (Array.isArray(document.faq) ? document.faq : []).map((item) => ({ question: cleanText(item?.question), answer: cleanText(item?.answer) })).filter((item) => item.question && item.answer);
  const sources = (Array.isArray(document.sources) ? document.sources : []).map((item) => ({
    title: cleanText(item?.title), publisher: cleanText(item?.publisher), url: cleanText(item?.url),
    ...(cleanText(item?.publishedAt) ? { publishedAt: cleanText(item.publishedAt) } : {}),
    accessedAt: cleanText(item?.accessedAt) || new Date().toISOString(), relevanceNote: cleanText(item?.relevanceNote),
    ...(cleanText(item?.editorialSummary) ? { editorialSummary: cleanText(item.editorialSummary) } : {}),
    ...(Array.isArray(item?.keyFacts) ? { keyFacts: item.keyFacts.map(cleanText).filter(Boolean).slice(0, 3) } : {})
  })).filter((item) => item.title && item.publisher && item.url);
  const clean = {
    schemaVersion: 1,
    locale: cleanText(document.locale) || "en",
    contentType,
    status: ["draft", "in_review", "approved", "published", "needs_revision"].includes(document.status) ? document.status : "draft",
    title: cleanText(document.title),
    summary: cleanText(document.summary),
    primaryTopic: cleanText(document.primaryTopic),
    targetAudience: cleanText(document.targetAudience),
    sections,
    faq,
    sources,
    relatedContent: (Array.isArray(document.relatedContent) ? document.relatedContent : []).map((item) => ({ contentId: cleanText(item?.contentId), relationship: ["product", "application", "guide"].includes(item?.relationship) ? item.relationship : "guide" })).filter((item) => item.contentId),
    cta: { heading: cleanText(document.cta?.heading), text: cleanText(document.cta?.text), label: cleanText(document.cta?.label), href: cleanText(document.cta?.href) },
    seo: {
      metaTitle: cleanText(document.seo?.metaTitle), metaDescription: cleanText(document.seo?.metaDescription), canonicalPath: cleanText(document.seo?.canonicalPath),
      ogTitle: cleanText(document.seo?.ogTitle), ogDescription: cleanText(document.seo?.ogDescription), ...(cleanText(document.seo?.ogImageAssetId) ? { ogImageAssetId: cleanText(document.seo.ogImageAssetId) } : {})
    },
    author: { name: cleanText(document.author?.name) || "COWIN MAGNET Editorial Team", ...(cleanText(document.author?.profilePath) ? { profilePath: cleanText(document.author.profilePath) } : {}), ...(cleanText(document.author?.role) ? { role: cleanText(document.author.role) } : {}) }
  };
  if (document.heroImage?.assetId && document.heroImage?.alt) clean.heroImage = { assetId: cleanText(document.heroImage.assetId), alt: cleanText(document.heroImage.alt), ...(cleanText(document.heroImage.caption) ? { caption: cleanText(document.heroImage.caption) } : {}) };
  if (document.reviewedBy?.name && document.reviewedBy?.role && document.reviewedBy?.reviewedAt) clean.reviewedBy = { name: cleanText(document.reviewedBy.name), role: cleanText(document.reviewedBy.role), reviewedAt: cleanText(document.reviewedBy.reviewedAt) };
  if (document.publishedAt) clean.publishedAt = cleanText(document.publishedAt);
  if (document.modifiedAt) clean.modifiedAt = cleanText(document.modifiedAt);
  return clean;
}

export function createArticleDocumentFromLegacy(post = {}) {
  const contentType = CONTENT_TYPES.has(post.contentType) ? post.contentType : "news";
  const sources = (post.sources || []).map((source) => ({
    title: source.title || post.title || "Source material", publisher: source.name || post.source || "Source", url: source.url || post.sourceUrl || "",
    publishedAt: source.date || post.sourcePublishedAt || "", accessedAt: source.accessedDate || post.updatedAt || new Date().toISOString(), relevanceNote: "Legacy source retained for editorial review."
  })).filter((source) => source.url);
  return normalizeArticleDocument({
    schemaVersion: 1, locale: post.locale || "en", contentType, status: post.status === "published" ? "published" : "draft",
    title: post.title || "Untitled article", summary: post.excerpt || post.seoDescription || "",
    primaryTopic: post.primaryTopic || post.categoryTitle || post.category || post.title || "Industrial magnetic separation",
    targetAudience: post.targetAudience || "Industrial buyers and process teams", heroImage: post.coverImage ? { assetId: post.coverImage, alt: post.coverAlt || post.title } : undefined,
    sections: legacySections(post), faq: post.faqs || [], sources,
    relatedContent: (post.relatedProducts || []).map((contentId) => ({ contentId, relationship: "product" })),
    cta: post.cta || { heading: "Discuss your application", text: "Share the material and site conditions needed for a useful configuration discussion.", label: "Request a Quote", href: "/en/request-quote" },
    seo: { metaTitle: post.seoTitle || post.title || "", metaDescription: post.seoDescription || post.excerpt || "", canonicalPath: `/en/news/${post.slug || ""}`, ogTitle: post.seoTitle || post.title || "", ogDescription: post.seoDescription || post.excerpt || "", ogImageAssetId: post.coverImage || "" },
    author: { name: post.author || "COWIN MAGNET Editorial Team", profilePath: "/editorial-policy", role: "Editorial Team" }, publishedAt: post.publishedAt, modifiedAt: post.updatedAt
  });
}

export function getArticleDocument(post = {}) {
  return post.articleDocument?.schemaVersion === 1 ? normalizeArticleDocument(post.articleDocument) : createArticleDocumentFromLegacy(post);
}

export function validateArticleDocument(input, { allowLegacyMetaOverride = false } = {}) {
  const document = normalizeArticleDocument(input);
  const errors = [];
  const warnings = [];
  const add = (condition, code) => { if (condition) errors.push(code); };
  add(!document.title, "title-required");
  add(!document.summary, "summary-required");
  add(!document.primaryTopic, "primary-topic-required");
  add(!document.targetAudience, "target-audience-required");
  add(!document.seo.metaTitle || !document.seo.metaDescription || !document.seo.canonicalPath, "seo-required");
  const metaLength = document.seo.metaDescription.length;
  add(!allowLegacyMetaOverride && (metaLength < 70 || metaLength > 160), "meta-description-length");
  add(INCOMPLETE_META_ENDING.test(document.seo.metaDescription), "meta-description-incomplete");
  add(!/^\/[a-z0-9/_-]*$/i.test(document.seo.canonicalPath), "invalid-canonical-path");
  add(document.sections.length === 0, "sections-required");
  const renderedH2s = document.sections.length + (document.faq.length ? 1 : 0);
  if (document.contentType !== "news") add(renderedH2s < 5 || renderedH2s > 8, "guide-heading-count");
  add(document.contentType === "news" && document.sections.length > 10, "news-heading-count");
  for (const section of document.sections) {
    add(FORBIDDEN_HEADING.test(section.heading), `forbidden-heading:${section.heading}`);
    add(/^[-*•]\s|^\d+[.)]\s|^[a-z][.)]\s/i.test(section.heading), `list-heading:${section.heading}`);
    add(section.heading.length > 120, `heading-too-long:${section.heading.slice(0, 48)}`);
    for (const block of section.blocks) {
      if (block.type === "paragraph") add(RAW_MARKDOWN.test(block.text), "raw-markdown-paragraph");
      if (["bullets", "numbered-list", "checklist"].includes(block.type)) add(!block.items.length, "empty-list");
    }
  }
  const faqKeys = new Set();
  add(document.faq.length > 6, "faq-count");
  for (const entry of document.faq) {
    const key = normalizeKey(entry.question);
    add(!key || faqKeys.has(key), "duplicate-faq");
    faqKeys.add(key);
  }
  if (document.contentType === "news") {
    add(!document.sources.length, "news-source-required");
    for (const source of document.sources) {
      add(!/^https:\/\//i.test(source.url), "invalid-source-url");
      add(!source.relevanceNote, "source-relevance-required");
      const sourceWords = wordCount(source.editorialSummary || "");
      add(sourceWords < 60 || sourceWords > 120, "source-summary-length");
    }
  } else if (document.sources.length) {
    warnings.push("guide-has-sources-review-relevance");
  }
  add(!document.cta.heading || !document.cta.text || !document.cta.label || !/^\/[a-z0-9/_?=&-]*$/i.test(document.cta.href), "invalid-cta");
  if (document.heroImage) add(!document.heroImage.alt || /used in .*process context/i.test(document.heroImage.alt), "hero-alt-invalid");
  const text = documentText(document);
  add(PROHIBITED_CLAIMS.test(text), "unverified-claim");
  add(/\b(?:as an ai|language model|i cannot|prompt|sourceclaims|cms checklist|ai citation ready)\b/i.test(text), "internal-or-ai-text");
  const paragraphs = document.sections.flatMap((section) => section.blocks.filter((block) => block.type === "paragraph").map((block) => normalizeKey(block.text)));
  add(new Set(paragraphs).size !== paragraphs.length, "duplicate-paragraph");
  const titleTokens = normalizeKey(document.title).split(" ").filter((token) => token.length > 3);
  const topicTokens = normalizeKey(document.primaryTopic).split(" ").filter((token) => token.length > 3);
  add(titleTokens.length && topicTokens.length && !titleTokens.some((token) => topicTokens.includes(token)), "title-topic-drift");
  for (const key of Object.keys(input || {})) add(PRIVATE_KEYS.has(key), `private-field:${key}`);
  return { passed: errors.length === 0, errors, warnings, document, wordCount: wordCount(text), fingerprint: normalizeKey([document.title, ...document.sections.map((section) => section.heading), ...paragraphs].join(" ")) };
}

export function articleSchemaType(document) {
  return document.contentType === "news" ? "NewsArticle" : "Article";
}

export function publicArticlePayload(document) {
  const normalized = normalizeArticleDocument(document);
  return Object.fromEntries(Object.entries(normalized).filter(([key]) => !PRIVATE_KEYS.has(key)));
}

export function contentFingerprint(document) {
  return validateArticleDocument(document, { allowLegacyMetaOverride: true }).fingerprint;
}
