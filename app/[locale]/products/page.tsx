import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { InnerPage } from "@/components/InnerPage";
import { getPublicUi } from "@/lib/publicUi";
import { catalogLabels } from "@/lib/interiorLocale";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
import { PaginatedProductCatalog } from "@/components/PaginatedProductCatalog";
import { getProductCategoryNamesWithCms, getProductsWithCms } from "@/lib/productCms";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ category?: string; page?: string; family?: string; q?: string; application?: string; installation?: string }> };

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
  const t = getDictionary(current);
  const ui = getPublicUi(current);
  const featured = productList.find((item) => item.slug === "permanent-overband-magnetic-separator") || productList[0];
  return <InnerPage locale={current} title={t.nav.products} variant="catalog">
    <PageHero eyebrow={ui.catalog} title={catalogLabels[current].catalogTitle} description={current === "en" ? "Explore magnetic separation equipment for metal removal, material purification and recovery." : t.products.description} image={featured?.image} imageAlt={featured ? getLocalizedProductTitle(featured, current) : undefined} mediaStyle="equipment" primaryHref="" />
    <PaginatedProductCatalog locale={current} products={productList} categories={categoryList} selectedCategory={query?.category} requestedPage={query?.page} requestedFamily={query?.family} keyword={query?.q} requestedApplication={query?.application} requestedInstallation={query?.installation} />
  </InnerPage>;
}
