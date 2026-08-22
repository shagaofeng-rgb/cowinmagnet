import type { Metadata } from "next";
import { LocalizedBlogListPage } from "@/components/LocalizedPages";
import { getPublicBlogPostsWithCms } from "@/lib/blogCms";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  const posts = await getPublicBlogPostsWithCms();
  return {
    title: t.blog.seoTitle,
    description: t.blog.metaDescription,
    robots: posts.length ? undefined : { index: false, follow: true },
    alternates: localizedPageAlternates(current, "/blog")
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const posts = await getPublicBlogPostsWithCms();
  return <LocalizedBlogListPage locale={(isLocale(locale) ? locale : "en") as Locale} posts={posts} />;
}
