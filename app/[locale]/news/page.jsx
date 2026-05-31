import { NewsIndexPage } from "@/components/ContentIndexPage";
import { newsCategories, newsPosts } from "@/data/contentHub";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/news", messages.seo.news);
}

export default async function NewsPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return <NewsIndexPage page={messages.simplePages.news} categories={newsCategories} posts={newsPosts} locale={locale} />;
}
