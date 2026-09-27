import type { Metadata } from "next";
import { LocalizedLegalPage } from "@/components/LocalizedLegalPage";
import { isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { getLegalDocument } from "@/lib/legalLocale";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const current = locale as Locale;
  return {
    title: getLegalDocument(current, "editorial").title,
    description: getLegalDocument(current, "editorial").intro,
    alternates: localizedPageAlternates(current, "/editorial-policy")
  };
}

export default async function LocalizedEditorialPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocalizedLegalPage locale={locale as Locale} kind="editorial" />;
}
