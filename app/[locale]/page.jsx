import ProductDetail from "@/components/ProductDetail";
import QuoteSection from "@/components/QuoteSection";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/", messages.seo.home);
}

export default async function LocaleHomePage({ params }) {
  const { locale } = await params;

  return (
    <>
      <ProductDetail locale={locale} />
      <QuoteSection locale={locale} />
    </>
  );
}
