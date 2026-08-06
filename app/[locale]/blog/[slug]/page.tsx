import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedBlogDetailPage } from "@/components/LocalizedPages";
import { blogPosts } from "@/data/blogs";
import { getBlogPostWithCms } from "@/lib/blogCms";
import { isLocale, locales, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return locales.flatMap((locale) => blogPosts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const current = isLocale(locale) ? locale : "en";
  const post = await getBlogPostWithCms(slug);
  if (!post) return {};
  return {
    title: post.seoTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: localizedPageAlternates(current, `/blog/${post.slug}`),
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: absoluteUrl(`/${current}/blog/${post.slug}`),
      images: [post.image],
      type: "article"
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params;
  const post = await getBlogPostWithCms(slug);
  if (!post || !isLocale(locale)) notFound();
  return <LocalizedBlogDetailPage locale={locale as Locale} post={post} />;
}
