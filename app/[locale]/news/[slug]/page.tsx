import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailView } from "@/components/NewsDetailView";
import { getNewsCategories, getNewsPost, getNewsPosts, newsPosts } from "@/data/contentHub";
import { getArticleDocument } from "@/lib/articleDocument";
import { isLocale, locales, localizedPageAlternates, type Locale } from "@/lib/i18n";
import { assessNewsContent } from "@/lib/newsContentPolicy";
import { absoluteUrl } from "@/lib/seo";

type NewsPageProps = { params: Promise<{ locale: string; slug: string }> };
export const dynamic = "force-dynamic";
export const revalidate = 0;
export function generateStaticParams() { return locales.flatMap((locale) => newsPosts.map((post) => ({ locale, slug: post.slug }))); }

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const post = await getNewsPost(slug);
  if (!post) return {};
  const document: any = getArticleDocument(post);
  const visibility = assessNewsContent(post);
  const title = document.seo.metaTitle || document.title;
  const description = document.seo.metaDescription || document.summary;
  const image = document.seo.ogImageAssetId || document.heroImage?.assetId || post.coverImage;
  return { title, description, robots: visibility.indexable ? { index: true, follow: true } : { index: false, follow: true }, alternates: { canonical: `/${locale}/news/${post.slug}`, languages: localizedPageAlternates(locale, `/news/${post.slug}`) }, openGraph: { title: document.seo.ogTitle || title, description: document.seo.ogDescription || description, url: absoluteUrl(`/${locale}/news/${post.slug}`), ...(image ? { images: [absoluteUrl(image)] } : {}), type: "article" }, twitter: { title: document.seo.ogTitle || title, description: document.seo.ogDescription || description, ...(image ? { images: [absoluteUrl(image)] } : {}) } };
}

export default async function LocalizedNewsDetailPage({ params }: NewsPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const [post, posts, categories] = await Promise.all([getNewsPost(slug), getNewsPosts(), getNewsCategories()]);
  if (!post) notFound();
  return <NewsDetailView post={post} posts={posts} categories={categories} locale={locale} />;
}
