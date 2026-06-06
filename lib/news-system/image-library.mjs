import fs from "node:fs/promises";
import path from "node:path";
import { newsSystemConfig } from "../../config/news-system.config.mjs";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const EXCLUDED_TERMS = ["logo", "qr-", "whatsapp", "icon", "gsc-api", "news-cover-preview"];

const topicRules = [
  {
    topic: "recycling",
    terms: ["recycling", "waste", "scrap", "metal recovery", "battery", "e-waste", "sorting", "mrf"],
    imageTerms: ["recycling", "waste", "scrap", "e-waste", "sorting", "recovery", "magnetic-separator-recycling"]
  },
  {
    topic: "mining",
    terms: ["mining", "mine", "ore", "mineral", "rare earth", "critical minerals", "lithium", "coal", "beneficiation", "tailings"],
    imageTerms: ["mining", "ore", "coal", "magnetite", "hematite", "feldspar", "quartz", "nickel", "chrome", "manganese", "conveyor"]
  },
  {
    topic: "cement-aggregate",
    terms: ["aggregate", "cement", "quarry", "crusher", "limestone", "slag"],
    imageTerms: ["cement", "aggregate", "crusher", "limestone", "slag", "conveyor"]
  },
  {
    topic: "food-powder",
    terms: ["food", "powder", "granule", "filter", "magnetic bar", "magnetic rod", "magnetic grid", "liquid"],
    imageTerms: ["food", "powder", "magnetic-bar", "magnetic-grid", "filter", "beans", "spices", "coffee"]
  },
  {
    topic: "product-equipment",
    terms: ["magnetic separator", "overband", "suspended", "electromagnetic", "permanent", "self-cleaning", "magnetic roller"],
    imageTerms: ["suspended", "magnetic-separator", "electromagnetic", "permanent", "automatic-cleaning", "roller", "overband"]
  }
];

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value = "") {
  return normalize(value).replace(/\s+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(normalize(term)));
}

function imageVariantKey(imageUrl = "") {
  return imageUrl
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")
    .replace(/-(480|768|1024|1200|1440|1600|800)$/i, "")
    .replace(/\/assets\//, "/images/")
    .replace(/\/source-products\//, "/products/");
}

function scoreMatches(text, terms, weight) {
  return terms.reduce((score, term) => score + (text.includes(normalize(term)) ? weight : 0), 0);
}

async function walkImages(dir, basePublicDir, results = []) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkImages(fullPath, basePublicDir, results);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const relative = `/${path.relative(basePublicDir, fullPath).replace(/\\/g, "/")}`;
    const text = normalize(relative);
    if (EXCLUDED_TERMS.some((term) => text.includes(normalize(term)))) continue;
    if (text.includes("generated/news")) continue;

    const stat = await fs.stat(fullPath).catch(() => ({ size: 0 }));
    results.push({
      imageUrl: relative,
      absolutePath: fullPath,
      fileName: entry.name,
      text,
      size: stat.size,
      source: "company-library"
    });
  }

  return results;
}

export function detectArticleImageTopic({ item, article, productMatch }) {
  const sourceText = normalize([item?.title, item?.description, article?.canonicalSourceUrl].filter(Boolean).join(" "));
  const sourceTitleText = normalize([item?.title, article?.title, article?.canonicalSourceUrl].filter(Boolean).join(" "));
  if (includesAny(sourceTitleText, ["rare earth", "critical minerals", "lithium extraction", "ore", "mineral processing", "mining", "coal"])) {
    return topicRules.find((rule) => rule.topic === "mining");
  }
  if (includesAny(sourceText, ["recycling", "waste sorting", "waste recycling", "scrap", "battery recycling", "e-waste", "metal recovery"])) {
    return topicRules.find((rule) => rule.topic === "recycling");
  }
  if (includesAny(sourceText, ["mining", "mine", "ore", "mineral", "rare earth", "critical minerals", "lithium", "coal", "beneficiation", "tailings"])) {
    return topicRules.find((rule) => rule.topic === "mining");
  }
  if (includesAny(sourceText, ["cement", "aggregate", "quarry", "crusher", "limestone"])) {
    return topicRules.find((rule) => rule.topic === "cement-aggregate");
  }

  const text = normalize([
    item?.title,
    item?.description,
    article?.title,
    article?.excerpt,
    article?.seoKeywords?.join(" "),
    productMatch?.category,
    productMatch?.recommendedProducts?.join(" "),
    ...(article?.sections || []).map((section) => `${section.heading} ${section.body}`)
  ].filter(Boolean).join(" "));

  const ranked = topicRules
    .map((rule) => ({
      ...rule,
      score: scoreMatches(text, rule.terms, 10) + scoreMatches(text, rule.imageTerms, 5)
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.score > 0 ? ranked[0] : topicRules.find((rule) => rule.topic === "product-equipment");
}

export async function getCompanyImageLibrary() {
  const publicDir = path.join(process.cwd(), "public");
  const roots = ["images/applications", "images/industries", "images/source-products", "assets/products"]
    .map((dir) => path.join(publicDir, dir));
  const all = [];

  for (const dir of roots) {
    await walkImages(dir, publicDir, all);
  }

  return all;
}

function imageKind(candidate) {
  const text = candidate.text;
  if (text.includes("source-products") || text.includes("assets products")) return "product-photo";
  if (text.includes("scenario") || text.includes("applications")) return "application-scene";
  if (text.includes("industry")) return "industry-scene";
  return "company-library-photo";
}

function captionForImage({ candidate, topic, section, sourceName = newsSystemConfig.brand.name }) {
  const readableTopic = topic.topic.replace(/-/g, " ");
  const sectionText = section?.heading ? ` for the ${section.heading.toLowerCase()} section` : "";
  const productPhrase = /recycling/i.test(readableTopic)
    ? "magnetic separation equipment supporting ferrous metal recovery in a recycling line"
    : /mining/i.test(readableTopic)
      ? "magnetic separation equipment used around mining conveyors and mineral processing"
      : /cement|aggregate/i.test(readableTopic)
        ? "magnetic separation equipment for aggregate, cement and bulk material conveyors"
        : /food|powder/i.test(readableTopic)
          ? "magnetic bars or magnetic filters used for metal contamination control"
          : "industrial magnetic separator equipment used in bulk material handling";

  return {
    imageAlt: `${productPhrase} related to ${section?.heading || "Cowinmagnet industry news analysis"}.`,
    imageTitle: `${readableTopic} magnetic separation industry photo - ${section?.heading || "Cowinmagnet news"}`,
    imageCaption: `This company-library image is matched to ${readableTopic}${sectionText}, helping connect the news topic with real industrial magnetic separation applications.`,
    imageSourceName: sourceName,
    imageSourceUrl: newsSystemConfig.siteUrl,
    imageAttributionText: `Image source: ${sourceName} company image library.`,
    imageSeoFileName: `${slugify(`${readableTopic}-${section?.heading || imageKind(candidate)}`)}${path.extname(candidate.fileName).toLowerCase()}`
  };
}

export function rankCompanyImages({ library, topic, article, productMatch }) {
  const articleText = normalize([
    article?.title,
    article?.excerpt,
    article?.seoKeywords?.join(" "),
    productMatch?.category,
    productMatch?.recommendedProducts?.join(" ")
  ].filter(Boolean).join(" "));

  return library
    .map((candidate) => {
      let score = 0;
      score += scoreMatches(candidate.text, topic.imageTerms, 22);
      score += scoreMatches(candidate.text, topic.terms, 12);
      score += scoreMatches(candidate.text, articleText.split(" ").filter((term) => term.length > 4).slice(0, 40), 2);
      if (candidate.text.includes("source-products")) score += 12;
      if (candidate.text.includes("applications")) score += 10;
      if (candidate.text.includes("industries")) score += 8;
      if (candidate.size > 80_000) score += 6;
      if (candidate.size > 250_000) score += 4;
      if (candidate.text.includes("air-compressor") || candidate.text.includes("lighthouse")) score -= 60;
      return { ...candidate, score, imageKind: imageKind(candidate) };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score);
}

export async function matchCompanyImages({ item, article, productMatch, minInlineImages = 3, maxInlineImages = 5 }) {
  const topic = detectArticleImageTopic({ item, article, productMatch });
  const library = await getCompanyImageLibrary();
  const ranked = rankCompanyImages({ library, topic, article, productMatch });
  const genericFallback = library
    .filter((candidate) => !ranked.some((rankedCandidate) => rankedCandidate.imageUrl === candidate.imageUrl))
    .filter((candidate) => !candidate.text.includes("air-compressor") && !candidate.text.includes("lighthouse"))
    .filter((candidate) => includesAny(candidate.text, ["magnetic", "recycling", "mining", "separator", "conveyor", "industrial"]))
    .map((candidate) => ({ ...candidate, score: 1, imageKind: imageKind(candidate) }));
  const available = [...ranked, ...genericFallback];
  const selected = [];
  const seen = new Set();
  const seenVariants = new Set();

  for (const candidate of available) {
    if (seen.has(candidate.imageUrl)) continue;
    const variantKey = imageVariantKey(candidate.imageUrl);
    if (seenVariants.has(variantKey)) continue;
    selected.push(candidate);
    seen.add(candidate.imageUrl);
    seenVariants.add(variantKey);
    if (selected.length >= maxInlineImages + 1) break;
  }

  const coverCandidate = selected[0] || available[0] || null;
  const sections = article?.sections || [];
  const targetSections = [
    sections.find((section) => /introduction/i.test(section.heading)),
    sections.find((section) => /news background|why it matters/i.test(section.heading)),
    sections.find((section) => /brand\/product|brand product|cowinmagnet/i.test(section.heading)),
    sections.find((section) => /industry perspective|related|solution/i.test(section.heading)),
    sections.find((section) => /practical|conclusion/i.test(section.heading))
  ].filter(Boolean);

  const inlineCandidates = selected.filter((candidate) => candidate.imageUrl !== coverCandidate?.imageUrl);
  const inlineImages = inlineCandidates.slice(0, Math.max(minInlineImages, Math.min(maxInlineImages, inlineCandidates.length))).map((candidate, index) => {
    const section = targetSections[index] || targetSections[targetSections.length - 1] || sections[index] || null;
    return {
      imageUrl: candidate.imageUrl,
      imageType: "inline",
      displayOrder: index + 1,
      relatedSection: section?.heading || "",
      sourceStrategy: "company-library",
      visualStyle: "real industrial photo",
      ...captionForImage({ candidate, topic, section })
    };
  });

  const cover = coverCandidate
    ? {
        imageUrl: coverCandidate.imageUrl,
        imageType: "cover",
        displayOrder: 0,
        relatedSection: "Cover",
        sourceStrategy: "company-library",
        visualStyle: "real industrial photo",
        ...captionForImage({ candidate: coverCandidate, topic, section: { heading: "cover" } })
      }
    : null;

  return { topic: topic.topic, cover, inlineImages, rankedCount: ranked.length };
}
