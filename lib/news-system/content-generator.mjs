import { newsSystemConfig } from "../../config/news-system.config.mjs";

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function buildContentPrompt({ item, scores, productMatch }) {
  return `
You are a senior B2B industrial editor, SEO/GEO specialist, and AI-search content architect writing for Cowinmagnet, a magnetic separation equipment sourcing and export service partner.

Strict positioning:
- Do not claim Cowinmagnet owns production facilities, operates as the original manufacturing owner, sells as a factory-direct owner, or participated in the news event.
- Use careful wording: may help, can support, is often used to, could reduce, should be evaluated.
- Do not copy or translate the original article. Use the source only as factual background.
- Do not invent facts, quotes, customer projects, event participation, performance guarantees, or unverified market data.
- The final article must be an original English industry commentary article, not a repost, press-release rewrite, or simple source summary.

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

Return strict JSON with:
title, seoTitle, seoDescription, slug, excerpt, category, categoryTitle, coverAlt, imageCaption,
sections (array of {heading, body}), sources (array), relatedProducts (array),
relatedProductRationale, seoKeywords, faqs (array of {question, answer}), aboutBrand,
callToAction, geoEntities, imageSuggestions, internalLinkSuggestions, complianceNote.

Required article structure:
- Introduction
- News Background
- Why It Matters
- Industry Perspective
- Brand/Product Connection
- Practical Implications for Buyers
- Related Cowinmagnet Solutions
- FAQ
- About Cowinmagnet
- Call to Action
- Conclusion
- Sources / References

Writing requirements:
- Write in professional English for overseas industrial buyers, EPC contractors, distributors, plant managers, and procurement teams.
- Target length: 800 to 1500 English words.
- Do not use the full source headline as the public H1. Create a concise original industry-commentary headline focused on the trend, buyer issue, product application, or market signal.
- Keep SEO title near 50 to 65 English characters where possible.
- First paragraph must state the topic directly.
- Each heading must have clear semantic meaning for Google, Bing, ChatGPT Search, Gemini, Claude, Perplexity, and other AI search systems.
- Include brand_name, company_name, product_name, industry_keywords, application_scenarios, target_market, customer_problem, product_solution, product_benefits, technical_terms, and contact_or_inquiry_entry naturally.
- Include at least 3 to 5 FAQ items around industry trends, magnetic separator application, purchasing choices, technical parameters, and use scenarios.
- Include image suggestions with image_alt, image_caption, image_title, image_description, image_source, image_license_note, and image_file_name.
- Keep source references as citations for context, but do not reuse large source wording.
- Avoid keyword stuffing, exaggerated claims, "world's best", "No.1", "leading global manufacturer", and similar unverifiable language.
`;
}

export function keywordList(item, productMatch) {
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

function displayDate(value) {
  if (!value) return "Unknown publication date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function seoDescriptionFrom(value = "") {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (text.length <= 158) return text;
  return `${text.slice(0, 155).replace(/\s+\S*$/, "")}...`;
}

function titleFromTopic(item, productMatch) {
  const text = `${item.title || ""} ${item.description || ""} ${productMatch.category || ""}`.toLowerCase();
  if (/rare earth|critical mineral|lithium|mineral processing|ore/.test(text)) {
    return "Rare Earth Processing News Signals Magnetic Separation Demand";
  }
  if (/recycling|waste|scrap|metal recovery|battery/.test(text)) {
    return "Recycling Technology News Highlights Magnetic Separation Demand";
  }
  if (/aggregate|quarry|cement|crusher|limestone/.test(text)) {
    return "Quarry Conveyor News Highlights Tramp Iron Removal Demand";
  }
  if (/food|powder|granule|foreign material|contamination/.test(text)) {
    return "Food Processing News Raises Metal Contamination Control Questions";
  }
  if (/electromagnetic/.test(text)) {
    return "Industrial Conveyor News Points to Electromagnetic Separator Selection";
  }
  return "Industry News Highlights Magnetic Separation Buyer Decisions";
}

export function buildArticleSlug(item, productMatch) {
  const focus =
    productMatch.category.includes("Electromagnetic")
      ? "electromagnetic-separator"
      : productMatch.category.includes("Components")
        ? "magnetic-bars-components"
        : "magnetic-separation";
  const base = slugify(`${focus}-${item.title || "industry-news"}`);
  return base || `magnetic-separation-news-${Date.now()}`;
}

function sourceReference(item) {
  return {
    name: item.sourceName || "Original source",
    date: displayDate(item.publishedDate),
    title: item.title || "Original industry news",
    url: item.url,
    accessedDate: displayDate(item.retrievedDate || new Date().toISOString())
  };
}

function section(heading, body) {
  return { heading, body: String(body).replace(/\s+/g, " ").trim() };
}

function buildFaqs({ productMatch }) {
  const primaryProduct = productMatch.recommendedProducts[0] || "magnetic separation equipment";
  return [
    {
      question: "Why can overseas industry news matter for magnetic separator buyers?",
      answer:
        "Industry news can point to changes in material handling, recycling, mining, processing capacity, safety expectations or supply-chain planning. Buyers can use those signals to review whether their existing tramp iron removal, conveyor protection and material purity controls are still suitable."
    },
    {
      question: `How should buyers connect this trend with ${primaryProduct}?`,
      answer:
        "Buyers should compare the trend with their own site conditions, including material type, belt width, belt speed, burden depth, installation height, iron size, iron frequency, cleaning method and available maintenance space. The product direction should come from those conditions rather than from a model name alone."
    },
    {
      question: "What information should be prepared before requesting a magnetic separator recommendation?",
      answer:
        "Useful information includes the application industry, material name and particle size, handling capacity, conveyor width and speed, material layer height, expected iron contamination, installation photos or drawings, voltage, operating hours and whether manual or self-cleaning discharge is preferred."
    },
    {
      question: "Can one magnetic separator model fit every mining or recycling line?",
      answer:
        "No. A suspended permanent magnet, self-cleaning overband separator, electromagnetic separator, magnetic drum, magnetic pulley, magnetic bar or magnetic grid can each fit different duties. The practical choice depends on material behavior, process layout, separation target and maintenance requirements."
    }
  ];
}

function deterministicDraft({ item, scores, productMatch, imagePlan }) {
  const slug = buildArticleSlug(item, productMatch);
  const source = sourceReference(item);
  const keywords = keywordList(item, productMatch);
  const sourceSummary = item.description || item.title || "A new industry update was published by the cited source.";
  const category = (item.category || "").includes("recycling")
    ? "market-trends"
    : (item.category || "").includes("mining")
      ? "industry-news"
      : "technology-updates";
  const categoryTitle =
    category === "market-trends" ? "Market Trends" : category === "industry-news" ? "Industry News" : "Technology Updates";
  const title = `${titleFromTopic(item, productMatch)}: Cowinmagnet View`;
  const excerpt = seoDescriptionFrom(
    `Cowinmagnet reviews this overseas industry news signal and explains what it may mean for magnetic separation equipment buyers in mining, recycling and bulk material handling.`
  );
  const faqs = buildFaqs({ productMatch });
  const reference = {
    title: item.title,
    source: item.sourceName,
    url: item.url,
    publishedDate: item.publishedDate || "Unknown",
    author: item.author || "Not listed",
    retrievedDate: item.retrievedDate,
    copyrightNote: "Short summary and independent analysis only. Do not republish the full source article."
  };
  const sections = [
    section(
      "Introduction",
      `Industry news from ${source.name} has raised a useful signal for buyers who manage mixed materials, recycling streams, mining conveyors or bulk handling lines. Cowinmagnet treats the source article as factual background, then adds an original equipment-selection viewpoint for magnetic separation, tramp iron removal, conveyor belt protection and material recovery applications. The practical question for overseas buyers is not only what happened in the news, but what the event suggests about material purity, plant reliability, maintenance planning and future purchasing decisions.`
    ),
    section(
      "News Background",
      `According to the cited source, "${item.title}" was published on ${source.date}. The available summary says: ${sourceSummary} This Cowinmagnet article does not republish the original report and does not reuse the source article as a translated text. It uses the title, source link, publication date and short factual summary as a reference point, then reorganizes the topic into an English B2B industry commentary for buyers who evaluate magnetic separation equipment, bulk material handling lines and export procurement options.`
    ),
    section(
      "Why It Matters",
      "For industrial buyers, news is useful only when it points to a practical operating question. In mining, quarrying, recycling, cement, coal handling, port terminals and food-processing lines, unwanted ferrous metal can damage crushers, shredders, screens, conveyor belts and downstream sorting equipment. Even when the source news is about a broader market, policy, technology or investment trend, the same plant-level question often appears: how can an operator keep material flow stable while reducing contamination, downtime, manual sorting pressure and equipment risk? This is where magnetic separator selection becomes part of a wider reliability discussion."
    ),
    section(
      "Industry Perspective",
      "From an industry perspective, material handling systems are becoming more demanding because plants want higher throughput, cleaner output, lower downtime and more predictable maintenance. Magnetic separation equipment is not a single universal product. A suspended permanent magnet may fit many conveyor-protection duties. A self-cleaning overband separator is often considered when captured iron appears frequently and manual cleaning would interrupt production. Electromagnetic separators may be reviewed for deeper material burden, heavy-duty mining lines or adjustable magnetic force. Magnetic bars, grids, drums, pulleys and filters may be more relevant when fine powders, granules or liquid materials need cleaner processing."
    ),
    section(
      "Brand/Product Connection",
      `${newsSystemConfig.brand.name}, operated by ${newsSystemConfig.brand.company}, reads this news as a reminder that product selection should begin with site conditions rather than only model names. Cowinmagnet focuses on magnetic separation equipment sourcing and export service support for applications such as mining conveyors, recycling sorting lines, cement and aggregate processing, coal handling, bulk terminals and powder or granule metal contamination control. Possible product directions include ${productMatch.recommendedProducts.join(", ")}. These products may help capture tramp iron, protect downstream equipment, support cleaner material flow and reduce manual cleaning pressure, but the final configuration should be checked against drawings, working conditions and maintenance access.`
    ),
    section(
      "Practical Implications for Buyers",
      "Before sending an inquiry, overseas buyers can prepare a short technical brief: the material handled, required capacity, current process layout, photos around the conveyor or chute, available installation space, expected cleaning method and power supply. The most useful details include belt width, belt speed, burden depth, material particle size, moisture, iron size, iron frequency, installation height, discharge space and whether the separator needs manual cleaning or automatic self-cleaning. This information makes the recommendation more reliable and reduces the risk of selecting a magnet that looks strong on paper but is difficult to install, clean or maintain on site."
    ),
    section(
      "Related Cowinmagnet Solutions",
      `Based on the topic, the most relevant Cowinmagnet product direction is ${productMatch.category}. Possible related products include ${productMatch.recommendedProducts.join(", ")}. ${productMatch.rationale} These recommendations should be treated as starting points for technical discussion, not automatic model selection. A buyer in the target market should still confirm site layout, material flow, environmental conditions, power requirements, maintenance access and installation drawings before choosing between a suspended permanent magnet, self-cleaning overband separator, electromagnetic separator or magnetic component.`
    ),
    section(
      "FAQ",
      faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" ")
    ),
    section(
      "About Cowinmagnet",
      `${newsSystemConfig.brand.name} is the brand used by ${newsSystemConfig.brand.company} for magnetic separation equipment sourcing, product matching and export communication support. The company helps overseas buyers discuss product directions such as suspended magnetic separators, overband magnetic separators, electromagnetic separators, magnetic rollers, magnetic bars, magnetic drums, magnetic pulleys and related magnetic components for mining, recycling, cement, aggregate, coal handling, bulk material handling and industrial contamination-control applications. Cowinmagnet avoids unsupported claims and focuses on matching equipment direction with real working conditions.`
    ),
    section(
      "Call to Action",
      "If this news topic is related to your plant upgrade, material purity target or conveyor protection problem, you can send Cowinmagnet your material type, conveyor width, belt speed, material layer height, installation space and photos around the proposed installation point. The team can help review a suitable magnetic separator direction and prepare the next discussion for export quotation."
    ),
    section(
      "Conclusion",
      "Industry updates become valuable when they are translated into buyer decisions. For magnetic separation projects, the next step is to connect the market signal with material behavior, plant layout, contamination risk, cleaning method and separation goals. Cowinmagnet can help buyers review those conditions and compare suitable magnetic separator directions for export projects while keeping the final selection grounded in technical facts."
    )
  ];

  return {
    title,
    seoTitle: seoDescriptionFrom(titleFromTopic(item, productMatch)),
    seoDescription: excerpt,
    slug,
    excerpt,
    category,
    categoryTitle,
    coverAlt: `${productMatch.category} industry news analysis for Cowinmagnet buyers`,
    imageCaption: `Cowinmagnet generated cover image. News reference: ${source.name} / ${source.title}.`,
    sections,
    sources: [source],
    faqs,
    aboutBrand: `${newsSystemConfig.brand.name} is the magnetic separation equipment sourcing and export service brand of ${newsSystemConfig.brand.company}.`,
    callToAction: "Send your conveyor details, material information and installation photos for a magnetic separator recommendation.",
    geoEntities: {
      brand_name: newsSystemConfig.brand.name,
      company_name: newsSystemConfig.brand.company,
      product_name: productMatch.recommendedProducts[0] || "magnetic separation equipment",
      industry_keywords: keywords,
      application_scenarios: [
        "mining conveyor protection",
        "recycling line ferrous recovery",
        "cement and aggregate bulk handling",
        "coal handling tramp iron removal",
        "industrial metal contamination control"
      ],
      target_market: newsSystemConfig.targetCountries,
      customer_problem: "ferrous contamination, conveyor damage, downtime, product purity risk and manual cleaning pressure",
      product_solution: productMatch.category,
      product_benefits: "equipment protection, cleaner material flow, reduced manual sorting pressure and better process reliability",
      technical_terms: ["belt width", "belt speed", "burden depth", "installation height", "self-cleaning", "magnetic force"],
      contact_or_inquiry_entry: "/request-quote"
    },
    relatedProducts: productMatch.recommendedProducts,
    relatedProductRationale: productMatch.rationale,
    canonicalSourceUrl: item.url,
    sourceAttributionText: `${source.name}, "${source.title}", published ${source.date}, accessed ${source.accessedDate}. URL: ${source.url}`,
    contentTitle: `${titleFromTopic(item, productMatch)}: What Bulk Material Operators Should Review`,
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
    seoKeywords: keywords,
    suggestedImages: imagePlan.suggestedImages,
    imageSuggestions: imagePlan.suggestedImages,
    internalLinkSuggestions: [
      "/products",
      "/applications/mining",
      "/applications/recycling",
      "/request-quote"
    ],
    complianceNote:
      "Manual review required before publishing. Confirm source accuracy, image license, product claims, and that no wording implies Cowinmagnet participated in the reported event.",
    scores,
    workflowStatus: newsSystemConfig.workflow.defaultStatus
  };
}

function normalizeGeneratedArticle(input, draft) {
  const fallback = deterministicDraft(input);
  const merged = { ...fallback, ...draft };

  return {
    ...merged,
    title: merged.title || merged.contentTitle || fallback.title,
    slug: slugify(merged.slug || fallback.slug),
    seoTitle: merged.seoTitle || fallback.seoTitle,
    seoDescription: seoDescriptionFrom(merged.seoDescription || merged.excerpt || fallback.seoDescription),
    excerpt: merged.excerpt || fallback.excerpt,
    category: merged.category || fallback.category,
    categoryTitle: merged.categoryTitle || fallback.categoryTitle,
    coverAlt: merged.coverAlt || fallback.coverAlt,
    imageCaption: merged.imageCaption || fallback.imageCaption,
    sections: Array.isArray(merged.sections) && merged.sections.length >= 5 ? merged.sections.map((entry) => section(entry.heading, entry.body)) : fallback.sections,
    sources: Array.isArray(merged.sources) && merged.sources.length ? merged.sources : fallback.sources,
    faqs: Array.isArray(merged.faqs) && merged.faqs.length >= 3 ? merged.faqs : fallback.faqs,
    relatedProducts: Array.isArray(merged.relatedProducts) && merged.relatedProducts.length ? merged.relatedProducts : fallback.relatedProducts,
    seoKeywords: Array.isArray(merged.seoKeywords) && merged.seoKeywords.length ? merged.seoKeywords : fallback.seoKeywords,
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
    return normalizeGeneratedArticle(input, JSON.parse(text || "{}"));
  } catch {
    return deterministicDraft(input);
  }
}
