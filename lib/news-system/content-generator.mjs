import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { buildNewsSeoGeoProfile } from "./seo-geo-profile.mjs";

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
  const seoGeoProfile = buildNewsSeoGeoProfile({ item, productMatch });
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

SEO/GEO profile:
${JSON.stringify(seoGeoProfile, null, 2)}

Return strict JSON with:
title, seoTitle, seoDescription, slug, excerpt, category, categoryTitle, coverAlt, imageCaption,
sections (array of {heading, body}), sources (array), relatedProducts (array),
relatedProductRationale, seoKeywords, faqs (array of {question, answer}), aboutBrand,
callToAction, geoEntities, seoGeoProfile, imageSuggestions, internalLinkSuggestions, complianceNote.

Required article structure:
- Introduction
- News Background
- Why It Matters
- Industry Perspective
- Brand/Product Connection
- Practical Implications for Buyers
- Related Cowinmagnet Solutions
- Buyer Search Intent and Selection Checklist
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
- Include buyer search intent, product category, related product names, selection parameters, service scope, and source event entity in AI-search-friendly language.
- Include at least 3 to 5 FAQ items around industry trends, magnetic separator application, purchasing choices, technical parameters, and use scenarios.
- Include image suggestions with image_alt, image_caption, image_title, image_description, image_source, image_license_note, and image_file_name.
- Keep source references as citations for context, but do not reuse large source wording.
- Avoid keyword stuffing, exaggerated claims, "world's best", "No.1", "leading global manufacturer", and similar unverifiable language.
- Do not describe Cowinmagnet as an own factory, direct factory, source manufacturer, factory-direct manufacturer, industry-leading manufacturer, No.1 manufacturer, or world-leading factory.
`;
}

export function keywordList(item, productMatch) {
  const profile = buildNewsSeoGeoProfile({ item, productMatch });
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

  return [...new Set([...base, ...(profile.searchKeywords || [])])].slice(0, 18);
}

function displayDate(value) {
  if (!value) return "Unknown publication date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
}

function titleWords(value = "") {
  const stop = new Set([
    "the",
    "and",
    "for",
    "with",
    "from",
    "into",
    "joins",
    "wins",
    "awards",
    "award",
    "program",
    "plant",
    "project",
    "news",
    "says",
    "backs",
    "backed"
  ]);
  return String(value)
    .replace(/[^A-Za-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stop.has(word.toLowerCase()));
}

function eventFocus(item) {
  const words = titleWords(item.title || "");
  const capitalized = words.filter((word) => /^[A-Z0-9]/.test(word));
  const focus = capitalized.slice(0, 4).join(" ") || words.slice(0, 4).join(" ") || "Industry Update";
  return focus.slice(0, 80);
}

function eventAngle(item, productMatch) {
  const text = `${item.title || ""} ${item.description || ""} ${productMatch.category || ""}`.toLowerCase();
  if (/lithium|battery|brine|extraction/.test(text)) {
    return {
      market: "lithium extraction and battery-material supply",
      buyerIssue: "process stability, mixed mineral streams, and contamination control before sensitive downstream steps",
      equipmentLens: "magnetic separation around feed preparation, recycling residues, and conveyor transfer points",
      inquiryDetails: "brine or mineral feed type, particle size after pretreatment, belt or chute layout, and any ferrous contamination history"
    };
  }
  if (/rare earth|critical mineral|bauxite|residue|mineral processing|ore/.test(text)) {
    return {
      market: "rare earth and critical-mineral processing",
      buyerIssue: "ore variability, residue handling, tramp iron risk, and protection of crushers or screens",
      equipmentLens: "suspended magnets, self-cleaning overband separators, and magnetic drums before key processing stages",
      inquiryDetails: "ore name, belt width, burden depth, expected iron size, installation height, and crusher or screen position"
    };
  }
  if (/recycling|scrap|waste|battery|plastic/.test(text)) {
    return {
      market: "recycling and secondary-material recovery",
      buyerIssue: "material purity, ferrous recovery, equipment protection, and reduced manual sorting pressure",
      equipmentLens: "overband separators, magnetic drums, pulleys, grids, and bars across sorting and transfer points",
      inquiryDetails: "waste stream composition, throughput, belt speed, target metal size, discharge space, and cleaning method"
    };
  }
  if (/food|powder|granule|contamination|foreign material/.test(text)) {
    return {
      market: "food, powder, and granular material processing",
      buyerIssue: "foreign metal risk, product quality control, inspection pressure, and sanitation-friendly maintenance",
      equipmentLens: "magnetic bars, grids, plates, filters, and inline magnetic separators",
      inquiryDetails: "material name, flow rate, particle size, moisture, temperature, contact-surface requirement, and cleaning frequency"
    };
  }
  return {
    market: "bulk material handling",
    buyerIssue: "ferrous contamination, conveyor damage, downtime, and maintenance access",
    equipmentLens: "magnetic separator selection around the actual material flow and installation space",
    inquiryDetails: "material type, throughput, belt width, belt speed, burden depth, iron size, and available installation space"
  };
}

function seoDescriptionFrom(value = "") {
  const text = String(value).replace(/\s+/g, " ").trim();
  if (text.length <= 158) return text;
  return `${text.slice(0, 155).replace(/\s+\S*$/, "")}...`;
}

function titleFromTopic(item, productMatch) {
  const text = `${item.title || ""} ${item.description || ""} ${productMatch.category || ""}`.toLowerCase();
  const focus = eventFocus(item);
  if (/rare earth|critical mineral|lithium|mineral processing|ore/.test(text)) {
    return `${focus}: Magnetic Separation Questions for Mineral Buyers`;
  }
  if (/recycling|waste|scrap|metal recovery|battery/.test(text)) {
    return `${focus}: Recycling Buyers Review Magnetic Separation Needs`;
  }
  if (/aggregate|quarry|cement|crusher|limestone/.test(text)) {
    return `${focus}: Conveyor Protection Lessons for Quarry Buyers`;
  }
  if (/food|powder|granule|foreign material|contamination/.test(text)) {
    return `${focus}: Metal Contamination Control Notes for Processors`;
  }
  if (/electromagnetic/.test(text)) {
    return `${focus}: Electromagnetic Separator Selection Notes`;
  }
  return `${focus}: Magnetic Separator Buyer Notes`;
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
  const profile = buildNewsSeoGeoProfile({ productMatch });
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
        `Useful information includes ${profile.selectionParameters.slice(0, 8).join(", ")}. Installation photos or drawings are also useful because magnetic separator selection depends on real layout and maintenance access.`
    },
    {
      question: "Can one magnetic separator model fit every mining or recycling line?",
      answer:
        "No. A suspended permanent magnet, self-cleaning overband separator, electromagnetic separator, magnetic drum, magnetic pulley, magnetic bar or magnetic grid can each fit different duties. The practical choice depends on material behavior, process layout, separation target and maintenance requirements."
    }
  ];
}

function deterministicDraft({ item, scores, productMatch, imagePlan }) {
  const seoGeoProfile = buildNewsSeoGeoProfile({ item, productMatch });
  const slug = buildArticleSlug(item, productMatch);
  const source = sourceReference(item);
  const keywords = keywordList(item, productMatch);
  const sourceSummary = item.description || item.title || "A new industry update was published by the cited source.";
  const focus = eventFocus(item);
  const angle = eventAngle(item, productMatch);
  const category = (item.category || "").includes("recycling")
    ? "market-trends"
    : (item.category || "").includes("mining")
      ? "industry-news"
      : "technology-updates";
  const categoryTitle =
    category === "market-trends" ? "Market Trends" : category === "industry-news" ? "Industry News" : "Technology Updates";
  const title = `${titleFromTopic(item, productMatch)}: Cowinmagnet View`;
  const excerpt = seoDescriptionFrom(
    `Cowinmagnet reviews ${focus} and explains what the news may mean for magnetic separation equipment buyers in ${angle.market}.`
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
      `${focus} is a useful signal for overseas buyers watching ${angle.market}. Cowinmagnet treats the ${source.name} report as factual background and then looks at a practical equipment question: how should operators think about ${angle.buyerIssue}? This article is not a repost of the source story. It turns the event into a magnetic separation and material-handling review for buyers who need cleaner flow, safer downstream equipment, and more predictable maintenance planning.`
    ),
    section(
      "News Background",
      `According to ${source.name}, "${item.title}" was published on ${source.date}. The available source summary says: ${sourceSummary} The important point for Cowinmagnet readers is not only the announcement itself, but the operating environment behind it. In ${angle.market}, plants often need to move inconsistent materials through conveyors, chutes, crushers, screens, separators, or inspection steps. That makes ${angle.equipmentLens} worth reviewing before a buyer selects a model or sends an inquiry.`
    ),
    section(
      "Why It Matters",
      `For industrial buyers, this story matters because ${angle.market} projects rarely depend on one machine only. They depend on a stable flow of material from feeding to discharge. If unwanted ferrous metal reaches crushers, shredders, screens, sorting machines, packing systems, or sensitive process equipment, the result can be downtime, product-quality risk, belt damage, or extra manual cleaning. The buyer question raised by ${focus} is therefore specific: where in the line should magnetic separation be reviewed so that ${angle.buyerIssue} are controlled early enough?`
    ),
    section(
      "Industry Perspective",
      `From an industry perspective, ${angle.market} is becoming more demanding because operators want higher throughput, cleaner output, and less unplanned stoppage. Magnetic separation equipment is not a universal one-size answer. A suspended permanent magnet may fit simple conveyor-protection duty. A self-cleaning overband separator is often reviewed when captured iron appears frequently. Electromagnetic separators can be considered for deeper burden or adjustable magnetic force. Magnetic bars, grids, drums, pulleys, and filters can be more relevant when the material is fine, granular, recycled, or moving through enclosed equipment. The right direction depends on ${angle.inquiryDetails}.`
    ),
    section(
      "Brand/Product Connection",
      `${newsSystemConfig.brand.name}, operated by ${newsSystemConfig.brand.company}, reads the ${focus} update as a reminder that product selection should begin with working conditions instead of only a catalog name. For this topic, the most relevant equipment lens is ${productMatch.category}. Possible product directions include ${productMatch.recommendedProducts.join(", ")}. These products may help capture tramp iron, protect downstream equipment, support cleaner material flow, or reduce manual sorting pressure, but the final configuration should be checked against drawings, material behavior, maintenance access, and installation limits.`
    ),
    section(
      "Practical Implications for Buyers",
      `Before sending an inquiry related to this type of news, buyers can prepare a short technical brief rather than asking for a model immediately. Useful details include ${angle.inquiryDetails}. Photos or drawings around the conveyor, chute, hopper, transfer point, or process inlet are also important because installation height and discharge space can decide whether a suspended magnet, self-cleaning overband separator, drum, pulley, grid, or bar is realistic. This preparation reduces the risk of choosing equipment that looks strong on paper but is difficult to install, clean, or maintain on site.`
    ),
    section(
      "Related Cowinmagnet Solutions",
      `Based on the topic, Cowinmagnet would first review ${productMatch.category}. Possible related products include ${productMatch.recommendedProducts.join(", ")}. ${productMatch.rationale} For the ${focus} context, this is only a starting point for technical discussion, not an automatic model selection. A buyer should still confirm site layout, material flow, environmental conditions, power requirements, cleaning method, maintenance access, and installation drawings before choosing between a suspended permanent magnet, self-cleaning overband separator, electromagnetic separator, magnetic drum, magnetic pulley, magnetic grid, or magnetic bar.`
    ),
    section(
      "Buyer Search Intent and Selection Checklist",
      `A buyer searching for this topic is likely trying to ${seoGeoProfile.buyerIntent}. The practical checklist should include ${seoGeoProfile.selectionParameters.join(", ")}. Cowinmagnet can support product selection, supplier resource coordination, OEM/ODM communication coordination, quality inspection coordination, export and logistics support, installation document coordination, and after-sales communication support. These services should be understood as export and sourcing support around magnetic separation equipment, not as a claim that Cowinmagnet owns or operates the source news project.`
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
      `If the ${focus} topic is close to your own plant upgrade, material purity target, or conveyor protection problem, you can send Cowinmagnet ${angle.inquiryDetails}, plus photos around the proposed installation point. The team can help review a suitable magnetic separator direction and prepare the next discussion for export quotation.`
    ),
    section(
      "Conclusion",
      `${focus} becomes useful for buyers when it is translated into practical operating decisions. For magnetic separation projects, the next step is to connect the news signal with material behavior, plant layout, contamination risk, cleaning method, and separation goals. Cowinmagnet can help buyers compare suitable magnetic separator directions for export projects while keeping the final selection grounded in technical facts from the site.`
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
    imageCaption: `Cowinmagnet company-library or licensed illustrative image. News reference: ${source.name} / ${source.title}.`,
    sections,
    sources: [source],
    faqs,
    aboutBrand: `${newsSystemConfig.brand.name} is the magnetic separation equipment sourcing and export service brand of ${newsSystemConfig.brand.company}.`,
    callToAction: `Send your ${seoGeoProfile.selectionParameters.slice(0, 5).join(", ")} and installation photos for a magnetic separator recommendation.`,
    seoGeoProfile,
    geoEntities: {
      brand_name: newsSystemConfig.brand.name,
      company_name: newsSystemConfig.brand.company,
      product_name: productMatch.recommendedProducts[0] || "magnetic separation equipment",
      industry_keywords: keywords,
      buyer_search_intent: seoGeoProfile.buyerIntent,
      product_category: seoGeoProfile.productCategory,
      service_scope: seoGeoProfile.serviceScope,
      application_scenarios: [
        "mining conveyor protection",
        "recycling line ferrous recovery",
        "cement and aggregate bulk handling",
        "coal handling tramp iron removal",
        "industrial metal contamination control"
      ],
      target_market: newsSystemConfig.targetCountries,
      customer_problem: angle.buyerIssue,
      product_solution: `${productMatch.category} for ${angle.market}`,
      product_benefits: "equipment protection, cleaner material flow, reduced manual sorting pressure and better process reliability",
      technical_terms: seoGeoProfile.selectionParameters,
      contact_or_inquiry_entry: "/request-quote"
    },
    relatedProducts: productMatch.recommendedProducts,
    relatedProductRationale: productMatch.rationale,
    canonicalSourceUrl: item.url,
    sourceAttributionText: `${source.name}, "${source.title}", published ${source.date}, accessed ${source.accessedDate}. URL: ${source.url}`,
    contentTitle: `${titleFromTopic(item, productMatch)}: What Bulk Material Operators Should Review`,
    originalReference: reference,
    newsSummary:
      `${item.description || item.title} This item is treated as an industry signal rather than copied news content. For B2B buyers, the useful angle is whether ${focus} points to recurring problems in ${angle.market}, especially ${angle.buyerIssue}.`,
    industryPainPointAnalysis:
      `Many ${angle.market} lines move mixed, abrasive, recycled or sensitive materials through connected process steps. When ferrous metal enters the flow, it can damage downstream equipment, interrupt production or create extra manual sorting work. The practical purchasing question is not only magnetic strength, but also ${angle.inquiryDetails}, cleaning method, duty cycle and maintenance access.`,
    cowinmagnetViewpoint:
      `${newsSystemConfig.brand.name} positions ${focus} as a product selection and export service question. A properly specified magnetic separator may help capture tramp iron before critical equipment, can support more stable material flow and is often used to reduce manual cleaning pressure. Final model selection should be confirmed from customer drawings, ${angle.inquiryDetails}, and site installation limits.`,
    recommendedProductMatch: {
      category: productMatch.category,
      products: productMatch.recommendedProducts,
      rationale: productMatch.rationale
    },
    applicationScenario:
      `Relevant scenarios include ${angle.equipmentLens}, conveyor transfer points, crusher feed belts, sorting lines, raw material handling, bulk material loading and process inlets where ferrous metal may affect reliability or product quality.`,
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
      "Manual review required before publishing. Confirm source accuracy, image license, product claims, and that no wording implies Cowinmagnet participated in the reported event or owns a factory/source manufacturing operation.",
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
    seoGeoProfile: merged.seoGeoProfile || fallback.seoGeoProfile,
    geoEntities: merged.geoEntities || fallback.geoEntities,
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
