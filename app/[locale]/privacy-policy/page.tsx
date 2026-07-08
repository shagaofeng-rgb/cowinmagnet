import type { Metadata } from "next";
import { isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";
import PrivacyPolicyPage from "../../privacy-policy/page";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  return {
    title: "Privacy Policy",
    description: "Privacy policy for COWIN MAGNET website inquiries, analytics, and business communication.",
    alternates: localizedPageAlternates(current, "/privacy-policy")
  };
}

export default PrivacyPolicyPage;
