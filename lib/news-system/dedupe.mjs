import crypto from "node:crypto";

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sha256(value = "") {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export function normalizeUrl(value = "") {
  try {
    const url = new URL(value);
    url.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach((key) =>
      url.searchParams.delete(key)
    );
    return url.toString().replace(/\/$/, "");
  } catch {
    return String(value || "").trim();
  }
}

export function textTokens(value = "") {
  const stopwords = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "that",
    "this",
    "about",
    "into",
    "over",
    "news",
    "update",
    "industry",
    "company",
    "announces",
    "launches"
  ]);

  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopwords.has(token));
}

export function jaccardSimilarity(a = "", b = "") {
  const aTokens = new Set(textTokens(a));
  const bTokens = new Set(textTokens(b));
  if (!aTokens.size || !bTokens.size) return 0;

  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;
  return intersection / union;
}

export function buildNewsFingerprints(item) {
  const canonicalUrl = normalizeUrl(item.canonicalUrl || item.url);
  const titleText = normalizeText(item.title || item.originalTitle || "");
  const semanticText = normalizeText(`${item.title || ""} ${item.description || ""} ${item.summary || ""}`);

  return {
    canonicalUrl,
    sourceUrlHash: sha256(canonicalUrl),
    titleHash: sha256(titleText),
    semanticHash: sha256(textTokens(semanticText).sort().slice(0, 20).join(" ")),
    imageHash: item.imageUrl ? sha256(normalizeUrl(item.imageUrl)) : ""
  };
}

export function isDuplicateNewsItem(item, state, candidates = [], threshold = 0.85) {
  const fingerprints = buildNewsFingerprints(item);
  const titleText = item.title || item.originalTitle || "";
  const semanticText = `${item.title || ""} ${item.description || ""} ${item.summary || ""}`;
  const seen = state?.seenNews || {};

  if (seen.urls?.[fingerprints.sourceUrlHash]) return { duplicate: true, reason: "duplicate-url", fingerprints };
  if (seen.titles?.[fingerprints.titleHash]) return { duplicate: true, reason: "duplicate-title", fingerprints };
  if (seen.semantic?.[fingerprints.semanticHash]) return { duplicate: true, reason: "duplicate-topic-hash", fingerprints };
  if (fingerprints.imageHash && seen.images?.[fingerprints.imageHash]) return { duplicate: true, reason: "duplicate-image", fingerprints };

  const pool = [...(state?.publishedTopics || []), ...candidates.map((candidate) => candidate.title || candidate.generated?.title || "")];
  const similar = pool.find((existing) => jaccardSimilarity(titleText, existing) >= threshold || jaccardSimilarity(semanticText, existing) >= threshold);
  if (similar) return { duplicate: true, reason: "semantic-similarity", fingerprints, similarTo: similar };

  return { duplicate: false, reason: "", fingerprints };
}

export function registerNewsUsage(state, item, article) {
  const next = {
    seenNews: {
      urls: { ...(state?.seenNews?.urls || {}) },
      titles: { ...(state?.seenNews?.titles || {}) },
      semantic: { ...(state?.seenNews?.semantic || {}) },
      images: { ...(state?.seenNews?.images || {}) }
    },
    publishedSlugs: { ...(state?.publishedSlugs || {}) },
    publishedTopics: [...(state?.publishedTopics || [])],
    runs: [...(state?.runs || [])],
    updatedAt: new Date().toISOString()
  };
  const fingerprints = buildNewsFingerprints(item);

  next.seenNews.urls[fingerprints.sourceUrlHash] = item.url;
  next.seenNews.titles[fingerprints.titleHash] = item.title;
  next.seenNews.semantic[fingerprints.semanticHash] = item.title;
  if (fingerprints.imageHash) next.seenNews.images[fingerprints.imageHash] = item.imageUrl;
  if (article?.slug) next.publishedSlugs[article.slug] = article.status || "generated";
  if (article?.title) next.publishedTopics.unshift(article.title);
  next.publishedTopics = [...new Set(next.publishedTopics)].slice(0, 200);

  return next;
}
