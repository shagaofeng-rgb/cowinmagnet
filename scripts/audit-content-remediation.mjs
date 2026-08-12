import fs from "node:fs/promises";
import path from "node:path";
import { getCmsItems } from "../lib/cmsStore.js";
import { getArticleDocument, validateArticleDocument } from "../lib/articleDocument.js";
import { assessNewsContent } from "../lib/newsContentPolicy.js";

const stage = process.argv.includes("--after") ? "after" : "before";
const outDir = path.join(process.cwd(), "docs", "content-remediation");
const now = new Date().toISOString();
const csv = (value = "") => `"${String(value ?? "").replaceAll('"', '""')}"`;
const words = (value = "") => String(value).trim().split(/\s+/).filter(Boolean).length;
const countLinks = (value = "") => (String(value).match(/https?:\/\/|\/en\//g) || []).length;
const types = ["news", "blog"];
const records = (await Promise.all(types.map((type) => getCmsItems(type, { includeInactive: true })))).flat().map((post) => ({ ...post, _storeType: post.type || (post.href?.startsWith("/blog") ? "blog" : "news") }));
const rows = records.map((post) => {
  const document = getArticleDocument(post);
  const validation = validateArticleDocument(document, { allowLegacyMetaOverride: true });
  const visible = post._storeType === "news" ? assessNewsContent(post) : { indexable: post.status === "published" && post.seoIndexable !== false };
  const legacyText = `${post.content || ""}\n${JSON.stringify(post.sections || [])}`;
  const defects = [...validation.errors];
  if (/Update Note \d+|AI Citation Ready|CMS Publishing Checklist|sourceClaims|Source and method note/i.test(legacyText)) defects.push("legacy-internal-placeholder");
  if (/^\s*[-*]\s+/m.test(legacyText)) defects.push("legacy-markdown-list");
  if (!document.heroImage?.alt && post.coverImage) defects.push("missing-hero-alt");
  if (document.contentType !== "news" && document.sources.length) defects.push("guide-source-review");
  const action = post.slug === "selection-checklist-rcdd-self-cooling-self-dumping-electromagnetic-iron-remover" ? "structured-rewrite" : defects.length ? "needs-revision-noindex" : "safe-as-is";
  return {
    id: post.id || "", slug: post.slug || "", locale: document.locale, url: `https://www.cowinmagnet.com/${document.locale}/news/${post.slug}`,
    content_type: document.contentType, title: document.title, published_at: document.publishedAt || post.publishedAt || "", modified_at: document.modifiedAt || post.updatedAt || "",
    canonical: document.seo.canonicalPath, robots: visible.indexable ? "index,follow" : "noindex,follow", meta_title: document.seo.metaTitle, meta_description: document.seo.metaDescription,
    og_title: document.seo.ogTitle, og_description: document.seo.ogDescription, h1_count: document.title ? 1 : 0,
    h2_count: document.sections.length + (document.faq.length ? 1 : 0), faq_count: document.faq.length, source_count: document.sources.length,
    word_count: words(JSON.stringify(document.sections)), image_count: Number(Boolean(document.heroImage)) + (JSON.stringify(document.sections).match(/"type":"image"/g) || []).length,
    internal_links: countLinks(JSON.stringify(document.relatedContent)), related_links: document.relatedContent.length, json_ld_types: document.contentType === "news" ? "NewsArticle,BreadcrumbList" : "Article,BreadcrumbList",
    detected_defects: [...new Set(defects)].join(";"), remediation_action: action
  };
});
await fs.mkdir(outDir, { recursive: true });
const headers = Object.keys(rows[0] || { id: "" });
await fs.writeFile(path.join(outDir, `content-audit-${stage}.csv`), `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csv(row[key])).join(",")).join("\n")}\n`);
const summary = `# Content remediation audit (${stage})\n\nGenerated: ${now}\n\n- Records reviewed: ${rows.length}\n- Safe as-is: ${rows.filter((row) => row.remediation_action === "safe-as-is").length}\n- Held for validated rewrite: ${rows.filter((row) => row.remediation_action === "needs-revision-noindex").length}\n- RCDD regression repair: ${rows.some((row) => row.remediation_action === "structured-rewrite") ? "included" : "not found"}\n\nThis audit preserves existing records and URLs. No original media or records are deleted.\n`;
await fs.writeFile(path.join(outDir, `content-audit-${stage}.md`), summary);
console.log(JSON.stringify({ stage, records: rows.length, output: path.join(outDir, `content-audit-${stage}.csv`) }));
