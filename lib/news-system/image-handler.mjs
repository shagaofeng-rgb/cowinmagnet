import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { matchCompanyImages } from "./image-library.mjs";

const negativeStyle =
  "no illustration, no vector style, no cartoon, no infographic, no abstract art, no icon style, no flat design, no simple poster, no readable logos";

function topicText({ item, article, productMatch }) {
  return [
    article?.title,
    article?.excerpt,
    item?.title,
    item?.description,
    productMatch?.category,
    productMatch?.recommendedProducts?.join(", ")
  ]
    .filter(Boolean)
    .join(" ");
}

function photorealisticPrompt({ item, article, productMatch, section, index }) {
  const scene =
    /recycling|waste|scrap|battery|metal recovery/i.test(topicText({ item, article, productMatch }))
      ? "a realistic metal recycling sorting line with conveyor belts and magnetic separation equipment removing ferrous metal from mixed materials"
      : /mining|ore|mineral|coal|rare earth|lithium/i.test(topicText({ item, article, productMatch }))
        ? "a real-world mining conveyor and mineral processing plant with an overhead magnetic separator installed above bulk material flow"
        : /magnetic bar|magnetic rod|filter|powder|food/i.test(topicText({ item, article, productMatch }))
          ? "a realistic close-up product photo of magnetic bars and magnetic filters used for fine material separation in an industrial workshop"
          : "a realistic suspended magnetic separator installed above a conveyor belt in an industrial material handling plant";

  return [
    `Photorealistic industrial editorial photo ${index + 1}: ${scene}.`,
    section?.heading ? `Match this article section: ${section.heading}.` : "",
    "Real machinery, real equipment, product photography details, documentary industrial lighting, B2B website news image quality, high-resolution, natural perspective.",
    negativeStyle
  ]
    .filter(Boolean)
    .join(" ");
}

function aiFallbackImages({ item, article, productMatch, count }) {
  const sections = article?.sections || [];
  return Array.from({ length: count }, (_, index) => {
    const section = sections[index + 1] || sections[index] || {};
    const prompt = photorealisticPrompt({ item, article, productMatch, section, index });

    return {
      imageUrl: "",
      imageType: "inline",
      displayOrder: index + 1,
      relatedSection: section.heading || "",
      sourceStrategy: "ai-photorealistic-prompt",
      visualStyle: "photorealistic industrial machinery",
      imageAlt: `${productMatch.category} realistic industrial photo for ${section.heading || "Cowinmagnet news"}`,
      imageTitle: `${productMatch.category} realistic industrial scene`,
      imageCaption: "AI image prompt prepared for a photorealistic industrial scene. Generate or replace with a company-owned real photo before publishing.",
      imageSourceName: "AI-generated / pending generation",
      imageSourceUrl: newsSystemConfig.siteUrl,
      imageAttributionText: "Generated based on article theme; no third-party news image reused.",
      imageSeoFileName: `photorealistic-${productMatch.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}.jpg`,
      aiPrompt: prompt
    };
  });
}

function sourceCoverImage(item, article, topic) {
  if (!newsSystemConfig.imagePolicy.allowSourceImages || !item?.imageUrl) return null;
  const sourceName = item.imageSourceName || item.sourceName || "Original news source";
  const sourceUrl = item.imageSourceUrl || item.url || item.sourceUrl || "";

  return {
    imageUrl: item.imageUrl,
    imageType: "cover",
    displayOrder: 0,
    relatedSection: "Cover",
    sourceStrategy: "source-news-image",
    visualStyle: "external news image",
    imageAlt: `${article?.title || item.title || "Industry news"} source image from ${sourceName}`,
    imageTitle: `${article?.title || item.title || "Industry news"} - source image`,
    imageCaption: `Source news image from ${sourceName}. Cowinmagnet uses the image as a referenced news cover and adds its own industry analysis below.`,
    imageSourceName: sourceName,
    imageSourceUrl: sourceUrl,
    imageAttributionText: item.imageLicenseNote || `Image source: ${sourceName}.`,
    imageSeoFileName: `source-news-${String(topic || "industry").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`
  };
}

export async function buildImagePlan(item, productMatch, article = null) {
  const minInlineImages = newsSystemConfig.imagePolicy.minInlineImages;
  const maxInlineImages = newsSystemConfig.imagePolicy.maxInlineImages;
  const companyMatch = article
    ? await matchCompanyImages({ item, article, productMatch, minInlineImages, maxInlineImages })
    : { cover: null, inlineImages: [], topic: "product-equipment", rankedCount: 0 };

  const inlineImages = [...companyMatch.inlineImages];
  if (inlineImages.length < minInlineImages && newsSystemConfig.imagePolicy.allowAiGeneratedPhotorealisticImages) {
    inlineImages.push(
      ...aiFallbackImages({
        item,
        article,
        productMatch,
        count: minInlineImages - inlineImages.length
      })
    );
  }

  return {
    topic: companyMatch.topic,
    coverImage: sourceCoverImage(item, article, companyMatch.topic) || companyMatch.cover,
    bodyImages: inlineImages.slice(0, maxInlineImages),
    libraryMatchCount: companyMatch.rankedCount,
    copyrightNote:
      "Prefer Cowinmagnet company-library photos. Use source news images only when license/usage is confirmed. AI fallback prompts must be photorealistic industrial equipment scenes.",
    aiStyleRules: {
      required:
        "photorealistic, realistic product photo, real industrial scene, real machinery, real equipment, industrial photography, editorial photo style",
      forbidden: negativeStyle
    }
  };
}
