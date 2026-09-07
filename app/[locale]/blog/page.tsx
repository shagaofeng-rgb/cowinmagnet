import type { Metadata } from "next";
import { LocalizedBlogListPage } from "@/components/LocalizedPages";
import { getPublicBlogPostsWithCms } from "@/lib/blogCms";
import { getDictionary, isLocale, localizedPageAlternates, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ page?: string }> };
const POSTS_PER_PAGE = 9;

function safePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

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

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const posts = await getPublicBlogPostsWithCms();
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(safePage(query?.page), totalPages);
  const pagePosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  return <LocalizedBlogListPage locale={current} posts={pagePosts} pagination={{ currentPage, totalPages, totalItems: posts.length }} />;
}
