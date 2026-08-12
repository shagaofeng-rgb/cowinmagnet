import { getCmsItems, saveCmsItem } from "./cmsStore.js";
import { getArticleDocument, validateArticleDocument } from "./articleDocument.js";
import { assessNewsContent } from "./newsContentPolicy.js";
import { RCDD_SLUG } from "./contentRemediation.js";

function words(value = "") { return String(value).trim().split(/\s+/).filter(Boolean).length; }

export function auditContentRecord(post, storeType) {
  const document = getArticleDocument(post);
  const validation = validateArticleDocument(document, { allowLegacyMetaOverride: true });
  const raw = `${post.content || ""}\n${JSON.stringify(post.sections || [])}`;
  const defects = [...validation.errors];
  if (/Update Note \d+|AI Citation Ready|CMS Publishing Checklist|sourceClaims|Source and method note|Internal Linking Suggestions/i.test(raw)) defects.push("legacy-internal-placeholder");
  if (/^\s*[-*]\s+/m.test(raw)) defects.push("legacy-markdown-list");
  if (!document.heroImage?.alt && post.coverImage) defects.push("missing-hero-alt");
  if (document.contentType !== "news" && document.sources.length) defects.push("guide-source-relevance-review");
  const visibility = storeType === "news" ? assessNewsContent(post) : { indexable: post.status === "published" && post.seoIndexable !== false };
  const action = post.slug === RCDD_SLUG ? "structured-rewrite" : defects.length ? "needs-revision-noindex" : "safe-as-is";
  return {
    id: post.id || "", storeType, slug: post.slug || "", locale: document.locale, url: `https://www.cowinmagnet.com/${document.locale}/${storeType}/${post.slug}`,
    contentType: document.contentType, title: document.title, publishedAt: document.publishedAt || post.publishedAt || "", modifiedAt: document.modifiedAt || post.updatedAt || "",
    canonical: document.seo.canonicalPath, robots: visibility.indexable ? "index,follow" : "noindex,follow", metaTitle: document.seo.metaTitle, metaDescription: document.seo.metaDescription,
    ogTitle: document.seo.ogTitle, ogDescription: document.seo.ogDescription, h1Count: document.title ? 1 : 0, h2Count: document.sections.length + (document.faq.length ? 1 : 0), faqCount: document.faq.length,
    sourceCount: document.sources.length, wordCount: words(JSON.stringify(document.sections)), imageCount: Number(Boolean(document.heroImage)), jsonLdTypes: document.contentType === "news" ? "NewsArticle,BreadcrumbList" : "Article,BreadcrumbList",
    defects: [...new Set(defects)], action
  };
}

export async function auditPublishedContent({ apply = false } = {}) {
  const [news, blog] = await Promise.all([getCmsItems("news", { includeInactive: true }), getCmsItems("blog", { includeInactive: true })]);
  const rows = [...news.map((item) => ({ post: item, storeType: "news" })), ...blog.map((item) => ({ post: item, storeType: "blog" }))].map(({ post, storeType }) => ({ post, row: auditContentRecord(post, storeType) }));
  const changed = [];
  if (apply) {
    for (const { post, row } of rows) {
      if (row.storeType !== "news" || row.slug === RCDD_SLUG || row.action !== "needs-revision-noindex") continue;
      const document = getArticleDocument(post);
      await saveCmsItem({ ...post, articleDocument: { ...document, status: "needs_revision", modifiedAt: new Date().toISOString() }, seoIndexable: false, editorialStatus: "needs-revision", status: "published" });
      changed.push({ slug: row.slug, action: "needs-revision-noindex", defects: row.defects });
    }
  }
  return { generatedAt: new Date().toISOString(), rows: rows.map(({ row }) => row), changed };
}
