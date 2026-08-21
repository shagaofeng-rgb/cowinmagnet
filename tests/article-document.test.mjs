import assert from "node:assert/strict";
import test from "node:test";
import { createArticleDocumentFromLegacy, validateArticleDocument } from "../lib/articleDocument.js";

function guide(overrides = {}) {
  return {
    schemaVersion: 1, locale: "en", contentType: "technical-guide", status: "draft", title: "RCDD Separator Selection Guide",
    summary: "A practical guide for reviewing conveyor conditions, material burden and installation clearance before selecting an RCDD separator.",
    primaryTopic: "RCDD separator selection", targetAudience: "Conveyor engineers",
    sections: [
      { heading: "When it fits", blocks: [{ type: "paragraph", text: "The guide explains when this configuration may suit a conveyor application." }] },
      { heading: "Installation position", blocks: [{ type: "paragraph", text: "Position is confirmed from the conveyor layout and discharge area." }] },
      { heading: "Information required", blocks: [{ type: "checklist", items: ["Belt width", "Burden depth"] }] },
      { heading: "Configuration points", blocks: [{ type: "bullets", items: ["Cooling review", "Electrical review"] }] },
      { heading: "Selection mistakes", blocks: [{ type: "paragraph", text: "Avoid deciding from a product name without material and site conditions." }] }
    ],
    faq: [{ question: "What should be confirmed?", answer: "Conveyor, material and site details." }], sources: [], relatedContent: [],
    cta: { heading: "Send details", text: "Share the application conditions.", label: "Send details", href: "/en/request-quote" },
    seo: { metaTitle: "RCDD Separator Selection Guide", metaDescription: "Use this practical guide to review conveyor data, material conditions and installation clearance before selecting an RCDD separator.", canonicalPath: "/en/news/rcdd-guide", ogTitle: "RCDD Separator Selection Guide", ogDescription: "Review conveyor conditions before selecting an RCDD separator." },
    author: { name: "COWIN MAGNET Editorial Team" }, ...overrides
  };
}

test("placeholder headings and incomplete meta descriptions are rejected", () => {
  const document = guide({ sections: [{ heading: "Update Note 2", blocks: [{ type: "paragraph", text: "This should never reach a public page." }] }], seo: { ...guide().seo, metaDescription: "A short unfinished sentence includes" } });
  const result = validateArticleDocument(document);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some((error) => error.startsWith("forbidden-heading")));
  assert.ok(result.errors.includes("meta-description-incomplete"));
});

test("duplicate FAQs and guide content rendered as NewsArticle are prevented by the document contract", () => {
  const document = guide({ faq: [{ question: "What should be confirmed?", answer: "Conveyor conditions." }, { question: "What should be confirmed?", answer: "Material conditions." }] });
  const result = validateArticleDocument(document);
  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("duplicate-faq"));
  assert.equal(result.document.contentType, "technical-guide");
});

test("News requires a readable source summary rather than a bare source link", () => {
  const document = guide({
    contentType: "news",
    sections: guide().sections.slice(0, 5),
    sources: [{ title: "Verified report", publisher: "Industry publisher", url: "https://example.com/report", accessedAt: "2026-08-21T00:00:00.000Z", relevanceNote: "This report supports the article context." }]
  });
  const result = validateArticleDocument(document);
  assert.equal(result.passed, false);
  assert.ok(result.errors.includes("source-summary-length"));
});

test("legacy lists remain list blocks rather than generated headings", () => {
  const document = createArticleDocumentFromLegacy({ title: "Legacy guide", contentType: "technical-guide", excerpt: "A clear summary that explains the process and selection conditions for a conveyor system.", seoTitle: "Legacy guide", seoDescription: "A clear description of process and selection conditions for a conveyor system before making a practical equipment choice.", slug: "legacy-guide", content: "- Belt width\n- Burden depth\n\nThis paragraph remains a paragraph." });
  assert.equal(document.sections.length, 1);
  assert.equal(document.sections[0].blocks[0].type, "bullets");
  assert.equal(document.sections[0].blocks[1].type, "paragraph");
  assert.doesNotMatch(document.sections[0].heading, /Update Note|Industry Update/);
});
