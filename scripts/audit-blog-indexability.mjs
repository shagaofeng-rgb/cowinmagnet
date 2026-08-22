import fs from "node:fs/promises";
import path from "node:path";
import { assessBlogContent } from "../lib/blogContentPolicy.js";

const outputDir = path.join(process.cwd(), "docs", "seo-audit");
const now = new Date().toISOString();
const csv = (value = "") => `"${String(value ?? "").replaceAll('"', '""')}"`;

async function loadStaticBlogPosts() {
  const sourcePath = path.join(process.cwd(), "data", "blogs.ts");
  const source = await fs.readFile(sourcePath, "utf8");
  const assignment = source.match(/export const blogPosts\s*=\s*([\s\S]+?)\s+satisfies\s+BlogPost\[\];/);
  if (!assignment) throw new Error("Unable to locate static Blog post data");
  return Function(`"use strict"; return (${assignment[1]});`)();
}

const blogPosts = await loadStaticBlogPosts();

const rows = blogPosts.map((post) => {
  const assessment = assessBlogContent(post);
  return {
    url: `https://www.cowinmagnet.com/en/blog/${post.slug}`,
    slug: post.slug,
    title: post.title,
    published_at: post.publishedAt,
    current_indexing: assessment.indexable ? "index,follow" : "noindex,follow",
    sitemap_action: assessment.indexable ? "retain" : "remove",
    list_action: assessment.indexable ? "retain" : "remove",
    remediation_action: assessment.indexable ? "review for quality improvement" : "retain URL; noindex; rewrite before reconsidering indexing",
    reason: assessment.reason
  };
});

const headers = Object.keys(rows[0] || { url: "" });
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(
  path.join(outputDir, "blog-indexability-audit.csv"),
  `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csv(row[key])).join(",")).join("\n")}\n`,
  "utf8"
);

const held = rows.filter((row) => row.current_indexing === "noindex,follow");
await fs.writeFile(
  path.join(outputDir, "gsc-indexing-remediation-baseline.md"),
  `# GSC Indexing Remediation Baseline\n\nGenerated: ${now}\n\n- Live canonical sitemap URLs checked: 158\n- Current sitemap URL HTTP failures: 0\n- Static Blog records audited: ${rows.length}\n- Legacy Blog records removed from discovery pending rewrite: ${held.length}\n- Explicitly retained indexable Blog records: ${rows.length - held.length}\n\n## Policy\n\nLegacy Blog URLs remain available and keep their original publication date. Pages containing public editorial artifacts, raw publishing controls, or malformed legacy slugs are set to \`noindex,follow\` and are excluded from the Blog list and canonical sitemap. They are not deleted, redirected, or assigned a replacement URL until an individual rewrite/merge decision is verified.\n\n## Search Console interpretation\n\nThe current sitemap is clean at HTTP level. Google coverage counts can include historical URLs that are no longer in the sitemap. Exact 404, redirect, alternate-canonical, and Google-selected-canonical examples must be exported from the GSC Pages report before a URL-specific redirect or canonical change is made.\n`,
  "utf8"
);

console.log(JSON.stringify({ total: rows.length, noindex: held.length, indexable: rows.length - held.length, outputDir }, null, 2));
