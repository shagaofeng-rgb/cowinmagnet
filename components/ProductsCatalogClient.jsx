"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import { withLocale } from "@/data/i18n";

const filters = {
  type: {
    label: "Product Type",
    options: [
      ["all", "All Types"],
      ["permanent", "Permanent Magnetic Equipment"],
      ["electromagnetic", "Electromagnetic Equipment"],
      ["separation", "Magnetic Separation Equipment"],
      ["components", "Magnetic Rollers & Components"]
    ]
  },
  cleaning: {
    label: "Cleaning Type",
    options: [
      ["all", "Any Cleaning"],
      ["manual", "Manual Cleaning"],
      ["self-cleaning", "Self-Cleaning"]
    ]
  },
  installation: {
    label: "Installation Type",
    options: [
      ["all", "Any Installation"],
      ["suspended", "Suspended Over Conveyor"],
      ["cross-belt", "Cross Belt"],
      ["inline", "Inline Belt"],
      ["head-pulley", "Head Pulley"],
      ["drum", "Drum Separation"]
    ]
  },
  application: {
    label: "Application",
    options: [
      ["all", "All Applications"],
      ["mining", "Mining"],
      ["recycling", "Recycling"],
      ["cement", "Cement"],
      ["coal", "Coal"],
      ["power", "Power Plant"],
      ["aggregate", "Aggregate"],
      ["food", "Food & Grain"],
      ["plastic", "Plastic Recycling"]
    ]
  }
};

function productTags(product) {
  const text = `${product.title} ${product.shortTitle} ${product.summary} ${product.application} ${product.categoryTitle}`.toLowerCase();
  return {
    type: product.categoryId === "electromagnetic-equipment" ? "electromagnetic" : product.categoryId === "magnetic-separation-equipment" ? "separation" : text.includes("bar") || text.includes("rod") || text.includes("grid") || text.includes("grate") ? "components" : "permanent",
    cleaning: text.includes("self-cleaning") || text.includes("automatic") ? "self-cleaning" : "manual",
    installation: text.includes("pulley") ? "head-pulley" : text.includes("drum") ? "drum" : text.includes("inline") ? "inline" : text.includes("suspended") || text.includes("overband") ? "suspended" : "cross-belt",
    application: ["mining", "recycling", "cement", "coal", "power", "aggregate", "food", "plastic"].find((item) => text.includes(item)) || "all"
  };
}

export default function ProductsCatalogClient({ categories, locale = "en", labels }) {
  const [selected, setSelected] = useState({
    type: "all",
    cleaning: "all",
    installation: "all",
    application: "all"
  });

  const products = useMemo(
    () => categories.flatMap((category) => category.products.map((product) => ({ ...product, categoryId: category.id, categoryTitle: category.title }))),
    [categories]
  );

  const filteredProducts = products.filter((product) => {
    const tags = productTags(product);
    return Object.entries(selected).every(([key, value]) => value === "all" || tags[key] === value);
  });

  function updateFilter(event) {
    setSelected((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <>
      <section className="catalog-filter-panel" aria-label="Product filters">
        <div>
          <p className="eyebrow">Product Filter</p>
          <h2>Find magnetic separation equipment by application and installation conditions.</h2>
        </div>
        <div className="catalog-filter-grid">
          {Object.entries(filters).map(([key, filter]) => (
            <label key={key}>
              <span>{filter.label}</span>
              <select name={key} value={selected[key]} onChange={updateFilter}>
                {filter.options.map(([value, label]) => (
                  <option value={value} key={value}>{label}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </section>

      <section className="catalog-results" aria-label="Filtered magnetic separator products">
        <div className="catalog-results-head">
          <p><strong>{filteredProducts.length}</strong> product option{filteredProducts.length === 1 ? "" : "s"} shown</p>
          <Link className="button ghost" href={withLocale(locale, "/contact")}>Need Selection Help?</Link>
        </div>
        <div className="catalog-products catalog-products-flat">
          {filteredProducts.map((product) => (
            <article className="catalog-product-card" key={product.slug}>
              {product.image && (
                <Link className="catalog-product-media" href={withLocale(locale, `/products/${product.slug}`)}>
                  <ResponsiveImage
                    src={product.image}
                    alt={product.imageAlt || product.title}
                    width={720}
                    height={520}
                    sizes="(max-width: 760px) 92vw, (max-width: 1180px) 42vw, 560px"
                  />
                </Link>
              )}
              <div className="catalog-product-copy">
                <span>{product.categoryTitle}</span>
                <h3>
                  <Link href={withLocale(locale, `/products/${product.slug}`)}>{product.title}</Link>
                </h3>
                <p>{product.summary}</p>
                <small>{product.application}</small>
                <ul className="catalog-feature-list">
                  {(product.features || []).slice(0, 3).map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <div className="catalog-card-actions">
                  <Link href={withLocale(locale, `/products/${product.slug}`)}>View Details</Link>
                  <Link href={withLocale(locale, `/inquiry?product=${product.slug}`)}>Request Quote</Link>
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("cowin:add-quote-product", { detail: product.slug }))}>
                    Add to Quote List
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
