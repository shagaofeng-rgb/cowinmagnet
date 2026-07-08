import type { Metadata } from "next";
import { LocalizedBlogListPage } from "@/components/LocalizedPages";
import { getBlogPostsWithCms } from "@/lib/blogCms";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  return { title: t.blog.seoTitle, description: t.blog.metaDescription, alternates: localizedPageAlternates(current, "/blog") };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const posts = await getBlogPostsWithCms();
  return <LocalizedBlogListPage locale={(isLocale(locale) ? locale : "en") as Locale} posts={posts} />;
}
