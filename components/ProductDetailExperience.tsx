import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { products, type Product } from "@/data/products";
import { site } from "@/data/site";
import { getProductDetailProfile, getProductDisplayName, getProductFamily, productSeoDescription, productSeoTitle } from "@/data/productDetailProfiles";
import { cleanProductSpecs } from "@/lib/productDisplay";
import { absoluteUrl, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { localizeHref, type Locale } from "@/lib/i18n";

type ProductDetailExperienceProps = {
  product: Product;
  locale?: Locale;
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

function modelReferences(product: Product) {
  const models = cleanProductSpecs(product.specs)
    .filter((spec) => spec.label.trim().toLowerCase() === "model")
    .map((spec) => spec.value.trim());
  return [...new Set(models)];
}

function relatedProducts(product: Product) {
  const family = getProductFamily(product);
  const sameFamily = products.filter((item) => item.slug !== product.slug && getProductFamily(item) === family);
  const sameCategory = products.filter((item) => item.slug !== product.slug && item.category === product.category && !sameFamily.some((match) => match.slug === item.slug));
  return [...sameFamily, ...sameCategory].slice(0, 5);
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

export function ProductDetailExperience({ product, locale }: ProductDetailExperienceProps) {
  const profile = getProductDetailProfile(product);
  const displayName = getProductDisplayName(product);
  const pagePath = routeFor(locale, `/products/${product.slug}`);
  const quotePath = `${routeFor(locale, "/request-quote")}?product=${encodeURIComponent(product.name)}&family=${encodeURIComponent(profile.family)}`;
  const models = modelReferences(product);
  // Legacy gallery imports may contain a third-party logo, QR code or unrelated visual.
  // Only the primary product image is published until each extra image is editorially verified.
  const gallery = [product.image];
  const related = relatedProducts(product);
  const shareMessage = encodeURIComponent(`Hello COWIN MAGNET, I am reviewing ${displayName}. Product page: ${absoluteUrl(pagePath)}. Please help with configuration.`);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    image: gallery.map((image) => absoluteUrl(image)),
    description: productSeoDescription(product),
    brand: { "@type": "Brand", name: site.name },
    seller: { "@type": "Organization", name: site.legalName },
    category: product.category,
    url: absoluteUrl(pagePath),
    ...(models.length ? { additionalProperty: models.map((model) => ({ "@type": "PropertyValue", name: "Model reference", value: model })) } : {})
  };
  const breadcrumbs = [
    { name: "Home", path: locale ? `/${locale}` : "/" },
    { name: "Products", path: routeFor(locale, "/products") },
    { name: displayName, path: pagePath }
  ];

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(profile.faqs)} />

      <main className="product-detail-experience">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          {breadcrumbs.map((item, index) => (
            <span key={item.path}>
              {index === breadcrumbs.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}
              {index < breadcrumbs.length - 1 ? <i aria-hidden>/</i> : null}
            </span>
          ))}
        </nav>

        <section className="product-detail-hero">
          <div className="product-media-panel">
            <a href={product.image} className="product-primary-image" target="_blank" rel="noopener noreferrer" aria-label={`Open full-size image of ${displayName}`}>
              <Image src={product.image} alt={displayName} width={920} height={680} priority sizes="(max-width: 920px) 100vw, 52vw" />
              <span>Open image <ExternalLink size={15} aria-hidden /></span>
            </a>
            {gallery.length > 1 ? (
              <div className="product-gallery" aria-label="Product image gallery">
                {gallery.slice(0, 6).map((image, index) => (
                  <a href={image} target="_blank" rel="noopener noreferrer" key={image} aria-label={`Open product image ${index + 1} of ${gallery.length}`}>
                    <Image src={image} alt={`${product.name} view ${index + 1}`} width={140} height={104} sizes="96px" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="product-hero-copy">
            <div className="product-hero-meta">
              <span>{product.category}</span>
              {models.length ? <span>Model: {models.join(" / ")}</span> : null}
              <span className={`product-content-status ${profile.contentStatus}`}>{profile.contentStatus === "sample-ready" ? "Technical content sample" : "Technical review in progress"}</span>
            </div>
            <h1>{displayName}</h1>
            <p>{profile.overview[0]}</p>
            <ul className="product-key-points" aria-label="Core product considerations">
              {profile.whyPoints.slice(0, 4).map((item) => <li key={item.title}><CheckCircle2 size={18} aria-hidden />{item.title}</li>)}
            </ul>
            <div className="product-hero-actions">
              <Link className="btn btn-primary" href={quotePath}>Request a Quote <ArrowRight size={17} aria-hidden /></Link>
              <a className="btn btn-secondary" href={`https://wa.me/${site.whatsapp}?text=${shareMessage}`} target="_blank" rel="noopener noreferrer nofollow"><MessageCircle size={17} aria-hidden /> WhatsApp</a>
            </div>
            <dl className="product-quick-facts">
              {profile.quickFacts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="product-detail-section product-overview-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Product role</span>
            <h2>Overview and how it fits the process</h2>
          </div>
          <div className="product-prose">
            {profile.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <section className="product-detail-section product-configuration-section">
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

        <section className="product-detail-section product-process-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Process position</span>
            <h2>Where it fits in a typical material flow</h2>
            <p>The diagram is a planning aid. Final positioning is confirmed from the line layout and the material duty.</p>
          </div>
          <ProductProcess steps={profile.processSteps} />
        </section>

        <section className="product-detail-section product-materials-section">
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
                <Link href={routeFor(locale, `/industries/${slug}`)} key={slug}>
                  <span>{industryLabels[slug] || slug}</span><ArrowRight size={16} aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="product-detail-section product-specification-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Technical information</span>
            <h2>Technical specifications and confirmation basis</h2>
            <p>Only model references found in the current product record are displayed as values. The remaining fields are confirmed against the selected configuration and site conditions.</p>
          </div>
          <div className="product-specification-table" role="table" aria-label={`${product.name} technical specifications`}>
            <div className="product-specification-head" role="row"><span>Parameter</span><span>Published record</span><span>Selection confirmation</span></div>
            {models.length ? models.map((model) => <div role="row" key={model}><span>Model reference</span><strong>{model}</strong><span>Confirm the requested configuration.</span></div>) : null}
            {profile.technicalFields.filter((field) => field !== "Model").map((field) => <div role="row" key={field}><span>{field}</span><strong>Available on request</strong><span>To be confirmed based on material and site conditions.</span></div>)}
          </div>
        </section>

        <section className="product-detail-section product-options-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Configuration</span>
            <h2>Configuration options to review</h2>
          </div>
          <div className="product-options-grid">
            {profile.configurationOptions.map((option) => <div key={option}><CheckCircle2 size={17} aria-hidden /><span>{option}</span></div>)}
          </div>
        </section>

        <section className="product-detail-section product-selection-section">
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

        <section className="product-detail-section product-faq-section">
          <div className="product-detail-section-heading">
            <span className="eyebrow">Product FAQ</span>
            <h2>Questions to resolve before ordering</h2>
          </div>
          <div className="product-faq-list">
            {profile.faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </section>

        <section className="product-final-cta" aria-labelledby="product-final-cta-title">
          <div className="product-final-media"><Image src={product.image} alt={`${displayName} inquiry support`} width={660} height={440} sizes="(max-width: 900px) 100vw, 46vw" /></div>
          <div className="product-final-form">
            <span className="eyebrow">Request a quote</span>
            <h2 id="product-final-cta-title">Share the operating conditions for {displayName}</h2>
            <p>Your inquiry is tagged with this product page, product family, language, referrer and campaign data for the COWIN MAGNET team.</p>
            <QuoteForm compact productContext={{ name: product.name, model: models.join(" / "), family: profile.family, selectionFields: profile.selectionFields }} />
          </div>
        </section>
      </main>
      <div className="product-mobile-actions" aria-label="Product contact actions">
        <Link href={quotePath}>Request a Quote</Link>
        <a href={`https://wa.me/${site.whatsapp}?text=${shareMessage}`} target="_blank" rel="noopener noreferrer nofollow">WhatsApp</a>
      </div>
    </>
  );
}

export { productSeoDescription, productSeoTitle };
