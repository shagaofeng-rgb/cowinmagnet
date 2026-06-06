import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHero } from "@/components/PageHero";
import { getProductCategoryNamesWithCms, getProductsWithCms } from "@/lib/productCms";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Products | Magnetic Separators and Magnetic Components",
  description:
    "Explore COWIN MAGNET magnetic separation equipment, suspended magnets, electromagnetic separators, magnetic lifting magnets, magnetic rods, and custom magnetic components.",
  alternates: { canonical: "/products" }
};

export default async function ProductsPage() {
  const [products, productCategories] = await Promise.all([getProductsWithCms(), getProductCategoryNamesWithCms()]);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Industrial product range for magnetic separation and site support"
        description="Browse magnetic separator options by category, then send your material, conveyor width, installation height, contamination level, and target application for selection support."
        image="/images/catalog/page-3-image-9-1871x840.jpg"
        secondaryHref="/request-quote"
        secondaryLabel="Request Selection Support"
      />
      <section className="section">
        {productCategories.map((category) => (
          <div className="product-category-block" key={category}>
            <div className="section-heading align-left">
              <span className="eyebrow">{category}</span>
              <h2>{category}</h2>
            </div>
            <div className="product-grid">
              {products
                .filter((product) => product.category === category)
                .map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
