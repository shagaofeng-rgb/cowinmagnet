import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedProductDetailPage } from "@/components/LocalizedPages";
import { ProductCategoryPage } from "@/components/ProductCategoryPage";
import { products } from "@/data/products";
import { getProductBySlugWithCms } from "@/lib/productCms";
import { cleanProductText } from "@/lib/productDisplay";
import { getDictionary, isLocale, locales, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { getProductCategoryPage, productCategoryPages } from "@/lib/productCategories";
import { getProductsWithCms } from "@/lib/productCms";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return locales.flatMap((locale) => [...products.map((product) => ({ locale, slug: product.slug })), ...productCategoryPages.map((category) => ({ locale, slug: category.slug }))]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlugWithCms(slug);
  const current = isLocale(locale) ? locale : "en";
  const category = getProductCategoryPage(slug);
  if (category) {
    const categoryPath = `/${current}/products/${category.slug}`;
    return {
      title: category.category,
      description: category.description,
      alternates: localizedPageAlternates(current, `/products/${category.slug}`),
      openGraph: {
        title: `${category.category} | COWIN MAGNET`,
        description: category.description,
        url: absoluteUrl(categoryPath)
      }
    };
  }
  if (!product) return {};
  const summary = cleanProductText(product.summary, "Contact us for verified specifications and selection support.");
  return {
    title: product.name,
    description: summary,
    alternates: localizedPageAlternates(current, `/products/${product.slug}`),
    openGraph: {
      title: `${product.name} | COWIN MAGNET`,
      description: summary,
      url: absoluteUrl(`/${current}/products/${product.slug}`),
      images: [product.image]
    }
  };
}
export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const product = await getProductBySlugWithCms(slug);
  const category = getProductCategoryPage(slug);
  if (!isLocale(locale)) notFound();
  if (category) {
    const catalogue = await getProductsWithCms();
    return <ProductCategoryPage locale={locale as Locale} category={category} products={catalogue.filter((item) => item.category === category.category)} />;
  }
  if (!product) notFound();
  return <LocalizedProductDetailPage locale={locale as Locale} product={product} />;
}
