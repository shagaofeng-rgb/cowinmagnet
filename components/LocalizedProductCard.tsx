import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productCategories, type Product } from "@/data/products";
import { getProductCardSummary } from "@/data/productDetailProfiles";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localizeHref } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { getLocalizedProductSummary } from "@/lib/productLocale";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";

export function LocalizedProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const categoryIndex = productCategories.indexOf(product.category);
  const title = getLocalizedProductTitle(product, locale);

  return (
    <article className="product-card">
      <Link href={localizeHref(`/products/${product.slug}`, locale)} className="product-image-link">
        <Image src={product.image} width={560} height={360} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 30vw" alt={title} />
      </Link>
      <div className="product-card-body">
        <span>{ui.productCategories[categoryIndex] || product.category}</span>
        <h3><Link href={localizeHref(`/products/${product.slug}`, locale)}>{title}</Link></h3>
        <p>{locale === "en" ? getProductCardSummary(product) : getLocalizedProductSummary(product, locale)}</p>
        <Link href={localizeHref(`/products/${product.slug}`, locale)} className="text-link">
          {t.common.viewProduct} <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
