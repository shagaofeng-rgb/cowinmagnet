import { newsSystemConfig } from "../../config/news-system.config.mjs";

function textOf(article) {
  return [
    article.title,
    article.seoTitle,
    article.seoDescription,
    article.excerpt,
    ...(article.sections || []).flatMap((section) => [section.heading, section.body]),
    ...(article.faqs || []).flatMap((faq) => [faq.question, faq.answer]),
    article.imageCaption,
    article.sourceAttributionText
  ]
    .filter(Boolean)
    .join(" ");
}

function wordCount(article) {
  return textOf(article).split(/\s+/).filter(Boolean).length;
}

function hasSource(article) {
  return Array.isArray(article.sources) && article.sources.some((source) => source.name && source.title && source.url);
}

function validateImages(article, { minInlineImages = 3 } = {}) {
  const errors = [];
  const warnings = [];
  const bodyImages = Array.isArray(article.bodyImages) ? article.bodyImages : [];
  const seenUrls = new Set();

  if (!article.coverImage) errors.push("Missing cover image.");
  if (bodyImages.length < minInlineImages) errors.push(`Article requires at least ${minInlineImages} inline body images.`);

  bodyImages.forEach((image, index) => {
    const label = `Inline image ${index + 1}`;
    if (!image.imageUrl) errors.push(`${label} is missing a real image URL. AI prompt-only placeholders cannot be auto-published.`);
    if (image.imageUrl && seenUrls.has(image.imageUrl)) errors.push(`${label} duplicates another image URL.`);
    if (image.imageUrl) seenUrls.add(image.imageUrl);
    if (!image.imageAlt) errors.push(`${label} is missing imageAlt.`);
    if (!image.imageCaption) errors.push(`${label} is missing imageCaption.`);
    if (image.imageAlt && String(image.imageAlt).length < 70) warnings.push(`${label} alt text is short; prefer descriptive 80-125 character alt text.`);
    if (!image.imageTitle) warnings.push(`${label} is missing imageTitle.`);
    if (!image.imageSeoFileName) warnings.push(`${label} is missing imageSeoFileName.`);
    if (!image.imageSourceName && !image.imageAttributionText) errors.push(`${label} is missing source attribution.`);
    if (!image.relatedSection) warnings.push(`${label} is not linked to a specific article section.`);

    const promptText = `${image.aiPrompt || ""} ${image.visualStyle || ""}`.toLowerCase();
    if (image.sourceStrategy === "ai-photorealistic-prompt") {
      if (!promptText.includes("photorealistic") || !promptText.includes("real machinery")) {
        errors.push(`${label} AI prompt does not clearly require photorealistic real machinery.`);
      }
      if (/illustration|vector|cartoon|infographic|abstract/.test(promptText) && !/no illustration|no vector|no cartoon|no infographic|no abstract/.test(promptText)) {
        errors.push(`${label} AI prompt may allow illustration style.`);
      }
    }
  });

  return { errors, warnings };
}

function hasSection(article, pattern) {
  return (article.sections || []).some((section) => pattern.test(section.heading || ""));
}

function hasFaqs(article) {
  return Array.isArray(article.faqs) && article.faqs.length >= 3;
}

export function validateGeneratedArticle(article, { minimumWords = 800, allowDraft = true, minInlineImages = 3 } = {}) {
  const errors = [];
  const warnings = [];
  const text = textOf(article);
  const lower = text.toLowerCase();
  const imageQuality = validateImages(article, { minInlineImages });

  if (!article.title) errors.push("Missing article title.");
  if (!article.seoTitle) errors.push("Missing SEO title.");
  if (!article.seoDescription) errors.push("Missing SEO description.");
  if (!article.slug) errors.push("Missing URL slug.");
  if (!article.coverAlt) errors.push("Missing cover image alt text.");
  if (!article.imageCaption) errors.push("Missing image caption/source note.");
  if (!hasSource(article)) errors.push("Missing Sources / References.");
  if (!Array.isArray(article.sections) || article.sections.length < 9) errors.push("Article requires at least 9 structured sections.");
  if (wordCount(article) < minimumWords) errors.push(`Article is shorter than ${minimumWords} words.`);
  if (/\b(undefined|null|nan)\b/i.test(text)) errors.push("Article contains unfinished placeholder values.");
  if (!hasFaqs(article)) errors.push("Article requires at least 3 FAQ items.");
  if (!hasSection(article, /news background/i)) errors.push("Missing News Background section.");
  if (!hasSection(article, /why it matters/i)) errors.push("Missing Why It Matters section.");
  if (!hasSection(article, /industry perspective/i)) errors.push("Missing Industry Perspective section.");
  if (!hasSection(article, /brand\/product connection|brand product connection/i)) errors.push("Missing Brand/Product Connection section.");
  if (!hasSection(article, /practical implications/i)) errors.push("Missing Practical Implications for Buyers section.");
  if (!hasSection(article, /about cowinmagnet/i)) errors.push("Missing About Cowinmagnet section.");
  if (!hasSection(article, /call to action/i)) errors.push("Missing Call to Action section.");
  if (!/cowinmagnet/i.test(text) || !/quzhou qiying import/i.test(text)) warnings.push("Cowinmagnet company identity is weak or missing.");
  if (!/request-quote|send your|inquiry|contact/i.test(text)) warnings.push("Inquiry entry is weak or missing.");
  if (!/magnetic separation|magnetic separator|tramp iron|overband|electromagnetic/i.test(text)) {
    warnings.push("Magnetic separation relevance is weak.");
  }
  if (/world'?s best|no\.?\s*1|leading global manufacturer|guaranteed to solve/i.test(text)) {
    errors.push("Unverifiable marketing claim detected.");
  }

  for (const claim of newsSystemConfig.brand.forbiddenClaims || []) {
    if (lower.includes(claim.toLowerCase())) errors.push(`Forbidden positioning claim detected: ${claim}`);
  }

  errors.push(...imageQuality.errors);
  warnings.push(...imageQuality.warnings);

  return {
    passed: errors.length === 0,
    publishable: errors.length === 0,
    draftable: allowDraft || errors.length === 0,
    errors,
    warnings,
    wordCount: wordCount(article)
  };
}
