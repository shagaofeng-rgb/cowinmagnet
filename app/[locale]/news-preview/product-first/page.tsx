import { notFound } from "next/navigation";
import { NewsDetailView } from "@/components/NewsDetailView";
import previewData from "@/docs/news-previews/product-first-news-previews.json";
import { isLocale, type Locale } from "@/lib/i18n";

type PreviewRecord = {
  id: string;
  slug: string;
  document: Record<string, any>;
};

type PreviewPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sample?: string }>;
};

const previewMedia: Record<string, { assetId: string; alt: string; caption: string }> = {
  "permanent-overband-aggregate": {
    assetId: "/assets/products/permanent-overband-magnetic-separator/permanent-overband-magnetic-separator-01.jpg",
    alt: "COWIN MAGNET permanent overband magnetic separator for conveyor tramp iron removal",
    caption: "Permanent Overband Magnetic Separator"
  },
  "wet-drum-mineral-processing": {
    assetId: "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-01.jpg",
    alt: "COWIN MAGNET wet drum magnetic separator for mineral slurry processing",
    caption: "Wet Drum Magnetic Separator"
  },
  "drawer-magnet-powder-handling": {
    assetId: "/assets/products/drawer-magnet/drawer-magnet-01.png",
    alt: "COWIN MAGNET drawer magnet for dry gravity-fed material streams",
    caption: "Drawer Magnet"
  }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This route is intentionally unavailable unless explicitly enabled for a local review.
// It is not linked, indexed or included in the sitemap.
export default async function ProductFirstNewsPreviewPage({ params, searchParams }: PreviewPageProps) {
  if (process.env.NEWS_LOCAL_PREVIEW !== "true") notFound();
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const { sample } = await searchParams;
  const records = previewData as PreviewRecord[];
  const selectedIndex = Math.max(0, Math.min(records.length - 1, Number(sample || "1") - 1));
  const selected = records[selectedIndex];
  if (!selected) notFound();
  const posts = records.map((record) => {
    const document: Record<string, any> = { ...record.document, heroImage: record.document.heroImage || previewMedia[record.id] };
    return {
    slug: record.slug,
    title: document.title,
    excerpt: document.summary,
    category: "product-first-preview",
    categoryTitle: "Local product-first preview",
    publishedAt: "2026-08-22T00:00:00.000Z",
    updatedAt: "2026-08-22T00:00:00.000Z",
    coverImage: document.heroImage?.assetId || "",
    coverAlt: document.heroImage?.alt || document.title,
    articleDocument: document
  };
  });
  const post = posts[selectedIndex];

  return <NewsDetailView
    post={post}
    posts={posts}
    categories={[{ slug: "product-first-preview", title: "Local product-first preview" }]}
    locale={locale}
  />;
}
