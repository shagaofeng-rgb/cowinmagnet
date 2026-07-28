import { applications } from "../../data/applications.ts";
import { blogPosts as staticBlogPosts } from "../../data/blogs.ts";
import { newsPosts as staticNewsPosts } from "../../data/contentHub.js";
import { generatedNewsPosts } from "../../data/generatedNews.js";
import { products as staticProducts } from "../../data/products.ts";
import staticDates from "../../data/sitemapStaticDates.json" with { type: "json" };
import { getCmsItems } from "../cmsStore.js";

export const SITEMAP_LOCALES = ["en", "es", "ru", "ar", "fr", "pt"];
export const SITEMAP_SITE_URL = "https://www.cowinmagnet.com";

const STATIC_ROUTES = [
  "/",
  "/products",
  "/applications",
  "/industries",
  "/blog",
  "/news",
  "/about",
  "/factory",
  "/projects",
  "/contact",
  "/request-quote",
  "/privacy-policy",
  "/terms"
];

function dateValue(...values) {
  for (const value of values) {
    const date = new Date(value || "");
    if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
  }
  return "";
}

export function isPublicSitemapContent(item = {}) {
  const status = String(item.status || "published").toLowerCase();
  return !["draft", "offline", "archived", "private", "deleted"].includes(status) && item.noindex !== true && item.robots !== "noindex";
}

function localizePath(locale, path) {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function canonicalEntries(path, lastmod, siteUrl) {
  const alternates = [
    ...SITEMAP_LOCALES.map((locale) => ({ hreflang: locale, href: `${siteUrl}${localizePath(locale, path)}` })),
    { hreflang: "x-default", href: `${siteUrl}${localizePath("en", path)}` }
  ];

  // Product and editorial bodies are authored in English. Submit one stable
  // English URL per document, while retaining every locale as a hreflang hint.
  // This avoids spending crawl capacity on five near-identical URL variants.
  return [
    {
      loc: `${siteUrl}${localizePath("en", path)}`,
      lastmod,
      alternates
    }
  ];
}

function dedupeBySlug(items) {
  const map = new Map();
  for (const item of items) {
    if (!item?.slug || map.has(item.slug) || !isPublicSitemapContent(item)) continue;
    map.set(item.slug, item);
  }
  return [...map.values()];
}

function latest(items, fallback) {
  return items.reduce((value, item) => {
    const itemDate = dateValue(item.updatedAt, item.publishedAt, item.createdAt, fallback);
    return itemDate > value ? itemDate : value;
  }, dateValue(fallback));
}

export async function collectSitemapSections({ siteUrl = SITEMAP_SITE_URL } = {}) {
  const [cmsProducts, cmsBlogs, cmsNews] = await Promise.all([
    getCmsItems("product"),
    getCmsItems("blog"),
    getCmsItems("news")
  ]);

  const products = dedupeBySlug([
    ...cmsProducts,
    ...staticProducts.map((product) => ({ ...product, status: "published", updatedAt: staticDates.products }))
  ]);
  const blogs = dedupeBySlug([...cmsBlogs, ...staticBlogPosts]);
  const generatedNews = generatedNewsPosts.filter((post) => post.quality?.passed !== false);
  const news = dedupeBySlug([...cmsNews, ...generatedNews, ...staticNewsPosts]);
  const publicApplications = applications.filter(isPublicSitemapContent);

  const productLastmod = latest(products, staticDates.products);
  const blogLastmod = latest(blogs, staticDates.posts);
  const newsLastmod = latest(news, staticDates.posts);
  const categoryLastmod = latest(publicApplications, staticDates.categories);

  const pageDates = {
    "/products": productLastmod,
    "/applications": categoryLastmod,
    "/industries": categoryLastmod,
    "/blog": blogLastmod,
    "/news": newsLastmod
  };
  const pages = STATIC_ROUTES.flatMap((route) => canonicalEntries(route, pageDates[route] || staticDates.pages, siteUrl));
  const productEntries = products.flatMap((product) =>
    canonicalEntries(`/products/${encodeURIComponent(product.slug)}`, dateValue(product.updatedAt, product.publishedAt, product.createdAt, staticDates.products), siteUrl)
  );

  const industrySlugs = new Map();
  for (const application of publicApplications) {
    if (application.industrySlug && !industrySlugs.has(application.industrySlug)) industrySlugs.set(application.industrySlug, application);
  }
  const categoryEntries = [
    ...publicApplications.flatMap((application) =>
      canonicalEntries(`/applications/${encodeURIComponent(application.slug)}`, dateValue(application.updatedAt, staticDates.categories), siteUrl)
    ),
    ...[...industrySlugs.entries()].flatMap(([slug, application]) =>
      canonicalEntries(`/industries/${encodeURIComponent(slug)}`, dateValue(application.updatedAt, staticDates.categories), siteUrl)
    )
  ];
  const postEntries = [
    ...blogs.flatMap((post) =>
      canonicalEntries(`/blog/${encodeURIComponent(post.slug)}`, dateValue(post.updatedAt, post.publishedAt, post.createdAt, staticDates.posts), siteUrl)
    ),
    ...news.flatMap((post) =>
      canonicalEntries(`/news/${encodeURIComponent(post.slug)}`, dateValue(post.updatedAt, post.publishedAt, post.createdAt, staticDates.posts), siteUrl)
    )
  ];

  return { pages, products: productEntries, categories: categoryEntries, posts: postEntries };
}
