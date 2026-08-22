import assert from "node:assert/strict";
import test from "node:test";
import { createProductFirstNewsDocument, validateProductFirstNewsDocument } from "../lib/news/product-first-document.js";

const site = { brand_name: "COWIN MAGNET", publication_language: "en" };
const candidate = {
  title: "Conveyor protection planning receives renewed attention in material handling",
  publisher: "Industry Example",
  canonicalUrl: "https://example.com/material-handling-update",
  sourcePublishedAt: "2026-08-22",
  industry: "recycling material handling"
};
const productMedia = {
  product: {
    productName: "Permanent Overband Magnetic Separator",
    verifiedSummary: "Permanent Overband Magnetic Separator is listed by COWIN MAGNET in the permanent magnetic separation equipment category. Configuration is discussed from material and site conditions."
  },
  snapshot: {
    productUrl: "/en/products/permanent-overband-magnetic-separator",
    src: "/assets/products/permanent-overband-magnetic-separator.webp",
    alt: "Permanent Overband Magnetic Separator for recycling material handling"
  }
};
const citation = {
  title: candidate.title,
  publisher: candidate.publisher,
  canonicalUrl: candidate.canonicalUrl,
  publishedAt: candidate.sourcePublishedAt,
  accessedAt: "2026-08-22T00:00:00.000Z",
  editorialSummary: "The report describes renewed attention to planning conveyor protection around changing material streams and maintenance access. It explains that operations teams are reviewing where unwanted metal can affect downstream equipment and how line information should be documented. The article is relevant as industry context because it focuses on material handling decisions rather than a consumer topic or a generic market update.",
  keyFacts: [{ statement: "The source discusses conveyor protection planning and maintenance access." }]
};

test("product-first News document places the product and application before reporting", () => {
  const article = createProductFirstNewsDocument({ site, candidate, productMedia, citation });
  const validation = validateProductFirstNewsDocument(article.document, {
    productName: productMedia.product.productName,
    sourceUrl: candidate.canonicalUrl
  });
  assert.equal(validation.passed, true, validation.errors.join(", "));
  assert.match(article.document.title, /Permanent Overband Magnetic Separator/);
  assert.equal(article.document.sections[0].heading, "Product role in this application");
  assert.ok(article.document.sections.findIndex((section) => section.heading === "Recent industry reporting") > 3);
  assert.equal(article.document.heroImage.assetId, productMedia.snapshot.src);
  assert.match(article.document.sections[1].blocks[0].text, /conveyor route/i);
  assert.ok(validation.wordCount >= 1100 && validation.wordCount <= 1600);
});

test("product-first gate rejects a news-first section order", () => {
  const article = createProductFirstNewsDocument({ site, candidate, productMedia, citation });
  const reporting = article.document.sections.find((section) => section.heading === "Recent industry reporting");
  article.document.sections = [reporting, ...article.document.sections.filter((section) => section !== reporting)];
  const validation = validateProductFirstNewsDocument(article.document, {
    productName: productMedia.product.productName,
    sourceUrl: candidate.canonicalUrl
  });
  assert.equal(validation.passed, false);
  assert.ok(validation.errors.includes("product-first-section-order-invalid"));
  assert.ok(validation.errors.includes("industry-reporting-must-follow-product-application"));
});
