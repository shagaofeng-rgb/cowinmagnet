import type { Metadata } from "next";
import { LocalizedIndustriesPage } from "@/components/LocalizedPages";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  const ui = getPublicUi(current);
  return {
    title: ui.industryHeadline,
    description: t.applications.metaDescription,
    alternates: localizedPageAlternates(current, "/industries")
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedIndustriesPage locale={(isLocale(locale) ? locale : "en") as Locale} />;
}
