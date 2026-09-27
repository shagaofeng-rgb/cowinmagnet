import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedApplicationDetailPage } from "@/components/LocalizedPages";
import { applications } from "@/data/applications";
import { getDictionary, isLocale, locales, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => applications.map((application) => ({ locale, slug: application.industrySlug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const current = isLocale(locale) ? locale : "en";
  const application = applications.find((item) => item.industrySlug === slug);
  if (!application) return {};
  const index = applications.findIndex((item) => item.industrySlug === slug);
  const ui = getPublicUi(current);
  const t = getDictionary(current);

  return {
    title: current === "en" ? application.seoTitle : ui.industryMenu[index]?.[0] || application.seoTitle,
    description: current === "en" ? application.seoDescription : t.applications.metaDescription,
    alternates: localizedPageAlternates(current, `/industries/${application.industrySlug}`)
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const application = applications.find((item) => item.industrySlug === slug);
  if (!application || !isLocale(locale)) notFound();
  return <LocalizedApplicationDetailPage locale={locale as Locale} application={application} />;
}
