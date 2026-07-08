import type { Metadata } from "next";
import { isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";
import TermsPage from "../../terms/page";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  return {
    title: "Terms of Use",
    description: "Terms of use for the COWIN MAGNET website, product information, inquiries, and external resources.",
    alternates: localizedPageAlternates(current, "/terms")
  };
}

export default TermsPage;
