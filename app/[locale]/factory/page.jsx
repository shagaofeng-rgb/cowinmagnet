import SimpleLocalizedPage from "@/components/SimpleLocalizedPage";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/factory", messages.seo.factory);
}

export default async function FactoryPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return <SimpleLocalizedPage page={messages.simplePages.factory} />;
}
