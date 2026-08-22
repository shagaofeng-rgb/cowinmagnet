function clean(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function titleCase(value = "") {
  return clean(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value = "") {
  return clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

function countWords(value = "") {
  return clean(value).split(/\s+/).filter(Boolean).length;
}

function readableDate(value = "") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return clean(value);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function documentWords(document = {}) {
  const sections = (document.sections || []).flatMap((section) => (section.blocks || []).flatMap((block) => [block.text || "", ...(block.items || [])]));
  const faqs = (document.faq || []).flatMap((entry) => [entry.question, entry.answer]);
  return countWords([document.title, document.summary, ...sections, ...faqs].join(" "));
}

function completeDescription(value = "") {
  let description = clean(value);
  if (description.length < 70) description = `${description} Review the application conditions and relevant industry context before selecting a configuration.`;
  if (description.length > 160) description = description.slice(0, 160).replace(/\s+\S*$/, "").replace(/[,:;\-]+$/, "").trim();
  if (/\b(and|or|with|for|includes)$/i.test(description)) description = description.replace(/\b(and|or|with|for|includes)$/i, "considerations").trim();
  if (!/[.!?]$/.test(description)) description += ".";
  return description;
}

export function buildProductFirstTopicBrief({ product, candidate, citation } = {}) {
  const productName = clean(product?.productName);
  const industry = titleCase(candidate?.industry || "industrial material handling");
  const application = clean(candidate?.applicationScenario || industry);
  return {
    productName,
    industry,
    application,
    primaryTopic: clean(candidate?.primaryKeyword || `${productName} for ${application}`),
    sourceTitle: clean(citation?.title || candidate?.title),
    sourcePublisher: clean(citation?.publisher || candidate?.publisher),
    sourceUrl: clean(citation?.canonicalUrl || candidate?.canonicalUrl),
    sourceSummary: clean(citation?.editorialSummary),
    requiredHeadings: [
      "Product role in this application",
      "Where it fits in the process",
      "Application conditions that affect selection",
      "What the configuration can support",
      "Information to provide before a product discussion",
      "Recent industry reporting",
      "Practical takeaway"
    ]
  };
}

function applicationProfile(product = {}, brief = {}) {
  const identity = `${product.slug || ""} ${product.category || ""} ${brief.productName || ""}`.toLowerCase();
  if (identity.includes("wet-drum")) {
    return {
      role: "In a mineral slurry circuit, the Wet Drum Magnetic Separator is considered where the process requires a magnetic fraction to be separated from a wet feed. The site must still establish mineralogy, particle behavior and the intended process objective before a configuration is discussed.",
      position: "Review the equipment against the actual slurry circuit, such as a stage after preparation or classification, a recovery step, or another defined separation point. The material path, product streams, water conditions and access around that point should be identified on the plant flow sheet rather than inferred from a general mineral-processing diagram.",
      selection: "Selection questions should start with the mineral to be handled, its liberation condition, feed size and slurry behavior. Concentration, process water, throughput objective and the required destination of each stream affect how a wet separation duty should be evaluated. No universal recovery or capacity result can be inferred from an article or a product category.",
      checklist: ["Mineral type, mineralogy information and the separation objective.", "Feed size, liberation information and slurry concentration or water conditions.", "The proposed circuit position and the required destination for separated streams.", "Available utilities, installation space, inspection access and operating constraints."],
      configuration: "A configuration discussion can clarify the product role in the wet circuit, the information that must be confirmed for the relevant separation stage and any model-specific information available for review. It cannot promise recovery, grade, capacity or operating limits before the actual material and process conditions have been assessed.",
      faq: "Why is test work relevant to a wet drum discussion?",
      faqAnswer: "Mineral behavior, liberation and slurry conditions influence the process objective. Relevant test work and site data help determine what should be confirmed before a configuration is considered."
    };
  }
  if (identity.includes("drawer-magnet") || identity.includes("magnetic components")) {
    return {
      role: "In a dry, gravity-fed material stream, the Drawer Magnet is considered where a process team needs to capture ferrous contamination while maintaining a workable inspection and cleanout routine. Material flow, the risk of bridging and the available access around the installation point must be reviewed for the specific line.",
      position: "The proposed position should be mapped to the gravity drop, chute, hopper or other confirmed transfer point where material passes through the filter arrangement. The team should establish whether the stream is free flowing, whether material can build up, and how a planned cleanout can be completed without disrupting an unsafe part of the process.",
      selection: "Selection should consider the material form, particle size, flowability, moisture, temperature, any product-contact requirement, opening dimensions and cleaning access. A powder that bridges or adheres can call for a different process approach; it should not be treated as a routine gravity-flow duty without site confirmation.",
      checklist: ["Material type, particle characteristics, flow behavior and moisture condition.", "The proposed opening, connection arrangement and available clearance for service.", "The expected contamination-control objective and the existing process equipment nearby.", "Temperature, cleaning expectations and any confirmed product-contact or corrosion requirements."],
      configuration: "A configuration discussion can relate the verified Drawer Magnet category to the actual flow path, service access and product-contact questions. It cannot confirm sanitation suitability, capture performance or a final material specification where those conditions have not been supplied and approved.",
      faq: "When is a drawer magnet not the first configuration to discuss?",
      faqAnswer: "When the material is not reliably gravity fed, tends to bridge, has unusual temperature or cleaning requirements, or the installation cannot provide safe service access, the process conditions should be reviewed before selecting a filter arrangement."
    };
  }
  if (identity.includes("overband")) {
    return {
      role: "On a conveyor-fed bulk-material line, the Permanent Overband Magnetic Separator is considered where ferromagnetic tramp material needs to be removed before it can reach a downstream process. Its continuously running discharge belt makes it relevant to a continuous removal duty, while the actual material and installation conditions determine whether that role fits the line.",
      position: "Review the conveyor route and choose the proposed location from the real material path, with attention to transfer points, downstream equipment, belt geometry, available height and a safe discharge area. The installation direction and service space should be checked against the layout rather than selected from a catalogue image.",
      selection: "Useful selection information includes conveyor width, belt speed, burden depth, material density, likely tramp iron size or weight, suspension height and the expected discharge path. Dust, moisture, guarding, electrical supply for the discharge belt and maintenance clearance can also affect whether a continuous self-cleaning arrangement is appropriate.",
      checklist: ["Conveyor width, belt speed, burden depth and available suspension height.", "Material description, density and the likely type, size and weight of tramp iron.", "Proposed in-line or cross-belt position, discharge area and maintenance clearance.", "Dust, moisture, ambient conditions, guarding, electrical supply and site safety constraints."],
      configuration: "A configuration discussion can relate the confirmed product category to conveyor geometry, tramp-iron risk and the space required for continuous discharge. It cannot promise a capture result, field value, motor rating or production outcome until the actual conveyor and material conditions have been confirmed.",
      faq: "Is a permanent overband separator selected from an industry news headline?",
      faqAnswer: "No. The product is considered from conveyor geometry, material burden, tramp-iron risk and the required discharge arrangement. An external report is only context for the operational question."
    };
  }
  return {
    role: `${brief.productName} is considered where the confirmed product category may address a defined material-handling or separation task. The final role depends on the actual material, process position and operating conditions rather than on a general industry article.`,
    position: "Define the equipment position from the real process route, downstream risk and service access. A product category can indicate a starting point, while the final placement must be checked against the site layout and the intended process result.",
    selection: "Selection starts with verified site conditions, the material to be handled, the process objective, available dimensions, utilities, environment and maintenance access. These should be recorded before a final configuration is discussed.",
    checklist: ["Material description and the process task to be addressed.", "Current line layout, relevant dimensions and available installation clearance.", "Operating conditions, maintenance access and any site safety constraints.", "The expected integration point and the information still requiring confirmation."],
    configuration: "A configuration discussion can clarify the product role and the remaining information that must be confirmed before technical or commercial decisions are made. It is not a promise of throughput, performance, availability or a site result.",
    faq: "What should be confirmed before a configuration is discussed?",
    faqAnswer: "Confirm the material, process position, available dimensions, operating conditions, maintenance access and intended process outcome."
  };
}

export function createProductFirstNewsDocument({ site, candidate, productMedia, citation }) {
  const product = productMedia?.product;
  const brief = buildProductFirstTopicBrief({ product, candidate, citation });
  if (!brief.productName || !brief.sourceUrl || !brief.sourceSummary) throw new Error("product-first-brief-incomplete");

  const productSummary = clean(product?.verifiedSummary || `${brief.productName} is listed by COWIN MAGNET for configuration discussions based on material and site conditions.`);
  const productUrl = clean(productMedia?.snapshot?.productUrl || product?.publicUrl || "/en/products");
  const sourceDate = readableDate(citation?.publishedAt || candidate?.sourcePublishedAt || "the source publication date");
  const profile = applicationProfile(product, brief);
  const title = `${brief.primaryTopic}: Application Considerations`;
  const summary = `${brief.productName} is considered here for ${brief.application}. This article explains the product role, site information needed for a configuration discussion, and relevant context from a verified industry report.`;
  const document = {
    schemaVersion: 1,
    locale: site.publication_language,
    contentType: "news",
    status: "draft",
    title,
    summary,
    primaryTopic: brief.primaryTopic,
    targetAudience: "Industrial buyers, process engineers and operations teams",
    ...(productMedia?.snapshot?.src && productMedia?.snapshot?.alt ? {
      heroImage: {
        assetId: productMedia.snapshot.src,
        alt: productMedia.snapshot.alt,
        caption: brief.productName
      }
    } : {}),
    sections: [
      {
        heading: "Product role in this application",
        level: 2,
        blocks: [
          { type: "paragraph", text: `${brief.productName} is considered for ${brief.application} when a process team needs to define the equipment task before reviewing external industry context. ${productSummary} ${profile.role}` },
          { type: "paragraph", text: "For procurement and plant teams, the useful first question is what must be controlled in the material flow, where that condition occurs and which site facts are available. That keeps the article grounded in the product and application, instead of treating an external report as a specification or a claim about a particular project." }
        ]
      },
      {
        heading: "Where it fits in the process",
        level: 2,
        blocks: [
          { type: "paragraph", text: profile.position },
          { type: "paragraph", text: `This review should follow the material rather than a generic equipment diagram. Note how material enters the line, whether its condition changes through the process and where any unwanted ferrous material or quality risk can be addressed safely. It is also important to identify whether the priority is equipment protection, material cleanliness, recovery of a magnetic fraction or a different confirmed process requirement. Those objectives can lead to different configuration questions even within the same industry.` }
        ]
      },
      {
        heading: "Application conditions that affect selection",
        level: 2,
        blocks: [
          { type: "paragraph", text: profile.selection },
          { type: "paragraph", text: `The operating environment also matters. Dust, moisture, ambient conditions, guarding, local electrical arrangements and safety procedures can affect the configuration discussion and the practical installation sequence. These are not generic performance claims. They are the questions that help a buyer and supplier decide whether the verified product category is a reasonable path to investigate, or whether another product family or process change should be considered.` },
          { type: "checklist", items: [
            ...profile.checklist
          ] }
        ]
      },
      {
        heading: "What the configuration can support",
        level: 2,
        blocks: [
          { type: "paragraph", text: profile.configuration },
          { type: "paragraph", text: `COWIN MAGNET can use the supplied application details to coordinate product matching, technical communication, inspection discussion and export follow-up for industrial buyers. The value of that process is that product information, operating conditions and remaining uncertainties are made visible together. A buyer should still request confirmation for any model-specific figure, interface, option or operating limit that is important to the intended installation.` },
          { type: "paragraph", text: "Keeping this boundary explicit helps a buyer compare options without turning a product description into an unsupported engineering guarantee. The product page, source material and site information each serve a different purpose: the product page establishes the available category, the source report supplies external context, and the installation data determines whether a specific configuration should proceed to review." }
        ]
      },
      {
        heading: "Information to provide before a product discussion",
        level: 2,
        blocks: [
          { type: "paragraph", text: `A productive enquiry provides the information needed to relate a product category to a real application. Start with the material, the required process outcome and the existing equipment around the proposed position. Add drawings or photographs when they are available, but make clear which measurements and conditions have been confirmed on site. This avoids selecting a configuration from a headline, a catalogue image or a general description alone.` },
          { type: "paragraph", text: "It is useful to distinguish confirmed observations from estimates or open questions. State where the information came from, such as a line drawing, operating record or on-site measurement, and identify what still needs inspection. This gives the technical discussion a clear record of the decision inputs without presenting uncertain values as final product requirements." },
          { type: "bullets", items: [
            ...profile.checklist
          ] }
        ]
      },
      {
        heading: "Recent industry reporting",
        level: 2,
        blocks: [
          { type: "paragraph", text: `${brief.sourcePublisher} published "${brief.sourceTitle}" on ${sourceDate}. ${brief.sourceSummary}` },
          { type: "paragraph", text: `The report is used here as industry context, not as evidence about a COWIN MAGNET installation or a guarantee for another operation. Its practical value is to help plant managers, maintenance teams and procurement engineers ask whether the reported condition affects their own material path, equipment-protection approach or planning assumptions. The original report remains the authority for the facts it describes.` }
        ]
      },
      {
        heading: "Practical takeaway",
        level: 2,
        blocks: [
          { type: "paragraph", text: `Start with the product role and the process condition at your own site. Use the industry report to inform questions, not to substitute for site data. If ${brief.productName} appears relevant, compare the confirmed product scope with the material, location, access and operating conditions that actually apply. That sequence produces a more useful technical discussion than beginning with a general industry headline and trying to force a product connection afterward.` },
          { type: "paragraph", text: `Review the related product information before opening a configuration discussion: ${productUrl}. Provide only facts that can be checked, and mark unknown items for confirmation. This preserves a clear boundary between external reporting, COWIN MAGNET product information and the site-specific decisions that remain with the buyer and the final project review.` }
        ]
      }
    ],
    faq: [
      { question: profile.faq, answer: profile.faqAnswer },
      { question: "What should be confirmed before a configuration is discussed?", answer: profile.checklist.join(" ") },
      { question: "Does the industry report prove a result for another site?", answer: "No. A report may identify a relevant issue, but it does not confirm performance or suitability for a different installation." }
    ],
    sources: [{
      title: brief.sourceTitle,
      publisher: brief.sourcePublisher,
      url: brief.sourceUrl,
      ...(citation?.publishedAt ? { publishedAt: citation.publishedAt } : {}),
      accessedAt: citation?.accessedAt || new Date().toISOString(),
      relevanceNote: "This verified report is used only as directly relevant industry context for the product application discussed above.",
      editorialSummary: brief.sourceSummary,
      keyFacts: (citation?.keyFacts || []).map((item) => item.statement || item).filter(Boolean).slice(0, 3)
    }],
    relatedContent: [{ contentId: productUrl, relationship: "product" }],
    cta: { heading: "Discuss your application", text: "Share material, process position and site conditions for a configuration discussion.", label: "Discuss your application", href: "/en/request-quote" },
    seo: {
      metaTitle: `${brief.productName} for ${brief.application} | COWIN MAGNET`,
      metaDescription: completeDescription(`${brief.productName} for ${brief.application}. Review product role, site conditions and relevant industry context before a configuration discussion`),
      canonicalPath: `/en/news/${slugify(`${brief.productName}-${brief.application}-application-considerations`)}`,
      ogTitle: `${brief.productName} for ${brief.application} | COWIN MAGNET`,
      ogDescription: completeDescription(`${brief.productName} for ${brief.application}. Review product role, site conditions and relevant industry context before a configuration discussion`),
      ...(productMedia?.snapshot?.src ? { ogImageAssetId: productMedia.snapshot.src } : {})
    },
    author: { name: `${site.brand_name} Editorial Team`, profilePath: "/editorial-policy", role: "Editorial Team" }
  };
  return { slug: slugify(`${brief.productName}-${brief.application}-application-considerations`), document };
}

export function validateProductFirstNewsDocument(document = {}, { productName = "", sourceUrl = "" } = {}) {
  const errors = [];
  const product = clean(productName);
  const headings = (document.sections || []).map((section) => clean(section.heading).toLowerCase());
  const sourceIndex = headings.indexOf("recent industry reporting");
  const productIndex = headings.indexOf("product role in this application");
  const selectionIndex = headings.indexOf("application conditions that affect selection");
  const frontMatter = (document.sections || []).slice(0, 4).flatMap((section) => (section.blocks || []).flatMap((block) => [block.text || "", ...(block.items || [])])).join(" ");

  if (!product || !clean(document.title).toLowerCase().includes(product.toLowerCase())) errors.push("product-first-title-required");
  if (!product || !frontMatter.toLowerCase().includes(product.toLowerCase())) errors.push("product-first-body-required");
  if (productIndex !== 0) errors.push("product-first-section-order-invalid");
  if (selectionIndex < 2) errors.push("selection-section-must-precede-news");
  if (sourceIndex < 4) errors.push("industry-reporting-must-follow-product-application");
  if (!sourceUrl || !document.sources?.some((source) => {
    const summaryWords = countWords(source.editorialSummary);
    return clean(source.url) === clean(sourceUrl) && summaryWords >= 60 && summaryWords <= 120;
  })) errors.push("verified-source-summary-required");
  if ((document.sources || []).some((source) => !clean(source.relevanceNote))) errors.push("source-relevance-note-required");
  if (documentWords(document) < 1100) errors.push("product-first-document-too-short");
  return { passed: errors.length === 0, errors, wordCount: documentWords(document) };
}
