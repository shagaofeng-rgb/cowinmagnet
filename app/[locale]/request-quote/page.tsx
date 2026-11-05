import type { Metadata } from "next";
import { getProductsWithCms } from "@/lib/productCms";
import { getProductDetailProfile } from "@/data/productDetailProfiles";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
import { cleanProductSpecs } from "@/lib/productDisplay";
import { LocalizedRequestQuotePage } from "@/components/InnerCompanyPages";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ product?: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  return { title: t.requestQuote.seoTitle, description: t.requestQuote.metaDescription, alternates: localizedPageAlternates(current, "/request-quote") };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const current: Locale = isLocale(locale) ? locale : "en";
  const query = await searchParams;
  const name = typeof query?.product === "string" ? query.product.trim().slice(0, 180) : "";
  const product = name ? (await getProductsWithCms()).find((item) => item.name === name || item.slug === name || getLocalizedProductTitle(item, current) === name) : undefined;
  const selected = product ? {
    title: getLocalizedProductTitle(product, current),
    image: product.image,
    context: {
      name: product.name,
      family: getProductDetailProfile(product).family,
      model: [...new Set(cleanProductSpecs(product.specs).filter((spec) => spec.label.trim().toLowerCase() === "model").map((spec) => spec.value.trim()))].join(" / ")
    }
  } : undefined;
  return <LocalizedRequestQuotePage locale={current} selected={selected} defaultProduct={name} />;
}
