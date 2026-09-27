import type { Metadata } from "next";
import { isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { LocalizedLegalPage } from "@/components/LocalizedLegalPage";
import { getLegalDocument } from "@/lib/legalLocale";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  return {
    title: getLegalDocument(current, "privacy").title,
    description: getLegalDocument(current, "privacy").intro,
    alternates: localizedPageAlternates(current, "/privacy-policy")
  };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedLegalPage locale={(isLocale(locale) ? locale : "en") as Locale} kind="privacy" />;
}
