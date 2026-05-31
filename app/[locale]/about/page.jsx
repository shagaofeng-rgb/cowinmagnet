import AboutContent from "@/components/AboutContent";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/about", messages.seo.about);
}

export default async function LocaleAboutPage({ params }) {
  const { locale } = await params;

  return <AboutContent locale={locale} />;
}
