import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { getProductCardSummary, getProductDisplayName } from "@/data/productDetailProfiles";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localizeHref } from "@/lib/i18n";

export function LocalizedProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <article className="product-card">
      <Link href={localizeHref(`/products/${product.slug}`, locale)} className="product-image-link">
        <Image src={product.image} width={560} height={360} alt={getProductDisplayName(product)} />
      </Link>
      <div className="product-card-body">
        <span>{product.category}</span>
        <h3><Link href={localizeHref(`/products/${product.slug}`, locale)}>{getProductDisplayName(product)}</Link></h3>
        <p>{getProductCardSummary(product)}</p>
        <Link href={localizeHref(`/products/${product.slug}`, locale)} className="text-link">
          {t.common.viewProduct} <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
