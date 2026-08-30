import { includesNormalizedNewsTerm, normalizeNewsText } from "./newsOperationsRules.js";

export function classifyNewsFamily(text, sourceDomain = "", relevanceTerms = []) {
  const haystack = normalizeNewsText(text);
  const matchedTerms = relevanceTerms.filter((term) => includesNormalizedNewsTerm(haystack, term));
  if (!matchedTerms.length) return null;
  return { id: matchedTerms.slice(0, 2).map((term) => normalizeNewsText(term).replaceAll(" ", "-")).join("-") || "industry-news", keywords: matchedTerms };
}
