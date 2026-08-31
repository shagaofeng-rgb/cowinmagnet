import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsDetailView } from "@/components/NewsDetailView";
import { getNewsCategories, getNewsPost, getNewsPosts, newsPosts } from "@/data/contentHub";
import { getArticleDocument } from "@/lib/articleDocument";
import { assessNewsContent } from "@/lib/newsContentPolicy";
import { absoluteUrl } from "@/lib/seo";
import { pageTitleForTemplate } from "@/lib/seoTitle";

type NewsPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;
export function generateStaticParams() { return newsPosts.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const post = await getNewsPost((await params).slug);
  if (!post) return {};
  const document: any = getArticleDocument(post);
  const visibility = assessNewsContent(post);
  const sourceTitle = document.seo.metaTitle || document.title;
  const title = pageTitleForTemplate(sourceTitle);
  const description = document.seo.metaDescription || document.summary;
  const image = document.seo.ogImageAssetId || document.heroImage?.assetId || post.coverImage;
  return { title, description, robots: visibility.indexable ? { index: true, follow: true } : { index: false, follow: true }, alternates: { canonical: `/news/${post.slug}` }, openGraph: { title: document.seo.ogTitle || sourceTitle, description: document.seo.ogDescription || description, url: absoluteUrl(`/news/${post.slug}`), ...(image ? { images: [absoluteUrl(image)] } : {}), type: "article" }, twitter: { title: document.seo.ogTitle || sourceTitle, description: document.seo.ogDescription || description, ...(image ? { images: [absoluteUrl(image)] } : {}) } };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const slug = (await params).slug;
  const [post, posts, categories] = await Promise.all([getNewsPost(slug), getNewsPosts(), getNewsCategories()]);
  if (!post) notFound();
  return <NewsDetailView post={post} posts={posts} categories={categories} />;
}
