import type { Metadata } from "next";
import { LocalizedProductsPage } from "@/components/LocalizedPages";
import { PaginatedProductCatalog } from "@/components/PaginatedProductCatalog";
import { getProductCategoryNamesWithCms, getProductsWithCms } from "@/lib/productCms";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ category?: string; page?: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  return { title: t.products.seoTitle, description: t.products.metaDescription, alternates: localizedPageAlternates(current, "/products") };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const [productList, categoryList] = await Promise.all([getProductsWithCms(), getProductCategoryNamesWithCms()]);
  const current = (isLocale(locale) ? locale : "en") as Locale;
  return <>
    <LocalizedProductsPage locale={current} productList={productList} categoryList={categoryList} heroOnly />
    <PaginatedProductCatalog locale={current} products={productList} categories={categoryList} selectedCategory={query?.category} requestedPage={query?.page} />
  </>;
}
