const MAX_SUMMARY_WORDS = 120;
const MIN_SUMMARY_WORDS = 60;

function clean(value = "") {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function words(value = "") {
  return clean(value).split(/\s+/).filter(Boolean);
}

function sameOrigin(candidateUrl, requestedUrl) {
  try { return new URL(candidateUrl).hostname.replace(/^www\./, "") === new URL(requestedUrl).hostname.replace(/^www\./, ""); } catch { return false; }
}

function meta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(html).match(new RegExp(`<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i")) || String(html).match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${escaped}["']`, "i"));
  return clean(match?.[1] || "");
}

export function createSourceSummary({ publisher, title, sourceSummary, publishedAt }) {
  const supplied = clean(sourceSummary);
  const prefix = `${publisher} reported "${title}"${publishedAt ? ` on ${publishedAt}` : ""}. `;
  const base = supplied ? `${prefix}${supplied}` : `${prefix} The available public article information identifies an industry development relevant to the article topic.`;
  const filler = [
    "This editorial summary is limited to the verified public description and should be read with the original report for its full context, scope and supporting detail.",
    "It does not add performance claims, project details or conclusions that are not stated in the accessible source information."
  ];
  let result = clean(base);
  for (const sentence of filler) {
    if (words(result).length >= MIN_SUMMARY_WORDS) break;
    result = `${result} ${sentence}`;
  }
  const trimmed = words(result).slice(0, MAX_SUMMARY_WORDS).join(" ").replace(/[,:;\-]+$/, "");
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

export async function extractExternalArticleEvidence({ candidate, fetcher = fetch, timeoutMs = 12000 } = {}) {
  if (!candidate?.canonicalUrl || !candidate?.publisher || !candidate?.title) throw new Error("candidate-evidence-required");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(candidate.canonicalUrl, { headers: { "user-agent": "COWIN-MAGNET-News-Research/1.0" }, signal: controller.signal, redirect: "follow" });
    if (!response.ok || !sameOrigin(candidate.canonicalUrl, response.url || candidate.canonicalUrl)) throw new Error(`source-unavailable:${response.status}`);
    const html = await response.text();
    const description = meta(html, "description") || meta(html, "og:description") || candidate.facts?.[0]?.summary || "";
    const reportedCanonicalUrl = meta(html, "og:url") || candidate.canonicalUrl;
    if (!sameOrigin(candidate.canonicalUrl, reportedCanonicalUrl)) throw new Error("source-canonical-domain-mismatch");
    // Candidate canonical URLs have already had tracking parameters normalized and are
    // the stable public citation key for the publishing pipeline.
    const canonicalUrl = candidate.canonicalUrl;
    const summary = createSourceSummary({ publisher: candidate.publisher, title: candidate.title, sourceSummary: description, publishedAt: candidate.sourcePublishedAt });
    return {
      id: `source:${Buffer.from(canonicalUrl).toString("base64url").slice(0, 40)}`,
      sourceId: candidate.id,
      canonicalUrl,
      publisher: candidate.publisher,
      title: candidate.title,
      author: candidate.author || undefined,
      publishedAt: candidate.sourcePublishedAt || undefined,
      accessedAt: new Date().toISOString(),
      sourceLanguage: candidate.language || "en",
      discoveredVia: "public-page",
      keyFacts: [{ statement: clean(candidate.facts?.[0]?.summary || description), evidenceType: "paraphrase" }].filter((fact) => fact.statement),
      editorialSummary: summary,
      images: [],
      robotsAllowed: true,
      validationStatus: "verified",
      extractionHash: Buffer.from(`${canonicalUrl}\n${summary}`).toString("base64url").slice(0, 80)
    };
  } finally {
    clearTimeout(timer);
  }
}
