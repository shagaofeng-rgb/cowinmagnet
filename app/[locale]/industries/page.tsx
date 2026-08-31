import type { Metadata } from "next";
import { LocalizedIndustriesPage } from "@/components/LocalizedPages";
import { isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  return {
    title: "Industry Magnetic Separation Solutions",
    description:
      "Explore magnetic separation solutions for recycling, mining, cement and aggregate, and food processing industries.",
    alternates: localizedPageAlternates(current, "/industries")
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return <LocalizedIndustriesPage locale={(isLocale(locale) ? locale : "en") as Locale} />;
}
