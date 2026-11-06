import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Settings2, Workflow, ClipboardList } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { MetaProductView } from "@/components/MetaProductView";
import { ProductImageViewer } from "@/components/ProductImageViewer";
import { ProductDetailSectionTabs } from "@/components/ProductDetailPanels";
import { products, type Product } from "@/data/products";
import { site } from "@/data/site";
import { getProductDetailProfile, getProductDisplayName, getProductFamily, productSeoDescription, productSeoTitle } from "@/data/productDetailProfiles";
import { cleanProductSpecs, getProductInquiryModel } from "@/lib/productDisplay";
import { productCategoryPages } from "@/lib/productCategories";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { getLocalizedProductSummary } from "@/lib/productLocale";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
import { getOriginalContentLabels } from "@/lib/contentOriginalLocale";
import { productPageSchema } from "@/lib/productPageSchema";
import type { ProductSection } from "@/lib/productSections";

type ProductDetailExperienceProps = {
  product: Product;
  locale?: Locale;
  initialSection?: ProductSection;
};

const industryLabels: Record<string, string> = {
  mining: "Mining and mineral processing",
  recycling: "Recycling and metal recovery",
  "cement-aggregate": "Cement and aggregate",
  "food-processing": "Food and grain processing"
};

function routeFor(locale: Locale | undefined, path: string) {
  return locale ? localizeHref(path, locale) : path;
}

function industryRoute(slug: string) {
  return `/industries/${slug === "food-processing" ? "food" : slug}`;
}

function modelDesignations(product: Product) {
  const models = cleanProductSpecs(product.specs)
    .filter((spec) => spec.label.trim().toLowerCase() === "model")
    .map((spec) => spec.value.trim());
  return [...new Set(models)];
}

function technicalRows(product: Product, technicalFields: string[]) {
  const publishedModels = cleanProductSpecs(product.specs)
    .filter((spec) => spec.label.trim().toLowerCase() === "model" && spec.value.trim());
  const rows = technicalFields.map((field) => ({ label: field, value: "Available on request", confirmed: false }));
  const modelIndex = rows.findIndex((row) => row.label.trim().toLowerCase() === "model");
  if (modelIndex >= 0 && publishedModels.length) rows[modelIndex] = { label: rows[modelIndex].label, value: publishedModels.map((item) => item.value.trim()).join(" / "), confirmed: true };
  return rows;
}

function hasModelSpecificationTable(product: Product) {
  const table = product.specificationTable;
  return Boolean(table && table.columns.length && table.rows.length && table.rows.every((row) => row.length === table.columns.length));
}

function relatedProducts(product: Product) {
  const family = getProductFamily(product);
  const sameFamily = products.filter((item) => item.slug !== product.slug && getProductFamily(item) === family);
  const sameCategory = products.filter((item) => item.slug !== product.slug && item.category === product.category && !sameFamily.some((match) => match.slug === item.slug));
  return [...sameFamily, ...sameCategory].slice(0, 3);
}

function ProductProcess({ steps }: { steps: string[] }) {
  return (
    <ol className="product-process-flow" aria-label="Typical process position">
      {steps.map((step, index) => (
        <li key={step}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{step}</strong>
        </li>
      ))}
    </ol>
  );
}

function SelectionChecklist({ items }: { items: string[] }) {
  return (
    <ul className="product-checklist">
      {items.map((item) => <li key={item}><CheckCircle2 size={17} aria-hidden />{item}</li>)}
    </ul>
  );
}

export function ProductDetailExperience({ product, locale, initialSection = "overview" }: ProductDetailExperienceProps) {
  const profile = getProductDetailProfile(product);
  const productUi = getPublicUi(locale || "en");
  const displayName = getLocalizedProductTitle(product, locale || "en");
  const pagePath = routeFor(locale, `/products/${product.slug}`);
  const quotePath = `${routeFor(locale, "/request-quote")}?product=${encodeURIComponent(product.slug)}&family=${encodeURIComponent(profile.family)}`;
  const models = modelDesignations(product);
  const inquiryModel = getProductInquiryModel(product);
  const specs = technicalRows(product, profile.technicalFields);
  const hasSpecificationTable = hasModelSpecificationTable(product);
  // Legacy gallery imports may contain a third-party logo, QR code or unrelated visual.
  // Only the primary product image is published until each extra image is editorially verified.
  const gallery = [product.image];
  const related = relatedProducts(product);
  const productCategories = productCategoryPages.map((category) => ({
    ...category,
    count: products.filter((item) => item.category === category.category).length
  }));
  const shareMessage = encodeURIComponent(`Hello COWIN MAGNET, I am reviewing ${displayName}. Product page: ${absoluteUrl(pagePath)}. Please help with configuration.`);
  const pageSchema = productPageSchema({
    name: displayName,
    description: productSeoDescription(product),
    imageUrls: gallery.map((image) => absoluteUrl(image)),
    url: absoluteUrl(pagePath)
  });
  const breadcrumbs = [
    { name: "Home", path: locale ? `/${locale}` : "/" },
    { name: "Products", path: routeFor(locale, "/products") },
    { name: displayName, path: pagePath }
  ];

  // The English editorial profiles are extensive, but are not translations.
  // Other locales use a concise, fact-bounded page until each detailed
  // technical profile has a reviewed translation. Never present English prose
  // under a non-English document language.
  if (locale && locale !== "en") {
    const t = getDictionary(locale);
    const ui = getPublicUi(locale);
    const categoryIndex = productCategories.findIndex((category) => category.category === product.category);
    const localizedCategory = ui.productCategories[categoryIndex] || product.category;
    const summary = getLocalizedProductSummary(product, locale);
    const original = getOriginalContentLabels(locale);
    const localizedBreadcrumbs = [
      { name: ui.home, path: `/${locale}` },
      { name: t.nav.products, path: routeFor(locale, "/products") },
      { name: displayName, path: pagePath }
    ];
    const localizedShareMessage = encodeURIComponent(`${displayName} — ${ui.productInstruction} ${absoluteUrl(pagePath)}`);
    const industrySlugs = ["recycling", "mining", "cement-aggregate", "food-processing"];

    return <>
      <JsonLd data={productPageSchema({ name: displayName, description: summary, imageUrls: gallery.map((image) => absoluteUrl(image)), url: absoluteUrl(pagePath) })} />
      <JsonLd data={breadcrumbSchema(localizedBreadcrumbs)} />
      <MetaProductView name={displayName} category={product.category} slug={product.slug} />
      <div className="inner-page product-detail-experience">
        <nav className="product-breadcrumb" aria-label={t.nav.products}>
          {localizedBreadcrumbs.map((item, index) => <span key={item.path}>{index === localizedBreadcrumbs.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}{index < localizedBreadcrumbs.length - 1 ? <i aria-hidden>/</i> : null}</span>)}
        </nav>
        <section className="product-detail-hero">
          <ProductImageViewer src={product.image} title={displayName} openLabel={ui.openImage} closeLabel={ui.closeMenu} />
          <div className="product-hero-copy">
            <div className="product-hero-meta"><span>{localizedCategory}</span>{models.length ? <span>{ui.productModel}: {models.join(" / ")}</span> : null}</div>
            <h1>{displayName}</h1>
            <p>{summary}</p>
            <a className="text-link product-spec-link" href={`${pagePath}?section=technical#product-sections`}>{ui.productTabs[3]} <ArrowRight size={16} aria-hidden /></a>
            <div className="product-hero-actions">
              <Link className="btn btn-primary" href={quotePath}>{t.common.getQuote} <ArrowRight size={17} aria-hidden /></Link>
              <a className="btn btn-secondary" href={`https://wa.me/${site.whatsapp}?text=${localizedShareMessage}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="product-hero" data-whatsapp-component="product-detail" data-whatsapp-product-slug={product.slug} data-whatsapp-product-name={displayName}><MessageCircle size={17} aria-hidden /> WhatsApp</a>
            </div>
          </div>
        </section>
        <div className="product-detail-workspace">

          <div className="product-detail-content">
            <ProductDetailSectionTabs initialSection={initialSection} />
            <section data-product-panel="overview" hidden={initialSection !== "overview"} className="product-detail-section product-overview-section"><div className="product-detail-section-heading"><span className="eyebrow">{t.productDetail.overview}</span><h2>{displayName}</h2></div><div className="product-prose"><p>{summary}</p><p>{original.product} <Link href={`/en/products/${product.slug}`} hrefLang="en">{original.link}</Link></p></div></section>
            <section data-product-panel="selection" hidden={initialSection !== "selection"} className="product-detail-section product-selection-section"><div className="product-selection-copy"><span className="eyebrow">{ui.productTabs[1]}</span><h2>{t.productDetail.ctaTitle}</h2><p>{ui.productInstruction}</p></div><div className="product-selection-cta"><p>{t.productDetail.ctaText}</p><Link className="btn btn-primary" href={quotePath}>{t.common.getQuote} <ArrowRight size={17} aria-hidden /></Link></div></section>
            <section data-product-panel="applications" hidden={initialSection !== "applications"} className="product-detail-section product-materials-section"><div className="product-detail-section-heading"><span className="eyebrow">{ui.productTabs[2]}</span><h2>{t.productDetail.industries}</h2></div><div className="product-industry-links">{profile.industrySlugs.map((slug) => { const index = industrySlugs.indexOf(slug); return <Link href={routeFor(locale, industryRoute(slug))} key={slug}><span>{index >= 0 ? ui.industryMenu[index][0] : slug}</span><ArrowRight size={16} aria-hidden /></Link>; })}</div></section>
            <section data-product-panel="technical" hidden={initialSection !== "technical"} className="product-detail-section product-specification-section"><div className="product-detail-section-heading"><span className="eyebrow">{ui.productTabs[3]}</span><h2>{t.productDetail.specifications}</h2><p>{ui.technicalNotice}</p></div>{models.length ? <div className="product-specification-table" role="table" aria-label={t.productDetail.specifications}><div role="row"><span>{ui.productModel}</span><strong>{models.join(" / ")}</strong></div></div> : null}</section>
            <section data-product-panel="support" hidden={initialSection !== "support"} className="product-final-cta" aria-labelledby="product-final-cta-title"><div className="product-final-media"><Image src={product.image} alt={displayName} width={660} height={440} sizes="(max-width: 900px) 100vw, 46vw" /></div><div className="product-final-form"><span className="eyebrow">{t.productDetail.quoteTitle}</span><h2 id="product-final-cta-title">{t.productDetail.ctaTitle}</h2><p>{t.productDetail.ctaText}</p><QuoteForm compact productContext={{ name: displayName, model: inquiryModel, family: profile.family }} /></div></section>
          </div>
        </div>
      </div>
      <div className="product-mobile-actions" aria-label={t.common.contactSales}><Link href={quotePath}>{t.common.getQuote}</Link><a href={`https://wa.me/${site.whatsapp}?text=${localizedShareMessage}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="product-final-cta" data-whatsapp-component="product-detail" data-whatsapp-product-slug={product.slug} data-whatsapp-product-name={displayName}>WhatsApp</a></div>
    </>;
  }

  return (
    <>
      <JsonLd data={pageSchema} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(profile.faqs)} />
      <MetaProductView name={displayName} category={product.category} slug={product.slug} />

      <div className="inner-page product-detail-experience">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((item, index) => (
            <span key={item.path}>
              {index === breadcrumbs.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}
              {index < breadcrumbs.length - 1 ? <i aria-hidden>/</i> : null}
            </span>
          ))}
        </nav>

        <section className="product-detail-hero">
          <ProductImageViewer src={product.image} title={displayName} openLabel={productUi.openImage} closeLabel={productUi.closeMenu} />
          <div className="product-hero-copy">
            <div className="product-hero-meta">
              <Link href={routeFor(locale, `/products/${productCategories.find((category) => category.category === product.category)?.slug || ""}`)}>{product.category}</Link>
              {models.length ? <span>Model: {models.join(" / ")}</span> : null}
            </div>
            <h1>{displayName}</h1>
            <p>{profile.overview[0].split(/(?<=\.)\s+/)[0]}</p>
            <a className="text-link product-spec-link" href={`${pagePath}?section=technical#product-sections`}>{productUi.productTabs[3]} <ArrowRight size={16} aria-hidden /></a>
            <dl className="product-quick-facts">
              {profile.quickFacts.slice(0, 3).map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
            <div className="product-hero-actions">
              <Link className="btn btn-primary" href={quotePath}>Request a Quote <ArrowRight size={17} aria-hidden /></Link>
              <a className="btn btn-secondary" href={`https://wa.me/${site.whatsapp}?text=${shareMessage}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="product-hero" data-whatsapp-component="product-detail" data-whatsapp-product-slug={product.slug} data-whatsapp-product-name={displayName}><MessageCircle size={17} aria-hidden /> WhatsApp</a>
            </div>

          </div>
        </section>

        <div className="product-detail-workspace">


          <div className="product-detail-content">
            <ProductDetailSectionTabs initialSection={initialSection} />

        <section id="overview" data-product-panel="overview" hidden={initialSection !== "overview"} className="product-detail-section product-overview-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Product role</span>
            <h2>Overview</h2>
          </div>
          <div className="inner-product-overview">
            <div className="product-prose">{profile.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="inner-process-band"><h3><Workflow size={19} aria-hidden /> How it fits your process</h3><ProductProcess steps={profile.processSteps} /></div>
          </div>
          <div className="inner-guide-grid inner-product-guides"><article><div className="inner-icon"><Settings2 size={22} aria-hidden /></div><div><h3>Configuration review</h3><p>{profile.configurationOptions[0]}</p><a className="text-link" href={`${pagePath}?section=selection`}>Selection and installation</a></div></article><article><div className="inner-icon"><ClipboardList size={22} aria-hidden /></div><div><h3>Technical information</h3><p>{productUi.technicalNotice}</p><a className="text-link" href={`${pagePath}?section=technical`}>Review technical data</a></div></article></div>
        </section>

        <section id="selection" data-product-panel="selection" hidden={initialSection !== "selection"} className="product-detail-section product-configuration-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Selection logic</span>
            <h2>Why this configuration needs site information</h2>
          </div>
          <div className="product-value-grid">
            {profile.whyPoints.map((point, index) => (
              <article key={point.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-product-panel="applications" hidden={initialSection !== "applications"} className="product-detail-section product-process-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Process position</span>
            <h2>Where it fits in a typical material flow</h2>
            <p>The diagram is a planning aid. Final positioning is confirmed from the line layout and the material duty.</p>
          </div>
          <ProductProcess steps={profile.processSteps} />
        </section>

        {product.engineeringDiagrams?.length ? (
          <section data-product-panel="selection" hidden={initialSection !== "selection"} className="product-detail-section product-engineering-diagrams">
            <div className="product-detail-section-heading">
              <span className="eyebrow">Engineering reference</span>
              <h2>Installation and dimensional reference</h2>
              <p>These diagrams support preliminary discussion. Final dimensions and installation details are confirmed for the selected configuration.</p>
            </div>
            <div className="product-engineering-diagram-grid">
              {product.engineeringDiagrams.map((diagram) => (
                <figure key={diagram.src}>
                  <Image src={diagram.src} alt={diagram.alt} width={960} height={640} sizes="(max-width: 760px) 100vw, 48vw" />
                  <figcaption>{diagram.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section id="applications" data-product-panel="applications" hidden={initialSection !== "applications"} className="product-detail-section product-materials-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Applications</span>
            <h2>Typical materials and industry contexts</h2>
          </div>
          <div className="product-materials-layout">
            <div className="product-tag-list" aria-label="Typical materials">
              {profile.materials.map((material) => <span key={material}>{material}</span>)}
            </div>
            <div className="product-industry-links">
              {profile.industrySlugs.map((slug) => (
                <Link href={routeFor(locale, industryRoute(slug))} key={slug}>
                  <span>{industryLabels[slug] || slug}</span><ArrowRight size={16} aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="technical-data" data-product-panel="technical" hidden={initialSection !== "technical"} className="product-detail-section product-specification-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Technical information</span>
            <h2>Technical specifications and confirmation basis</h2>
            <p>Published model references are shown where available. Final technical details are confirmed from current product records, material and site conditions.</p>
          </div>
          {hasSpecificationTable ? (
            <div className="product-model-table-scroll">
              <table className="product-model-specification-table">
                <caption>{product.specificationTable?.sourceLabel}</caption>
                <thead><tr>{product.specificationTable?.columns.map((column, index) => <th scope="col" key={`${column}-${index}`}>{column}</th>)}</tr></thead>
                <tbody>{product.specificationTable?.rows.map((row, rowIndex) => <tr key={`${row[0]}-${rowIndex}`}>{row.map((value, valueIndex) => <td key={`${value}-${valueIndex}`}>{value}</td>)}</tr>)}</tbody>
              </table>
            </div>
          ) : (
            <div className="product-specification-table" role="table" aria-label={`${product.name} technical specifications`}>
              <div className="product-specification-head" role="row"><span>Parameter</span><span>Published record</span><span>Selection confirmation</span></div>
              {specs.map((spec) => <div role="row" key={`${spec.label}-${spec.value}`}><span>{spec.label === "Model" ? "Model designation" : spec.label}</span><strong>{spec.value}</strong><span>{spec.confirmed ? "Published model reference. Final configuration is confirmed for the project." : "To be confirmed based on material and site conditions."}</span></div>)}
            </div>
          )}
        </section>

        <section data-product-panel="selection" hidden={initialSection !== "selection"} className="product-detail-section product-options-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Configuration</span>
            <h2>Configuration points to review</h2>
          </div>
          <div className="product-options-grid">
            {profile.configurationOptions.map((option) => <div key={option}><CheckCircle2 size={17} aria-hidden /><span>{option}</span></div>)}
          </div>
        </section>

        <section data-product-panel="selection" hidden={initialSection !== "selection"} className="product-detail-section product-selection-section">
          <div className="product-selection-copy">
            <span className="eyebrow">Selection checklist</span>
            <h2>What to send for an initial configuration review</h2>
            <SelectionChecklist items={profile.selectionNotes} />
            <h3>Important boundary</h3>
            <ul className="product-limitations">
              {profile.limitations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="product-selection-cta">
            <p>Send the process details with the product pre-selected in the inquiry form.</p>
            <Link className="btn btn-primary" href={quotePath}>Start product inquiry <ArrowRight size={17} aria-hidden /></Link>
          </div>
        </section>

        <section className="product-detail-section product-related-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Process equipment</span>
            <h2>Related products for the same process line</h2>
          </div>
          <div className="product-related-grid">
            {related.map((item) => (
              <Link href={routeFor(locale, `/products/${item.slug}`)} key={item.slug}>
                <Image src={item.image} alt={getProductDisplayName(item)} width={320} height={220} sizes="(max-width: 700px) 86vw, 20vw" />
                <span>{item.category}</span>
                <h3>{getProductDisplayName(item)}</h3>
                <strong>View product <ArrowRight size={15} aria-hidden /></strong>
              </Link>
            ))}
          </div>
        </section>

        <section data-product-panel="support" hidden={initialSection !== "support"} className="product-detail-section product-faq-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Product FAQ</span>
            <h2>Questions to resolve before ordering</h2>
          </div>
          <div className="product-faq-list">
            {profile.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </section>

        <section data-product-panel="support" hidden={initialSection !== "support"} className="product-final-cta" aria-labelledby="product-final-cta-title">
          <div className="product-final-media"><Image src={product.image} alt={`${displayName} inquiry support`} width={660} height={440} sizes="(max-width: 900px) 100vw, 46vw" /></div>
          <div className="product-final-form">
            <span className="eyebrow">Request a quote</span>
            <h2 id="product-final-cta-title">Share the operating conditions for {displayName}</h2>
            <p>Share your material, throughput and installation details so we can review the right configuration.</p>
            <QuoteForm compact productContext={{ name: product.name, model: inquiryModel, family: profile.family, selectionFields: profile.selectionFields }} />
          </div>
        </section>
          </div>
        </div>
      </div>
      <div className="product-mobile-actions" aria-label="Product contact actions">
        <Link href={quotePath}>Request a Quote</Link>
        <a href={`https://wa.me/${site.whatsapp}?text=${shareMessage}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="product-final-cta" data-whatsapp-component="product-detail" data-whatsapp-product-slug={product.slug} data-whatsapp-product-name={displayName}>WhatsApp</a>
      </div>
    </>
  );
}

export { productSeoDescription, productSeoTitle };
