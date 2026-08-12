import { getCmsItemBySlug, saveCmsItem } from "./cmsStore.js";
import { updateCmsItemPublicationStatus } from "./cmsStore.js";
import { validateArticleDocument } from "./articleDocument.js";
import { recordNewsAuditEvent } from "./newsAutomationStore.js";

export const RCDD_SLUG = "selection-checklist-rcdd-self-cooling-self-dumping-electromagnetic-iron-remover";

export function rcddArticleDocument({ coverImage = "", publishedAt, modifiedAt = new Date().toISOString() } = {}) {
  return {
    schemaVersion: 1, locale: "en", contentType: "technical-guide", status: "published",
    title: "How to Select an RCDD Self-Cooling Electromagnetic Iron Remover.",
    summary: "A practical conveyor selection guide for reviewing material burden, installation space and electrical conditions before specifying an RCDD self-cooling self-dumping electromagnetic iron remover.",
    primaryTopic: "RCDD self-cooling electromagnetic iron remover selection", targetAudience: "Conveyor system engineers, plant operators and industrial procurement teams",
    ...(coverImage ? { heroImage: { assetId: coverImage, alt: "RCDD self-cooling self-dumping electromagnetic iron remover for conveyor applications" } } : {}),
    sections: [
      { heading: "When an RCDD Separator Is a Suitable Choice", level: 2, blocks: [{ type: "paragraph", text: "An RCDD arrangement is considered where a conveyor line needs electromagnetic overhead separation and continuous discharge of captured ferromagnetic tramp material. It is useful to discuss when manual cleaning would interrupt the process or when the risk of buried iron calls for a project-specific electromagnetic review. Final suitability depends on the actual material stream and site layout." }, { type: "bullets", items: ["Conveyor lines that need captured iron discharged away from the material stream.", "Applications where the expected tramp material, burden depth or working distance needs an electromagnetic selection review.", "Layouts with safe access for inspection, cleaning and maintenance activities."] }] },
      { heading: "Recommended Installation Position on a Conveyor", level: 2, blocks: [{ type: "paragraph", text: "The separator should be positioned above a defined conveyor or transfer point where the material trajectory and available clearance can be reviewed. The discharge path needs a safe falling area, and the support structure must allow the final suspension position and maintenance access to be confirmed before installation." }, { type: "callout", title: "Selection boundary", text: "A final mounting direction should be confirmed from the conveyor drawing, material path and available discharge space.", tone: "info" }] },
      { heading: "Information Required Before Selection", level: 2, blocks: [{ type: "checklist", items: ["Conveyor belt width, speed and direction of travel.", "Material description, particle range and approximate burden depth.", "Expected size and frequency of ferromagnetic tramp material.", "Available suspension height, transfer-point drawing and discharge clearance.", "Power supply, ambient conditions and required maintenance access."] }] },
      { heading: "Configuration Points to Confirm", level: 2, blocks: [{ type: "paragraph", text: "The magnetic circuit, cooling approach, self-dumping belt arrangement, support arrangement and electrical controls must match the final conveyor conditions. Configuration is to be confirmed from material and site conditions rather than assumed from a generic model name." }, { type: "bullets", items: ["Electromagnetic configuration and required working position.", "Self-dumping belt travel and safe discharge arrangement.", "Electrical supply and control interface requirements.", "Ambient dust, temperature and service-access conditions."] }] },
      { heading: "Common Selection Mistakes", level: 2, blocks: [{ type: "bullets", items: ["Selecting from belt width alone without confirming burden depth and suspension height.", "Leaving no protected space for the self-dumping discharge path.", "Treating the excitation supply and discharge drive as the same requirement.", "Confirming a model before sharing a conveyor layout, material details and electrical conditions."] }] }
    ],
    faq: [
      { question: "When should a self-dumping electromagnetic separator be considered?", answer: "It is commonly discussed when captured ferromagnetic material needs to be discharged continuously and the conveyor conditions warrant an electromagnetic overhead separation review." },
      { question: "Which conveyor details matter most?", answer: "Belt width, speed, burden depth, suspension height, material characteristics, expected tramp iron and the available discharge area are all relevant." },
      { question: "Can a model be selected from a product name alone?", answer: "No. The final configuration should be confirmed from the material stream, conveyor layout, electrical supply and maintenance conditions." },
      { question: "Does the separator require installation clearance?", answer: "Yes. Clearance is needed for the separator position, discharge path, support structure and safe maintenance access." },
      { question: "What should be supplied with an enquiry?", answer: "A conveyor drawing or photos, material description, belt data, proposed mounting position and site power details support a more useful review." }
    ],
    sources: [], relatedContent: [], cta: { heading: "Send Your Conveyor and Material Details", text: "Share the conveyor layout, material description and available installation space so the configuration can be reviewed against your site conditions.", label: "Send Your Conveyor and Material Details", href: "/en/request-quote" },
    seo: { metaTitle: "RCDD Electromagnetic Iron Remover Selection Guide", metaDescription: "Use this practical checklist to select an RCDD self-cooling self-dumping electromagnetic iron remover for conveyor systems. Review belt data, material conditions, installation clearance and electrical requirements.", canonicalPath: `/en/news/${RCDD_SLUG}`, ogTitle: "How to Select an RCDD Self-Cooling Electromagnetic Iron Remover", ogDescription: "A practical RCDD conveyor selection checklist covering material conditions, installation clearance and electrical requirements.", ...(coverImage ? { ogImageAssetId: coverImage } : {}) },
    author: { name: "COWIN MAGNET Editorial Team", profilePath: "/editorial-policy", role: "Editorial Team" }, publishedAt, modifiedAt
  };
}

export async function remediateRcddGuide() {
  const old = await getCmsItemBySlug("news", RCDD_SLUG, { includeInactive: true });
  if (!old) throw new Error(`RCDD article not found: ${RCDD_SLUG}`);
  const document = rcddArticleDocument({ coverImage: old.coverImage || "", publishedAt: old.publishedAt || old.createdAt });
  const validation = validateArticleDocument(document, { allowLegacyMetaOverride: true });
  if (!validation.passed) throw new Error(`RCDD validation failed: ${validation.errors.join(",")}`);
  const next = {
    ...old, title: document.title, h1: document.title, excerpt: document.summary, seoTitle: document.seo.metaTitle, seoDescription: document.seo.metaDescription,
    contentType: "technical-guide", category: "technical-guide", categoryTitle: "Technical Guide", articleDocument: document,
    sources: [], sourceUrl: undefined, sourcePublisher: undefined, sourcePublishedAt: undefined, faqs: document.faq,
    editorialStatus: "remediated-validated", seoIndexable: true, status: "published", updatedAt: document.modifiedAt,
    legacyContentBackup: old.legacyContentBackup || old.content || old.sections || null, content: undefined, sections: undefined, editorialDisclaimer: undefined
  };
  await saveCmsItem(next);
  await recordNewsAuditEvent({ siteId: old.siteId || "cowinmagnet-production", eventType: "content_remediated", entityType: "news_article", entityId: old.id, details: { slug: RCDD_SLUG, action: "structured-rewrite", validation: { passed: validation.passed, warnings: validation.warnings } } });
  return { slug: RCDD_SLUG, validation };
}

export async function verifyRemediatedArticle({ slug = RCDD_SLUG, fetcher = fetch } = {}) {
  const origin = (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.cowinmagnet.com").replace(/\/$/, "");
  const url = `${origin}/en/news/${slug}`;
  const response = await fetcher(url, { cache: "no-store", headers: { "cache-control": "no-cache" } });
  const html = await response.text();
  const checks = {
    http200: response.status === 200,
    oneVisibleH1: (html.match(/<h1[\s>]/gi) || []).length === 1,
    titleVisible: html.includes("How to Select an RCDD Self-Cooling Electromagnetic Iron Remover."),
    canonical: html.includes(`/en/news/${slug}`),
    articleSchema: /application\/ld\+json/i.test(html) && /"@type":"Article"|&quot;@type&quot;:&quot;Article&quot;/i.test(html),
    noPlaceholder: !/Update Note\s*\d+|Source and method note|AI Citation Ready|CMS Publishing Checklist|Original Source/i.test(html),
    noMiningReference: !/im-mining\.com|Mining Magazine/i.test(html),
    singleFaq: (html.match(/<h2>FAQ<\/h2>/gi) || []).length === 1,
    ctaWorks: /<a[^>]+href="\/en\/request-quote"[^>]*>Send Your Conveyor and Material Details/i.test(html)
  };
  return { url, checks, passed: Object.values(checks).every(Boolean) };
}

export async function markArticleNeedsRevision(slug, reason) {
  const post = await getCmsItemBySlug("news", slug, { includeInactive: true });
  if (!post) return;
  await saveCmsItem({ ...post, articleDocument: { ...(post.articleDocument || {}), status: "needs_revision", modifiedAt: new Date().toISOString() }, seoIndexable: false, editorialStatus: "delivery-failed", remediationFailure: reason, status: "published" });
  await updateCmsItemPublicationStatus("news", slug, { status: "published", editorialStatus: "needs-revision" });
}
