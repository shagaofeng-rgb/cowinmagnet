import type { Metadata } from "next";
import { isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { LocalizedLegalPage } from "@/components/LocalizedLegalPage";
import { getLegalDocument } from "@/lib/legalLocale";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  return {
    title: getLegalDocument(current, "terms").title,
    description: getLegalDocument(current, "terms").intro,
    alternates: localizedPageAlternates(current, "/terms")
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedLegalPage locale={(isLocale(locale) ? locale : "en") as Locale} kind="terms" />;
}
