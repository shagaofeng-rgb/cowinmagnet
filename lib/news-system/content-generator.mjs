import { newsSystemConfig } from "../../config/news-system.config.mjs";

export function buildContentPrompt({ item, scores, productMatch }) {
  return `
You are writing for Cowinmagnet, a magnetic separation equipment sourcing and export service partner.

Strict positioning:
- Do not claim Cowinmagnet owns a factory, is a source manufacturer, factory direct supplier, or participated in the news event.
- Use careful wording: may help, can support, is often used to, could reduce, should be evaluated.
- Do not copy the original article. Summarize and add independent industrial analysis.

Original news:
Title: ${item.title}
Source: ${item.sourceName}
URL: ${item.url}
Published: ${item.publishedDate || "Unknown"}
Description: ${item.description || ""}

Scores:
${JSON.stringify(scores, null, 2)}

Product match:
${JSON.stringify(productMatch, null, 2)}

Return JSON with:
contentTitle, originalReference, newsSummary, industryPainPointAnalysis, cowinmagnetViewpoint,
recommendedProductMatch, applicationScenario, suggestedCta, seoKeywords, complianceNote.
`;
}

function keywordList(item, productMatch) {
  const base = [
    "magnetic separator",
    "overband magnetic separator",
    "tramp iron removal",
    "conveyor belt protection",
    "magnetic separation equipment"
  ];

  if (productMatch.category.includes("Electromagnetic")) base.push("electromagnetic separator", "heavy-duty conveyor protection");
  if (productMatch.category.includes("Components")) base.push("magnetic bar", "magnetic filter", "metal contamination control");
  if ((item.description || "").toLowerCase().includes("recycling")) base.push("recycling plant metal separation");

  return [...new Set(base)].slice(0, 10);
}

function deterministicDraft({ item, scores, productMatch, imagePlan }) {
  const reference = {
    title: item.title,
    source: item.sourceName,
    url: item.url,
    publishedDate: item.publishedDate || "Unknown",
    author: item.author || "Not listed",
    retrievedDate: item.retrievedDate,
    copyrightNote: "Short summary and independent analysis only. Do not republish the full source article."
  };

  return {
    contentTitle: `${item.title}: What Bulk Material Operators Should Review in Magnetic Separation`,
    originalReference: reference,
    newsSummary:
      `${item.description || item.title} This item is treated as an industry signal rather than copied news content. For B2B buyers, the useful angle is whether the event points to recurring problems in material handling, such as metal contamination, conveyor damage, sorting efficiency, product purity or maintenance risk.`,
    industryPainPointAnalysis:
      "Many mining, recycling, cement, coal and aggregate lines move mixed or abrasive materials through crushers, screens and conveyors. When ferrous metal enters the flow, it can damage downstream equipment, interrupt production and create extra manual sorting work. The practical purchasing question is not only magnetic strength, but also belt width, burden depth, installation height, cleaning method, duty cycle and maintenance access.",
    cowinmagnetViewpoint:
      `${newsSystemConfig.brand.name} positions this topic as a product selection and export service question. A properly specified magnetic separator may help capture tramp iron before critical equipment, can support more stable material flow and is often used to reduce manual cleaning pressure. Final model selection should be confirmed from customer drawings, belt speed, material layer depth, particle size and site installation limits.`,
    recommendedProductMatch: {
      category: productMatch.category,
      products: productMatch.recommendedProducts,
      rationale: productMatch.rationale
    },
    applicationScenario:
      "Relevant scenarios include conveyor transfer points, crusher feed belts, recycling sorting lines, cement raw material handling, coal handling systems, quarry aggregate processing and bulk terminal loading lines.",
    suggestedCta: "Send Your Conveyor Details for a Magnetic Separator Recommendation",
    seoKeywords: keywordList(item, productMatch),
    suggestedImages: imagePlan.suggestedImages,
    complianceNote:
      "Manual review required before publishing. Confirm source accuracy, image license, product claims, and that no wording implies Cowinmagnet participated in the reported event.",
    scores,
    workflowStatus: newsSystemConfig.workflow.defaultStatus
  };
}

export async function generateCowinmagnetContent(input) {
  if (!process.env.OPENAI_API_KEY) {
    return deterministicDraft(input);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_NEWS_MODEL || "gpt-4.1-mini",
        input: buildContentPrompt(input),
        text: { format: { type: "json_object" } }
      })
    });

    if (!response.ok) return deterministicDraft(input);
    const data = await response.json();
    const text = data.output_text || data.output?.flatMap((part) => part.content || []).map((part) => part.text).join("");
    return { ...deterministicDraft(input), ...JSON.parse(text || "{}") };
  } catch {
    return deterministicDraft(input);
  }
}
