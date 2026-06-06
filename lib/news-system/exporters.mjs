function escapeCsv(value = "") {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function toMarkdown(run) {
  const lines = [
    `# Cowinmagnet Daily News Opportunities - ${run.date}`,
    "",
    `Retrieved: ${run.generatedAt}`,
    `Items: ${run.items.length}`,
    "",
    "Compliance: Summaries and independent analysis only. Manual review is required before publishing.",
    ""
  ];

  run.items.forEach((item, index) => {
    const generated = item.generated || {};
    const title = generated.title || generated.contentTitle || item.title;
    lines.push(`## ${index + 1}. ${title}`);
    lines.push("");
    lines.push(`- Source: ${item.sourceName}`);
    lines.push(`- URL: ${item.url}`);
    lines.push(`- Published: ${item.publishedDate || "Unknown"}`);
    lines.push(`- Score: ${item.scores.final_score}`);
    lines.push(`- Workflow Status: ${item.workflow?.status || generated.workflowStatus || "scored"}`);
    if (item.publishedArticle) {
      lines.push(`- News Status: ${item.publishedArticle.status}`);
      lines.push(`- News URL: ${item.publishedArticle.href}`);
    }
    if (item.quality) {
      lines.push(`- Quality: ${item.quality.passed ? "passed" : "failed"} (${item.quality.wordCount} words)`);
      if (item.quality.errors?.length) lines.push(`- Quality Errors: ${item.quality.errors.join("; ")}`);
    }
    if (item.cover?.coverImage) lines.push(`- Cover Image: ${item.cover.coverImage}`);
    const bodyImages = item.generated?.bodyImages || item.publishedArticle?.bodyImages || item.imagePlan?.bodyImages || [];
    if (bodyImages.length) lines.push(`- Inline Body Images: ${bodyImages.length}`);
    lines.push("");
    if (!generated.newsSummary && !generated.sections) {
      lines.push("This item was fetched and scored only. No article was generated in this run.");
      lines.push("");
      return;
    }
    lines.push("### News Summary");
    lines.push(generated.newsSummary || generated.excerpt || "");
    lines.push("");
    lines.push("### Industry Pain Point Analysis");
    lines.push(generated.industryPainPointAnalysis || generated.sections?.find((section) => /why|impact/i.test(section.heading))?.body || "");
    lines.push("");
    lines.push("### Cowinmagnet Viewpoint");
    lines.push(generated.cowinmagnetViewpoint || generated.sections?.find((section) => /cowinmagnet/i.test(section.heading))?.body || "");
    lines.push("");
    lines.push("### Recommended Product Match");
    lines.push(`Category: ${generated.recommendedProductMatch?.category || item.productMatch?.category || ""}`);
    lines.push(`Products: ${(generated.recommendedProductMatch?.products || generated.relatedProducts || item.productMatch?.recommendedProducts || []).join(", ")}`);
    lines.push("");
    lines.push("### Application Scenario");
    lines.push(generated.applicationScenario || generated.relatedProductRationale || "");
    lines.push("");
    lines.push(`CTA: ${generated.suggestedCta || "Send Requirements"}`);
    lines.push(`SEO Keywords: ${(generated.seoKeywords || []).join(", ")}`);
    if (generated.sources?.length) {
      lines.push("");
      lines.push("### Sources / References");
      generated.sources.forEach((source, sourceIndex) => {
        lines.push(`${sourceIndex + 1}. ${source.name}, "${source.title}", published ${source.date}, accessed ${source.accessedDate}. URL: ${source.url}`);
      });
    }
    if (bodyImages.length) {
      lines.push("");
      lines.push("### Inline Images");
      bodyImages.forEach((image, imageIndex) => {
        lines.push(`${imageIndex + 1}. ${image.imageUrl || image.imageSeoFileName} - ${image.relatedSection || "Article body"} - ${image.imageAttributionText || image.imageSourceName || ""}`);
      });
    }
    lines.push("");
  });

  return lines.join("\n");
}

export function toCsv(run) {
  const rows = [["date", "title", "source", "url", "score", "status", "product_category", "cta", "keywords"]];
  run.items.forEach((item) => {
    const generated = item.generated || {};
    rows.push([
      run.date,
      generated.title || generated.contentTitle || item.title,
      item.sourceName,
      item.url,
      item.scores.final_score,
      item.workflow?.status || generated.workflowStatus || "scored",
      generated.recommendedProductMatch?.category || item.productMatch?.category || "",
      generated.suggestedCta || "Send Requirements",
      (generated.seoKeywords || []).join("; ")
    ]);
  });
  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export function toHtml(run) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Cowinmagnet News Opportunities ${run.date}</title></head><body>${toMarkdown(run)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")}</body></html>`;
}
