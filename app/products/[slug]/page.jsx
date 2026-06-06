import Header from "@/components/Header";
import Link from "next/link";
import ProductConversionSection, { ProductJsonLd } from "@/components/ProductConversionSection";
import QuoteSection from "@/components/QuoteSection";
import ResponsiveImage from "@/components/ResponsiveImage";
import { allProducts, getProductBySlug } from "@/data/productCatalog";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: `${product.shortTitle} | Cowinmagnet`,
    description: product.summary
  };
}

export default async function ProductSummaryPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="product-summary-page">
        <ProductJsonLd product={product} />
        <section className="product-summary-hero">
          <div className="product-summary-copy">
            <p className="breadcrumb">Products / {product.categoryTitle}</p>
            <p className="eyebrow">Cowinmagnet product</p>
            <h1>{product.title}</h1>
            <p>{product.summary}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/inquiry">
                Send Requirements
              </Link>
              <Link className="button ghost" href="/products">
                Back to Product Center
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
            <p className="eyebrow">Application</p>
            <h2>Typical Use Cases</h2>
            <p>{product.application}</p>
          </article>
          <article>
            <p className="eyebrow">Selection note</p>
            <h2>Data Needed Before Quotation</h2>
            <p>
              Please prepare material type, capacity, belt width, installation height, iron size, iron content and
              target separation result. These details help match the right magnetic solution.
            </p>
          </article>
          <article>
            <p className="eyebrow">Category</p>
            <h2>{product.categoryTitle}</h2>
            <p>
              This page is organized from Cowinmagnet product data to help buyers compare applications, selection notes
              and quotation requirements.
            </p>
          </article>
        </section>

        {product.features?.length > 0 && (
          <section className="product-detail-band">
            <div className="section-heading">
              <p className="eyebrow">Buyer Notes</p>
              <h2>Key Features</h2>
              <p>These points are organized from the original product page content.</p>
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
              <p>These values come from the original product page fields and parameter tables.</p>
            </div>
            <div className="product-spec-list">
              {product.specifications.map(([label, value]) => (
                <div key={`${label}-${value}`}>
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

        <ProductConversionSection currentSlug={product.slug} />
        <QuoteSection />
      </main>
    </>
  );
}
