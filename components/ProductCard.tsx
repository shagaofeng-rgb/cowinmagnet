import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { getProductCardSummary, getProductDisplayName } from "@/data/productDetailProfiles";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image-link">
        <Image src={product.image} width={560} height={360} alt={getProductDisplayName(product)} />
      </Link>
      <div className="product-card-body">
        <span>{product.category}</span>
        <h3><Link href={`/products/${product.slug}`}>{getProductDisplayName(product)}</Link></h3>
        <p>{getProductCardSummary(product)}</p>
        <Link href={`/products/${product.slug}`} className="text-link">
          View product <ArrowRight size={16} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
