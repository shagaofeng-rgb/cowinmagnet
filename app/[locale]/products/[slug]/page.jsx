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
        <p className="breadcrumb">{t.breadcrumb} / {product.categoryTitle}</p>
        <p className="eyebrow">{t.product}</p>
        <h1>{product.title}</h1>
        <p>{product.summary}</p>
        <div className="hero-actions">
          <Link className="button primary" href={withLocale(locale, "/inquiry")}>
            {t.send}
          </Link>
          <a className="button ghost" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
            {t.source}
          </a>
        </div>
      </section>

      <section className="product-summary-content">
        <article>
          <p className="eyebrow">{t.application}</p>
          <h2>{t.useCases}</h2>
          <p>{product.application}</p>
        </article>
        <article>
          <p className="eyebrow">{t.selection}</p>
          <h2>{t.dataTitle}</h2>
          <p>{t.dataText}</p>
        </article>
        <article>
          <p className="eyebrow">{t.category}</p>
          <h2>{product.categoryTitle}</h2>
          <p>{t.categoryText}</p>
        </article>
      </section>
    </main>
  );
}
