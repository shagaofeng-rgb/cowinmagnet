import Link from "next/link";
import { createSeoMetadata, withLocale } from "@/data/i18n";
import { productCategories } from "@/data/productCatalog";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/products", messages.seo.products);
}

export default async function LocaleProductsPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const t = messages.products;

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1>{t.h1}</h1>
        <p>{t.intro}</p>
      </section>

      <section className="catalog-grid" aria-label="Magnetic separator product categories">
        {productCategories.map((category) => (
          <article className="catalog-category" key={category.id} id={category.id}>
            <div className="catalog-category-head">
              <div>
                <p className="eyebrow">{t.categoryLabel}</p>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
              <a href={category.sourceUrl} target="_blank" rel="noopener noreferrer">
                {t.officialSource}
              </a>
            </div>

            <div className="catalog-products">
              {category.products.map((product) => (
                <Link className="catalog-product-card" href={withLocale(locale, `/products/${product.slug}`)} key={product.slug}>
                  {product.image && (
                    <figure className="catalog-product-media">
                      <img
                        src={product.image}
                        alt={product.imageAlt || product.title}
                        width="720"
                        height="520"
                        loading="lazy"
                      />
                    </figure>
                  )}
                  <div className="catalog-product-copy">
                    <span>{product.shortTitle}</span>
                    <h3>{product.title}</h3>
                    <p>{product.summary}</p>
                    <small>{product.application}</small>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
