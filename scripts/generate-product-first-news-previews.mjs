import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createProductFirstNewsDocument, validateProductFirstNewsDocument } from "../lib/news/product-first-document.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "docs", "news-previews");
const site = { siteId: "cowinmagnet", brandName: "COWIN MAGNET", baseUrl: "https://www.cowinmagnet.com", publicationLanguage: "en" };

// These preview inputs deliberately use only existing COWIN product identities and
// conservative, source-attributed industry context. They are not CMS records.
const previews = [
  {
    id: "permanent-overband-aggregate",
    candidate: {
      title: "Aggregate conveyor protection and magnetic separation planning",
      publisher: "Powder & Bulk Solids",
      canonicalUrl: "https://www.powderbulksolids.com/screening-separation/magnetic-separation-technology-safeguards-aggregate-quality-equipment",
      sourcePublishedAt: "2025-09-19T00:00:00.000Z",
      industry: "Aggregates and material handling",
      applicationScenario: "aggregate conveyor protection",
      primaryKeyword: "Permanent Overband Magnetic Separator for Aggregate Conveyor Protection"
    },
    productMedia: {
      product: {
        productId: "permanent-overband-magnetic-separator",
        slug: "permanent-overband-magnetic-separator",
        category: "Metal Detection & Recycling Sorting",
        productName: "Permanent Overband Magnetic Separator",
        publicUrl: "/en/products/permanent-overband-magnetic-separator",
        verifiedSummary: "A permanent overband magnetic separator is used to remove ferromagnetic tramp material from conveyor-fed bulk streams where a continuously running discharge belt is required.",
        approvedIndustries: ["Aggregates", "Recycling", "Bulk material handling"]
      },
      snapshot: {
        productId: "permanent-overband-magnetic-separator",
        productName: "Permanent Overband Magnetic Separator",
        productUrl: "/en/products/permanent-overband-magnetic-separator",
        imageId: "permanent-overband-magnetic-separator-01",
        src: "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-01.jpg",
        alt: "COWIN MAGNET permanent overband magnetic separator for conveyor tramp iron removal",
        capturedAt: "2026-08-22T00:00:00.000Z"
      }
    },
    citation: {
      publisher: "Powder & Bulk Solids",
      title: "Magnetic separation technology safeguards aggregate quality and equipment",
      canonicalUrl: "https://www.powderbulksolids.com/screening-separation/magnetic-separation-technology-safeguards-aggregate-quality-equipment",
      publishedAt: "2025-09-19T00:00:00.000Z",
      accessedAt: "2026-08-22T00:00:00.000Z",
      editorialSummary: "The report discusses how unwanted ferrous material can enter aggregate streams through wear, feed contamination and upstream handling. It frames separator location, material conditions and maintenance access as practical factors when a plant is reviewing equipment-protection measures. The report is used here only as general industry context for an aggregate conveyor review. It does not describe a COWIN MAGNET installation, product specification or performance result.",
      keyFacts: [{ statement: "The source discusses separator location, material conditions and maintenance access in aggregate handling." }]
    }
  },
  {
    id: "wet-drum-mineral-processing",
    candidate: {
      title: "Mineral test work and wet magnetic separation planning",
      publisher: "MINING.com Press Release",
      canonicalUrl: "https://www.mining.com/press-release?id=698b31c5a9bb91303299dedb",
      sourcePublishedAt: "2026-02-10T00:00:00.000Z",
      industry: "Mineral processing",
      applicationScenario: "wet mineral slurry processing",
      primaryKeyword: "Wet Drum Magnetic Separator for Mineral Slurry Processing"
    },
    productMedia: {
      product: {
        productId: "wet-drum-magnetic-separator",
        slug: "wet-drum-magnetic-separator",
        category: "Magnetic Separation Equipment",
        productName: "Wet Drum Magnetic Separator",
        publicUrl: "/en/products/wet-drum-magnetic-separator",
        verifiedSummary: "A wet drum magnetic separator is used in slurry processing where magnetic particles are separated from a mineral stream under conditions that must be confirmed for the specific material and process.",
        approvedIndustries: ["Mineral processing", "Mining", "Coal washing"]
      },
      snapshot: {
        productId: "wet-drum-magnetic-separator",
        productName: "Wet Drum Magnetic Separator",
        productUrl: "/en/products/wet-drum-magnetic-separator",
        imageId: "wet-drum-magnetic-separator-01",
        src: "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-01.jpg",
        alt: "COWIN MAGNET wet drum magnetic separator for mineral slurry processing",
        capturedAt: "2026-08-22T00:00:00.000Z"
      }
    },
    citation: {
      publisher: "MINING.com Press Release",
      title: "Go Metals Provides Update on KM98 Nb-REE-Sc Project",
      canonicalUrl: "https://www.mining.com/press-release?id=698b31c5a9bb91303299dedb",
      publishedAt: "2026-02-10T00:00:00.000Z",
      accessedAt: "2026-08-22T00:00:00.000Z",
      editorialSummary: "The press release reports preliminary metallurgical work that used conventional magnetic and gravity separation to evaluate mineral behavior and produce separate mineral streams for further assessment. It also states that additional work is planned. The report is used here only to illustrate why mineralogy, liberation, slurry conditions and test-work objectives should be confirmed before selecting mineral-processing equipment. It is not a COWIN MAGNET project, case study or performance reference.",
      keyFacts: [{ statement: "The source reports preliminary metallurgical testing that included conventional magnetic separation and planned follow-up work." }]
    }
  },
  {
    id: "drawer-magnet-powder-handling",
    candidate: {
      title: "Dry powder line contamination control and magnetic filter placement",
      publisher: "Powder & Bulk Solids",
      canonicalUrl: "https://www.powderbulksolids.com/screening-separation/3-installation-mistakes-that-make-magnetic-separators-fail",
      sourcePublishedAt: "2026-06-26T00:00:00.000Z",
      industry: "Dry powder and bulk material handling",
      applicationScenario: "dry powder contamination control",
      primaryKeyword: "Drawer Magnet for Dry Powder Contamination Control"
    },
    productMedia: {
      product: {
        productId: "drawer-magnet",
        slug: "drawer-magnet",
        category: "Magnetic Components & Filters",
        productName: "Drawer Magnet",
        publicUrl: "/en/products/drawer-magnet",
        verifiedSummary: "A drawer magnet is a magnetic filter component for dry, gravity-fed material streams where ferrous contamination needs to be captured and cleanout access can be planned.",
        approvedIndustries: ["Powder handling", "Plastics", "Food and grain processing"]
      },
      snapshot: {
        productId: "drawer-magnet",
        productName: "Drawer Magnet",
        productUrl: "/en/products/drawer-magnet",
        imageId: "drawer-magnet-01",
        src: "/assets/products/drawer-magnet/drawer-magnet-01.png",
        alt: "COWIN MAGNET drawer magnet for dry gravity-fed material streams",
        capturedAt: "2026-08-22T00:00:00.000Z"
      }
    },
    citation: {
      publisher: "Powder & Bulk Solids",
      title: "3 Magnetic Separator Installation Mistakes That Make Magnetic Separators Fail",
      canonicalUrl: "https://www.powderbulksolids.com/screening-separation/3-installation-mistakes-that-make-magnetic-separators-fail",
      publishedAt: "2026-06-26T00:00:00.000Z",
      accessedAt: "2026-08-22T00:00:00.000Z",
      editorialSummary: "The article discusses installation decisions that can limit magnetic separator effectiveness, including placement relative to the material stream, evaluation of material behavior and access for cleaning or maintenance. It presents these as setup considerations rather than universal specifications. The article is used here only as general industry context for reviewing a dry powder line. It does not support any COWIN MAGNET performance claim, product configuration or customer result.",
      keyFacts: [{ statement: "The source discusses placement, material behavior and service access as installation considerations." }]
    }
  }
];

function formatDocument(document) {
  const sections = document.sections.map((section) => {
    const blocks = section.blocks.map((block) => {
      if (block.type === "bullets") return block.items.map((item) => `- ${item}`).join("\n");
      if (block.type === "callout") return `> **${block.title}**\n> ${block.text}`;
      return block.text || "";
    }).join("\n\n");
    return `## ${section.heading}\n\n${blocks}`;
  }).join("\n\n");
  const faq = document.faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n");
  const sources = document.sources.map((source) => `- **${source.publisher}**: [${source.title}](${source.url})${source.publishedAt ? ` (${source.publishedAt.slice(0, 10)})` : ""}\n  - ${source.editorialSummary}\n  - ${source.relevanceNote}`).join("\n");
  return `# ${document.title}\n\n${document.summary}\n\n**Preview only. Not published.**\n\n${sections}\n\n## FAQ\n\n${faq}\n\n## Sources\n\n${sources}\n\n## CTA\n\n[${document.cta.label}](${document.cta.href})`;
}

await mkdir(outputDirectory, { recursive: true });
const results = previews.map((preview) => {
  const article = createProductFirstNewsDocument({ site, ...preview });
  const { document } = article;
  const validation = validateProductFirstNewsDocument(document, {
    productName: preview.productMedia.product.productName,
    sourceUrl: preview.citation.canonicalUrl
  });
  return { id: preview.id, slug: article.slug, document, validation };
});

if (results.some((result) => !result.validation.passed)) {
  throw new Error(`Preview validation failed: ${JSON.stringify(results.map(({ id, validation }) => ({ id, validation })), null, 2)}`);
}

await writeFile(path.join(outputDirectory, "product-first-news-previews.json"), `${JSON.stringify(results, null, 2)}\n`);
await writeFile(path.join(outputDirectory, "product-first-news-previews.md"), `${results.map(({ id, document, validation }) => `<!-- ${id}; ${validation.wordCount} words -->\n\n${formatDocument(document)}`).join("\n\n---\n\n")}\n`);
console.log(`Generated ${results.length} validated, unpublished product-first previews in ${outputDirectory}`);
