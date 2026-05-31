import Header from "@/components/Header";
import Link from "next/link";
import { productCategories } from "@/data/productCatalog";

export const metadata = {
  title: "Magnetic Separator Products | Cowinmagnet",
  description:
    "Browse Cowinmagnet magnetic separator products by permanent magnet series, electromagnetic series, magnetic rollers and magnetic bars."
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="catalog-page">
        <section className="catalog-hero">
          <p className="eyebrow">Product center</p>
          <h1>Magnetic Separator Products Organized for Global Buyers</h1>
          <p>
            Products from Cowinmagnet are grouped by buyer decision logic: permanent magnetic separation,
            electromagnetic separation and magnetic filtration components.
          </p>
        </section>

        <section className="catalog-grid" aria-label="Magnetic separator product categories">
          {productCategories.map((category) => (
            <article className="catalog-category" key={category.id} id={category.id}>
              <div className="catalog-category-head">
                <div>
                  <p className="eyebrow">Cowinmagnet category</p>
                  <h2>{category.title}</h2>
                  <p>{category.description}</p>
                </div>
                <Link href="/inquiry">
                  Ask for Catalog
                </Link>
              </div>

              <div className="catalog-products">
                {category.products.map((product) => (
                  <Link className="catalog-product-card" href={`/products/${product.slug}`} key={product.slug}>
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
    </>
  );
}
