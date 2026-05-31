import Header from "@/components/Header";
import Link from "next/link";
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
          <p className="breadcrumb">Products / {product.categoryTitle}</p>
          <p className="eyebrow">Cowinmagnet product</p>
          <h1>{product.title}</h1>
          <p>{product.summary}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/inquiry">
              Send Requirements
            </Link>
            <a className="button ghost" href={product.sourceUrl} target="_blank" rel="noopener noreferrer">
              View Official Product
            </a>
          </div>
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
              This product is synchronized from the Cowinmagnet official product system and organized here for
              independent-site SEO and inquiry conversion.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
