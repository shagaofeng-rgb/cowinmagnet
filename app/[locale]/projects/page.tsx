import type { Metadata } from "next";
import { LocalizedProjectsPage } from "@/components/InnerCompanyPages";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ page?: string; industry?: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  return { title: t.projects.seoTitle, description: t.projects.metaDescription, alternates: localizedPageAlternates(current, "/projects") };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  return <LocalizedProjectsPage locale={(isLocale(locale) ? locale : "en") as Locale} requestedPage={query?.page} industry={query?.industry} />;
}
