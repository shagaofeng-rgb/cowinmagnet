import type { Metadata } from "next";
import { PaginatedProductCatalog } from "@/components/PaginatedProductCatalog";
import { PageHero } from "@/components/PageHero";
import { getProductCategoryNamesWithCms, getProductsWithCms } from "@/lib/productCms";

type ProductsPageProps = {
  searchParams?: Promise<{ category?: string; page?: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Products | Magnetic Separators and Magnetic Components",
  description:
    "Explore COWIN MAGNET magnetic separation equipment, suspended magnets, electromagnetic separators, magnetic lifting magnets, magnetic rods, and custom magnetic components.",
  alternates: { canonical: "/products" }
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = await searchParams;
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
      <PaginatedProductCatalog products={products} categories={productCategories} selectedCategory={query?.category} requestedPage={query?.page} />
    </>
  );
}
