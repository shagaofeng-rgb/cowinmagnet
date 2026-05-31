import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetail from "@/components/ProductDetail";
import QuoteSection from "@/components/QuoteSection";
import { createSeoMetadata, locales, withLocale } from "@/data/i18n";
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

  return createSeoMetadata(locale, `/products/${slug}`, {
    title: `${product.shortTitle} | Cowinmagnet`,
    description: product.summary
  });
}

export default async function LocaleProductPage({ params }) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  if (slug === "permanent-overband-magnetic-separator") {
    return (
      <>
        <ProductDetail locale={locale} />
        <QuoteSection locale={locale} />
      </>
    );
  }

  const messages = getMessages(locale);
  const t = messages.productSummary;

  return (
    <main className="product-summary-page">
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
            <img src={product.image} alt={product.imageAlt || product.title} width="900" height="680" />
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

      <QuoteSection locale={locale} />
    </main>
  );
}
