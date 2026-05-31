import { allProducts } from "@/data/productCatalog";
import { blogPosts, newsPosts } from "@/data/contentHub";
import { locales, siteUrl, withLocale } from "@/data/i18n";

const staticPaths = ["/", "/products", "/applications", "/about", "/factory", "/cases", "/blog", "/news", "/contact", "/inquiry"];
const productPaths = allProducts.map((product) => `/products/${product.slug}`);
const blogPaths = blogPosts.map((post) => post.href);
const newsPaths = newsPosts.map((post) => post.href);
const paths = [...staticPaths, ...productPaths, ...blogPaths, ...newsPaths];

function alternatesFor(path) {
  return Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}${withLocale(locale, path)}`]));
}

export default function sitemap() {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${withLocale(locale, path)}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : path.startsWith("/products") ? 0.85 : 0.7,
      alternates: {
        languages: {
          ...alternatesFor(path),
          "x-default": `${siteUrl}${withLocale("en", path)}`
        }
      }
    }))
  );
}
