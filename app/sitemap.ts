import type { MetadataRoute } from "next";
import { applications } from "@/data/applications";
import { blogPosts } from "@/data/blogs";
import { getNewsPosts } from "@/data/contentHub";
import { getProductsWithCms } from "@/lib/productCms";
import { site } from "@/data/site";
import { localePath, locales } from "@/lib/i18n";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsPosts, products] = await Promise.all([getNewsPosts(), getProductsWithCms()]);
  const staticRoutes = ["/", "/products", "/applications", "/industries", "/blog", "/news", "/about", "/projects", "/contact", "/request-quote"];
  const productRoutes = products.map((product) => `/products/${product.slug}`);
  const applicationRoutes = applications.map((application) => `/applications/${application.slug}`);
  const industryRoutes = applications.map((application) => `/industries/${application.industrySlug}`);
  const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
  const newsRoutes = newsPosts.map((post) => `/news/${post.slug}`);
  const localizedRoutes = locales.flatMap((locale) =>
    [...staticRoutes, ...productRoutes, ...applicationRoutes, ...industryRoutes, ...blogRoutes, ...newsRoutes].map((route) => localePath(locale, route))
  );

  return localizedRoutes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route.endsWith("/en") || route.endsWith("/es") || route.endsWith("/ru") || route.endsWith("/ar") || route.endsWith("/fr") || route.endsWith("/pt") ? "weekly" : "monthly",
    priority: route.split("/").length === 2 ? 1 : route.includes("/products/") ? 0.85 : route.includes("/blog/") || route.includes("/news/") ? 0.72 : 0.75
  }));
}
