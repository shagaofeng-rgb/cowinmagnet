import crypto from "node:crypto";
import { validateArticleDocument } from "./articleDocument.js";
import { hasDirectCowinNewsScopeSignal } from "./news/scopeGate.js";

const CTA = {
  heading: "Discuss your material-handling conditions",
  text: "Share the material, process position and site constraints for a focused configuration discussion.",
  label: "Discuss Your Application",
  href: "/en/request-quote"
};

function hash(value = "") {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function pick(value, options) {
  return options[parseInt(hash(value).slice(0, 8), 16) % options.length];
}

function clean(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function classify(post = {}) {
  const context = `${post.slug || ""} ${post.title || ""} ${post.sourceTitle || ""}`.toLowerCase();
  if (/food|grain|flour|beverage|restaurant|chicken|spaghetti|listeria|salmonella|hygien|campylobacter/.test(context)) {
    return {
      industry: "dry ingredient and process-material handling",
      equipment: "magnetic bars, grates and drawer-style magnetic filters",
      purpose: "capture ferrous fragments in gravity-fed or enclosed material flows",
      checks: ["material flow behaviour and the risk of bridging", "available opening size, pipe route or chute arrangement", "cleaning access and safe handling of captured material", "contact-material, temperature and cleaning requirements"],
      limits: "Magnetic filtration does not replace every foreign-body control measure. The right arrangement depends on the material and the place in the process where the risk is being managed."
    };
  }
  if (/recycl|waste|scrap|battery|plastic|metal sorting|shred|landfill|circular/.test(context)) {
    return {
      industry: "recycling and resource-recovery material handling",
      equipment: "self-cleaning suspended magnets and downstream metal-separation equipment",
      purpose: "remove ferrous material before it can damage, contaminate or complicate later processing",
      checks: ["feed composition and the expected size of ferrous pieces", "conveyor width, burden depth, belt speed and transfer positions", "space for an overhead unit, discharge path and routine access", "the intended relationship between ferrous removal and later sorting stages"],
      limits: "Ferrous removal, non-ferrous recovery and metal detection are different duties. A line should be reviewed as a sequence rather than treating one device as a substitute for every separation step."
    };
  }
  if (/cement|aggregate|quarry|crusher|conveyor|bulk|liner|building material/.test(context)) {
    return {
      industry: "aggregate, cement and bulk-material conveying",
      equipment: "suspended magnetic separators for conveyor protection",
      purpose: "remove tramp iron before it reaches crushers, screens or transfer equipment",
      checks: ["belt width, belt speed and material burden", "suspension height and the position of the magnet over the material stream", "the maximum likely ferrous contaminant and how it will be discharged", "maintenance clearance, guarding and safe clean-out procedures"],
      limits: "A magnet should not be specified from the conveyor width alone. Material depth, trajectory, contaminant size and installation access all influence whether a manual-clean or self-cleaning arrangement is appropriate."
    };
  }
  if (/electromagnetic|lithium|gold|nickel|copper|rare earth|ore|mining|mineral|tailing|coal|smelter/.test(context)) {
    return {
      industry: "mineral and heavy-duty material handling",
      equipment: "electromagnetic and permanent magnetic separation equipment",
      purpose: "protect equipment or support a defined magnetic separation stage within a material flow",
      checks: ["the material, particle range and whether the duty is protection, recovery or concentration", "feed depth, belt or slurry arrangement and the planned process position", "available electrical supply, cooling conditions and maintenance access where an electromagnet is considered", "the desired separation result and any upstream preparation needed before the magnetic stage"],
      limits: "Magnetic separation is not a universal mineral-processing answer. The appropriate method depends on the mineral response, feed condition and process objective, which should be reviewed against current site information."
    };
  }
  return {
    industry: "industrial material handling",
    equipment: "magnetic separation and contamination-control equipment",
    purpose: "address a defined ferrous-contamination or process-protection risk",
    checks: ["the material and the form of the unwanted ferrous material", "the available process position and material path", "operating conditions, maintenance access and safety controls", "the result required from the specific separation or inspection step"],
    limits: "Selection should be based on the actual material and site conditions. A general article cannot confirm the configuration for a specific conveyor, chute, pipe or processing line."
  };
}

function uniqueFocus(post, profile) {
  return pick(post.slug || post.title, [
    "process position and material path",
    "the information needed before a configuration discussion",
    "maintenance access and routine cleaning",
    "distinguishing equipment protection from material recovery",
    "how feed variation changes the selection conversation",
    "the handoff between operations, maintenance and procurement",
    "safe installation planning around an existing line",
    "building a useful site-information checklist"
  ]) || profile.purpose;
}

function titleFor(post, profile) {
  const focus = uniqueFocus(post, profile);
  const product = profile.equipment.split(" and ")[0].replace(/^./, (letter) => letter.toUpperCase());
  return `${product}: A Guide to ${focus}`.replace(/\s+/g, " ").slice(0, 110);
}

function metaFor(title, profile) {
  const base = `Practical selection guidance for ${profile.equipment.toLowerCase()} in ${profile.industry}, including process checks, installation conditions and configuration limits.`;
  return base.length <= 160 ? base : `${title}. Review material, process position and site conditions before confirming a configuration.`.slice(0, 160);
}

// The original automated pages frequently contained unrelated external facts.  This
// replacement deliberately publishes only stable, non-numeric engineering guidance.
// A record may return to indexing only when its original source was directly relevant.
export function createLegacyNewsRemediation(post = {}) {
  const profile = classify(post);
  const title = titleFor(post, profile);
  const metaDescription = metaFor(title, profile);
  const directSourceContext = clean([post.sourceTitle, post.sourceArticleTitle, post.sourceSummary, ...(post.sources || []).map((source) => source?.title)].filter(Boolean).join(" "));
  const sourceDirectlyRelevant = Boolean(post.sourceUrl) && hasDirectCowinNewsScopeSignal(directSourceContext);
  const publishedAt = post.publishedAt || post.createdAt;
  const document = {
    schemaVersion: 1,
    locale: post.locale || "en",
    contentType: "technical-guide",
    status: "published",
    title,
    summary: `A practical guide to reviewing ${profile.purpose} in ${profile.industry}. It explains the operating information that should be confirmed before a configuration is discussed.`,
    primaryTopic: `${profile.equipment} selection`,
    targetAudience: "Industrial buyers, process engineers and maintenance teams",
    ...(post.coverImage ? { heroImage: { assetId: post.coverImage, alt: `${profile.equipment} for ${profile.industry}` } } : {}),
    sections: [
      { heading: "The process question behind this guide", level: 2, blocks: [{ type: "paragraph", text: `This guide addresses how ${profile.equipment} may be reviewed when a line needs to ${profile.purpose}. The first question is not which product name to choose. It is where the unwanted material enters the line, how the main material travels, and what practical result is needed at that process point. A clear description of the material path gives operations and procurement teams a more useful starting point than a generic equipment comparison.` }] },
      { heading: "Where the equipment may fit", level: 2, blocks: [{ type: "paragraph", text: `In ${profile.industry}, the process position should be considered before any configuration is discussed. Equipment may be placed over a conveyor, at a transfer point, in a gravity-fed chute, within a pipe route, or at another controlled point in the material flow. The correct location depends on access to the material, the risk being managed and the handling steps that occur before and after it. Installation position should therefore be reviewed with the actual line layout rather than assumed from a general application description.` }] },
      { heading: "Information to prepare before selection", level: 2, blocks: [{ type: "checklist", items: profile.checks }] },
      { heading: "Configuration decisions that depend on site conditions", level: 2, blocks: [{ type: "paragraph", text: `A suitable configuration is affected by the material, the form and amount of ferrous contamination, the available space and the intended operating routine. Permanent and electromagnetic systems, manual and self-cleaning arrangements, or dry and wet separation methods serve different duties. The required confirmation should be tied to the actual process, including how material is fed, how captured material is handled and which upstream or downstream equipment must be protected.` }, { type: "callout", title: "Project confirmation", text: "Final configuration should be confirmed from material and site conditions. This guide does not state a performance value, capacity or configuration guarantee.", tone: "info" }] },
      { heading: "Common planning mistakes", level: 2, blocks: [{ type: "bullets", items: ["Choosing from a product name without recording the material path and the actual risk point.", "Treating equipment protection, ferrous recovery and non-ferrous sorting as the same duty.", "Ignoring clearance for installation, safe cleaning, maintenance and the discharge of captured material.", "Using a general article as a substitute for current line information and project-specific review."] }] },
      { heading: "A practical next step", level: 2, blocks: [{ type: "paragraph", text: `${profile.limits} A short, evidence-based review is often the most useful next step: collect the material description, line layout, operating constraints and desired outcome, then compare those conditions with the available equipment options. This makes it easier to identify what can be confirmed now and which points need further technical discussion.` }] }
    ],
    faq: [
      { question: "What information is most useful for an initial discussion?", answer: "Provide the material description, process position, dimensions or flow conditions, operating constraints and the result the line needs to achieve." },
      { question: "Can this guide confirm a final model or performance result?", answer: "No. Final selection depends on the actual material, installation conditions and confirmed project requirements." }
    ],
    sources: [],
    relatedContent: [],
    cta: CTA,
    seo: { metaTitle: `${title} | COWIN MAGNET`.slice(0, 60), metaDescription, canonicalPath: `/en/news/${post.slug}`, ogTitle: `${title} | COWIN MAGNET`.slice(0, 60), ogDescription: metaDescription, ...(post.coverImage ? { ogImageAssetId: post.coverImage } : {}) },
    author: { name: "COWIN MAGNET Editorial Team", profilePath: "/editorial-policy", role: "Editorial Team" },
    publishedAt,
    modifiedAt: new Date().toISOString()
  };
  const validation = validateArticleDocument(document);
  return { document: validation.document, validation, sourceDirectlyRelevant, profile };
}
