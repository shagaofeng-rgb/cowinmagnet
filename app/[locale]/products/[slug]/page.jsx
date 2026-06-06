import { notFound } from "next/navigation";
import Link from "next/link";
import ProductConversionSection, { ProductJsonLd } from "@/components/ProductConversionSection";
import QuoteSection from "@/components/QuoteSection";
import ResponsiveImage from "@/components/ResponsiveImage";
import { absoluteUrl, createSeoMetadata, locales, withLocale } from "@/data/i18n";
import { allProducts, getProductBySlug } from "@/data/productCatalog";
import { getMessages } from "@/messages";

export function generateStaticParams() {
  return locales.flatMap((locale) => allProducts.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  const metadata = createSeoMetadata(locale, `/products/${slug}`, {
    title: `${product.shortTitle} | Cowinmagnet`,
    description: product.summary
  });

  if (product.image) {
    metadata.openGraph.images = [
      {
        url: absoluteUrl(product.image),
        width: 1200,
        height: 900,
        alt: product.imageAlt || product.title
      }
    ];
  }

  return metadata;
}

export default async function LocaleProductPage({ params }) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const messages = getMessages(locale);
  const t = messages.productSummary;

  return (
    <main className="product-summary-page">
      <ProductJsonLd product={product} locale={locale} />
      <section className="product-summary-hero">
        <div className="product-summary-copy">
          <p className="breadcrumb">{t.breadcrumb} / {product.categoryTitle}</p>
          <p className="eyebrow">{t.product}</p>
          <h1>{product.title}</h1>
          <p>{product.summary}</p>
          <div className="hero-actions">
            <Link className="button primary" href={withLocale(locale, "/inquiry")}>
              {t.send}
            </Link>
            <Link className="button ghost" href={withLocale(locale, "/products")}>
              {messages.nav.allProducts}
            </Link>
          </div>
        </div>
        {product.image && (
          <figure className="product-summary-media">
            <ResponsiveImage
              src={product.image}
              alt={product.imageAlt || product.title}
              width={900}
              height={680}
              sizes="(max-width: 980px) 92vw, 46vw"
              priority
            />
            <figcaption>{product.shortTitle}</figcaption>
          </figure>
        )}
      </section>

      <section className="product-summary-content">
        <article>
          <p className="eyebrow">Overview</p>
          <h2>Product Description</h2>
          <p>{product.overview || product.summary}</p>
        </article>
        <article>
          <p className="eyebrow">{t.application}</p>
          <h2>{t.useCases}</h2>
          <p>{product.application}</p>
        </article>
        <article>
          <p className="eyebrow">{t.category}</p>
          <h2>{product.categoryTitle}</h2>
          <p>{t.categoryText}</p>
        </article>
      </section>

      {product.contentSections?.length > 0 && (
        <section className="product-detail-band">
          <div className="section-heading">
            <p className="eyebrow">Source Product Details</p>
            <h2>Original Product Information</h2>
            <p>These details are organized from the visible content on the original product page.</p>
          </div>
          <div className="product-feature-grid">
            {product.contentSections.map((section) => (
              <article key={`${product.slug}-${section.title}`}>
                <span>{section.title}</span>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}

      {product.features?.length > 0 && (
        <section className="product-detail-band">
          <div className="section-heading">
            <p className="eyebrow">Buyer Notes</p>
            <h2>Key Features</h2>
            <p>These points are organized from the existing Cowinmagnet product pages for magnetic separation buyers.</p>
          </div>
          <div className="product-feature-grid">
            {product.features.map((feature) => (
              <article key={feature}>
                <span>Feature</span>
                <p>{feature}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {product.specifications?.length > 0 && (
        <section className="product-detail-band">
          <div className="section-heading">
            <p className="eyebrow">Selection Data</p>
            <h2>Basic Product Information</h2>
            <p>Final model selection should be confirmed with conveyor width, material depth, iron size and installation conditions.</p>
          </div>
          <div className="product-spec-list">
            {product.specifications.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </div>
        </section>
      )}

      {product.specificationTables?.length > 0 && (
        <section className="product-detail-band">
          <div className="section-heading">
            <p className="eyebrow">Original Product Tables</p>
            <h2>Parameters From Source Product Page</h2>
            <p>These tables keep the visible parameter content collected from the original product page.</p>
          </div>
          {product.specificationTables.map((table, tableIndex) => (
            <div
              className="spec-table"
              role="table"
              aria-label={`${product.title} source parameter table ${tableIndex + 1}`}
              key={`${product.slug}-table-${tableIndex}`}
            >
              {table.map((row, rowIndex) => (
                <div role="row" key={`${product.slug}-table-${tableIndex}-row-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <span role="cell" key={`${product.slug}-table-${tableIndex}-row-${rowIndex}-cell-${cellIndex}`}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {product.imageGallery?.length > 1 && (
        <section className="product-detail-band">
          <div className="section-heading">
            <p className="eyebrow">Product Images</p>
            <h2>Images From Original Product Page</h2>
            <p>All product images in this section were migrated from the source product pages.</p>
          </div>
          <div className="recommended-product-grid">
            {product.imageGallery.slice(1, 7).map((image, index) => (
              <figure className="recommended-product-card" key={`${product.slug}-image-${index}`}>
                <ResponsiveImage
                  src={image}
                  alt={`${product.title} image ${index + 2}`}
                  width={520}
                  height={390}
                  sizes="(max-width: 760px) 88vw, (max-width: 1180px) 30vw, 360px"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      <ProductConversionSection currentSlug={product.slug} locale={locale} />
      <QuoteSection locale={locale} />
    </main>
  );
}
