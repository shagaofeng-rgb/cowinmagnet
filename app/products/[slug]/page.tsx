import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailExperience, productSeoDescription, productSeoTitle } from "@/components/ProductDetailExperience";
import { ProductCategoryPage } from "@/components/ProductCategoryPage";
import { products } from "@/data/products";
import { getProductBySlugWithCms, getProductsWithCms } from "@/lib/productCms";
import { getProductCategoryPage, productCategoryPages } from "@/lib/productCategories";
import { absoluteUrl } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  return [...products.map((product) => ({ slug: product.slug })), ...productCategoryPages.map((category) => ({ slug: category.slug }))];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugWithCms(slug);
  const category = getProductCategoryPage(slug);

  if (category) {
    return {
      title: category.category,
      description: category.description,
      alternates: { canonical: `/products/${category.slug}` },
      openGraph: { title: `${category.category} | COWIN MAGNET`, description: category.description, url: absoluteUrl(`/products/${category.slug}`) }
    };
  }

  if (!product) return {};
  return {
    title: productSeoTitle(product),
    description: productSeoDescription(product),
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: productSeoTitle(product),
      description: productSeoDescription(product),
      url: absoluteUrl(`/products/${product.slug}`),
      images: [product.image]
    },
    twitter: { card: "summary_large_image", title: productSeoTitle(product), description: productSeoDescription(product), images: [product.image] }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugWithCms(slug);
  const category = getProductCategoryPage(slug);

  if (category) {
    const catalogue = await getProductsWithCms();
    return <ProductCategoryPage category={category} products={catalogue.filter((item) => item.category === category.category)} />;
  }

  if (!product) notFound();
  return <ProductDetailExperience product={product} />;
}
