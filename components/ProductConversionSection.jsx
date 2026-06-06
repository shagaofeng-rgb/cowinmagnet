import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import ShareActions from "@/components/ShareActions";
import { absoluteLocalizedUrl, absoluteUrl, withLocale } from "@/data/i18n";
import { allProducts, getProductBySlug } from "@/data/productCatalog";

function localizeHref(locale, path) {
  return locale ? withLocale(locale, path) : path;
}

function productUrl(locale, slug) {
  const path = `/products/${slug}`;
  return locale ? absoluteLocalizedUrl(locale, path) : absoluteUrl(path);
}

function productImageUrl(src) {
  if (!src) return undefined;
  if (src.startsWith("data:") || src.startsWith("http")) return src;
  return absoluteUrl(src);
}

function getRecommendedProducts(currentSlug) {
  const current = getProductBySlug(currentSlug);
  const others = allProducts.filter((product) => product.slug !== currentSlug);

  if (!current) {
    return others.slice(0, 3);
  }

  const sameCategory = others.filter((product) => product.categoryId === current.categoryId);
  const categoryRepresentatives = [];
  const seenCategories = new Set([current.categoryId]);

  for (const product of others) {
    if (!seenCategories.has(product.categoryId)) {
      categoryRepresentatives.push(product);
      seenCategories.add(product.categoryId);
    }
  }

  const recommended = [...sameCategory.slice(0, 1), ...categoryRepresentatives];
  const seenSlugs = new Set(recommended.map((product) => product.slug));
  const remaining = others.filter((product) => !seenSlugs.has(product.slug));

  return [...recommended, ...remaining].slice(0, 3);
}

export function ProductJsonLd({ product, locale = "en" }) {
  if (!product) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.summary,
    image: productImageUrl(product.image),
    brand: {
      "@type": "Brand",
      name: "Cowinmagnet"
    },
    category: product.categoryTitle,
    url: productUrl(locale, product.slug),
    additionalProperty: product.specifications?.map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function ProductConversionSection({ currentSlug, locale = "en" }) {
  const current = getProductBySlug(currentSlug);
  const recommendations = getRecommendedProducts(currentSlug);
  const shareTitle = current?.title || "Cowinmagnet magnetic separation equipment";
  const shareUrl = productUrl(locale, currentSlug);

  return (
    <section className="product-conversion-section" aria-label="Share and recommended magnetic separator products">
      <div className="product-share-panel">
        <div>
          <p className="eyebrow">Share This Product</p>
          <h2>Send this magnetic separator page to your team or project buyer.</h2>
          <p>
            Use these quick share buttons if this product may fit a recycling, mining, quarrying, cement or bulk
            material handling project.
          </p>
        </div>
        <ShareActions url={shareUrl} title={shareTitle} variant="product" />
      </div>

      <div className="section-heading product-recommend-heading">
        <p className="eyebrow">Recommended Products</p>
        <h2>Other magnetic separation options buyers often compare</h2>
        <p>
          Continue comparing suitable equipment before sending your conveyor width, material type and installation
          height for model selection.
        </p>
      </div>

      <div className="recommended-product-grid">
        {recommendations.map((product) => (
          <Link className="recommended-product-card" href={localizeHref(locale, `/products/${product.slug}`)} key={product.slug}>
            {product.image && (
              <figure>
                <ResponsiveImage
                  src={product.image}
                  alt={product.imageAlt || product.title}
                  width={520}
                  height={390}
                  sizes="(max-width: 760px) 88vw, (max-width: 1180px) 30vw, 360px"
                />
              </figure>
            )}
            <div>
              <span>{product.categoryTitle}</span>
              <h3>{product.shortTitle}</h3>
              <p>{product.summary}</p>
              <em>View related product</em>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
