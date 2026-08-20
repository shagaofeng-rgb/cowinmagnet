function decodeHtml(value = "") {
  return String(value)
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function walkJsonLd(value, visitor) {
  if (Array.isArray(value)) return value.forEach((entry) => walkJsonLd(entry, visitor));
  if (!value || typeof value !== "object") return;
  visitor(value);
  Object.values(value).forEach((entry) => walkJsonLd(entry, visitor));
}

// Public article discovery is deliberately limited to structured metadata. It never
// falls back to unstructured page copy, which keeps source discovery predictable.
export function parsePublicNewsPageItems(html, sourceUrl) {
  const items = [];
  const scripts = String(html || "").match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const script of scripts) {
    const jsonText = script.replace(/^.*?>/s, "").replace(/<\/script>$/i, "").trim();
    try {
      walkJsonLd(JSON.parse(jsonText), (entry) => {
        const types = Array.isArray(entry["@type"]) ? entry["@type"] : [entry["@type"]];
        if (!types.some((type) => /^(NewsArticle|Article|BlogPosting)$/i.test(String(type)))) return;
        const rawUrl = entry.url || entry.mainEntityOfPage?.["@id"] || entry.mainEntityOfPage;
        const title = entry.headline || entry.name;
        const publishedAt = entry.datePublished;
        if (!rawUrl || !title || !publishedAt) return;
        const resolvedUrl = new URL(rawUrl, sourceUrl).toString();
        items.push({
          title: decodeHtml(title),
          summary: decodeHtml(entry.description || ""),
          sourceUrl: resolvedUrl,
          publishedAt,
          author: typeof entry.author === "object" ? entry.author?.name || "" : entry.author || ""
        });
      });
    } catch {
      // Malformed JSON-LD is ignored rather than replaced with scraped prose.
    }
  }
  return [...new Map(items.map((item) => [item.sourceUrl, item])).values()];
}

export function robotsAllowsPublicDiscovery(text = "") {
  const lines = String(text).replace(/\r/g, "").split("\n");
  let applies = false;
  for (const line of lines) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") applies = value === "*" || /cowinmagnet/i.test(value);
    if (applies && key === "disallow" && (value === "/" || value === "/*")) return false;
  }
  return true;
}
