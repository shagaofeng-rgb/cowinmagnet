const internalEditorialMarkers = [
  /AI Citation Ready Summary/i,
  /Mid-Article CTA/i,
  /^\s*Button:\s*.+$/im,
  /^\s*##\s*CTA\s*$/im
];

const malformedSlugPatterns = [
  /(?:efficient|leading|durable|heavy-duty)(?:wet|overband|mining)-/i,
  /south-americ$/i,
  /(?:in-afri|in-sout|in-a)$/i
];

const privateSectionHeadings = new Set([
  "ai citation ready summary",
  "internal linking suggestions",
  "json-ld schema",
  "cms publishing checklist",
  "mid-article cta",
  "cta"
]);

export function assessBlogContent(post = {}) {
  const status = String(post.status || "published").toLowerCase();
  if (["draft", "offline", "archived", "private", "deleted"].includes(status)) {
    return { indexable: false, reason: `status-${status}` };
  }

  if (post.seoIndexable === false || post.noindex === true || post.robots === "noindex") {
    return { indexable: false, reason: "explicit-noindex" };
  }

  const content = `${String(post.content || "")}\n${JSON.stringify(post.articleDocument || {})}`;
  if (internalEditorialMarkers.some((pattern) => pattern.test(content))) {
    return { indexable: false, reason: "legacy-editorial-artifact" };
  }

  const slug = String(post.slug || "");
  if (malformedSlugPatterns.some((pattern) => pattern.test(slug))) {
    return { indexable: false, reason: "malformed-legacy-slug" };
  }

  return { indexable: true, reason: "indexable" };
}

export function isIndexableBlog(post = {}) {
  return assessBlogContent(post).indexable;
}

export function stripLegacyEditorialSections(content = "") {
  const output = [];
  let skip = false;

  for (const rawLine of String(content).split(/\r?\n/)) {
    const heading = rawLine.match(/^##\s+(.+?)\s*$/)?.[1]?.trim().toLowerCase();
    if (heading) {
      skip = privateSectionHeadings.has(heading);
      if (skip) continue;
    }
    if (skip || /^\s*Button:\s*/i.test(rawLine)) continue;
    output.push(rawLine);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}
