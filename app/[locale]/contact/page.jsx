import GoogleMapCard from "@/components/GoogleMapCard";
import QuoteSection from "@/components/QuoteSection";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/contact", messages.seo.contact);
}

export default async function LocaleContactPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);

  return (
    <main>
      <GoogleMapCard locale={locale} title={messages.map.title} kicker={messages.map.kicker} />
      <QuoteSection locale={locale} />
    </main>
  );
}
