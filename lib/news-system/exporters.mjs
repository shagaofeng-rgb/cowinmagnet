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
    lines.push(`## ${index + 1}. ${item.generated.contentTitle}`);
    lines.push("");
    lines.push(`- Source: ${item.sourceName}`);
    lines.push(`- URL: ${item.url}`);
    lines.push(`- Published: ${item.publishedDate || "Unknown"}`);
    lines.push(`- Score: ${item.scores.final_score}`);
    lines.push(`- Workflow Status: ${item.generated.workflowStatus}`);
    lines.push("");
    lines.push("### News Summary");
    lines.push(item.generated.newsSummary);
    lines.push("");
    lines.push("### Industry Pain Point Analysis");
    lines.push(item.generated.industryPainPointAnalysis);
    lines.push("");
    lines.push("### Cowinmagnet Viewpoint");
    lines.push(item.generated.cowinmagnetViewpoint);
    lines.push("");
    lines.push("### Recommended Product Match");
    lines.push(`Category: ${item.generated.recommendedProductMatch.category}`);
    lines.push(`Products: ${item.generated.recommendedProductMatch.products.join(", ")}`);
    lines.push("");
    lines.push("### Application Scenario");
    lines.push(item.generated.applicationScenario);
    lines.push("");
    lines.push(`CTA: ${item.generated.suggestedCta}`);
    lines.push(`SEO Keywords: ${item.generated.seoKeywords.join(", ")}`);
    lines.push("");
  });

  return lines.join("\n");
}

export function toCsv(run) {
  const rows = [["date", "title", "source", "url", "score", "status", "product_category", "cta", "keywords"]];
  run.items.forEach((item) => {
    rows.push([
      run.date,
      item.generated.contentTitle,
      item.sourceName,
      item.url,
      item.scores.final_score,
      item.generated.workflowStatus,
      item.generated.recommendedProductMatch.category,
      item.generated.suggestedCta,
      item.generated.seoKeywords.join("; ")
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
