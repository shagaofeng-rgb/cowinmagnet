import fs from "node:fs/promises";
import path from "node:path";
import { getCmsItems } from "../lib/cmsStore.js";
import { assessNewsContent } from "../lib/newsContentPolicy.js";

const siteId = "cowinmagnet-production";
const outputDir = path.join(process.cwd(), "docs", "news-automation-audit", siteId);
const markerPattern = /Cowinmagnet reviews|Why It Matters|Industry Perspective|Brand\/Product Connection|Buyer Questions|This article is not a repost/gi;

function csv(value = "") {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const posts = await getCmsItems("news", { includeInactive: true });
const rows = posts.map((post) => {
  const markers = (String(post.content || "").match(markerPattern) || []).length;
  const visibility = assessNewsContent(post);
  const decision = visibility.indexable ? "keep" : "noindex-follow";
  const reason = visibility.reason || (markers >= 2 ? "legacy-template-markers" : "requires-editorial-source-review");
  return {
    site_id: siteId,
    url: `https://www.cowinmagnet.com/en/news/${post.slug}`,
    content_type: "news",
    published_at: post.publishedAt || "",
    title: post.title || "",
    source_url: post.sourceUrl || post.sources?.[0]?.url || "",
    source_date: post.sourcePublishedAt || post.sources?.[0]?.date || "",
    word_count: String(post.content || "").trim().split(/\s+/).filter(Boolean).length,
    duplicate_cluster: "",
    similarity_score: "",
    index_status: visibility.indexable ? "indexable" : "noindex",
    decision,
    reason,
    redirect_target: "",
    rollback_method: "Restore seoIndexable/list visibility from CMS payload or pre-migration backup",
    reviewer: "automation-policy"
  };
});

await fs.mkdir(outputDir, { recursive: true });
const header = Object.keys(rows[0] || { site_id: "" });
await fs.writeFile(path.join(outputDir, "04-existing-content-triage.csv"), `${header.join(",")}\n${rows.map((row) => header.map((key) => csv(row[key])).join(",")).join("\n")}\n`, "utf8");
const summary = [
  "# Existing Content Triage",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Site: ${siteId}`,
  `News records reviewed: ${rows.length}`,
  `Keep/indexable: ${rows.filter((row) => row.decision === "keep").length}`,
  `Noindex-follow: ${rows.filter((row) => row.decision === "noindex-follow").length}`,
  "",
  "This is a reversible policy triage. It does not delete CMS records or change historical URLs. A separate reviewed redirect or removal plan is required before a 301 or 410 action."
].join("\n");
await fs.writeFile(path.join(outputDir, "04-existing-content-triage.md"), `${summary}\n`, "utf8");
console.log(`NEWS_TRIAGE_RECORDS=${rows.length}`);
