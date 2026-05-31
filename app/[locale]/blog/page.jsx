import { BlogIndexPage } from "@/components/ContentIndexPage";
import { createSeoMetadata } from "@/data/i18n";
import { blogPosts } from "@/data/contentHub";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/blog", messages.seo.blog);
}

export default async function BlogPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return <BlogIndexPage page={messages.simplePages.blog} posts={blogPosts} locale={locale} />;
}
