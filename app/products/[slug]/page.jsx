import Header from "@/components/Header";
import Link from "next/link";
import QuoteSection from "@/components/QuoteSection";
import ResponsiveImage from "@/components/ResponsiveImage";
import { allProducts, getProductBySlug } from "@/data/productCatalog";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return allProducts
    .filter((product) => product.slug !== "permanent-overband-magnetic-separator")
    .map((product) => ({ slug: product.slug }));
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

        <QuoteSection />
      </main>
    </>
  );
}
