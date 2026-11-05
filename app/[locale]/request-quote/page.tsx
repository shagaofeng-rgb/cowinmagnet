import type { Metadata } from "next";
import { getProductBySlugWithCms, getProductsWithCms } from "@/lib/productCms";
import { getProductDetailProfile } from "@/data/productDetailProfiles";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
import { getProductInquiryModel } from "@/lib/productDisplay";
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
  const productBySlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) ? await getProductBySlugWithCms(name) : undefined;
  const product = productBySlug || (name ? (await getProductsWithCms()).find((item) => item.name === name || item.slug === name || getLocalizedProductTitle(item, current) === name) : undefined);
  const selected = product ? {
    title: getLocalizedProductTitle(product, current),
    image: product.image,
    context: {
      name: product.name,
      family: getProductDetailProfile(product).family,
      model: getProductInquiryModel(product)
    }
  } : undefined;
  return <LocalizedRequestQuotePage locale={current} selected={selected} defaultProduct={name} />;
}
