import { applications } from "@/data/applications";
import { productCategories } from "@/data/products";
import { getNewsPosts } from "@/data/contentHub";
import { getBlogPostsWithCms } from "@/lib/blogCms";
import { getProductsWithCms } from "@/lib/productCms";
import { getProductCardSummary } from "@/data/productDetailProfiles";
import { getLocalizedProductSummary } from "@/lib/productLocale";
import { getDictionary } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

const MAX_RESULTS = 36;

function normalize(value = "") {
  return String(value).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function words(value = "") {
  return normalize(value)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= 2)
    .slice(0, 12);
}

function excerpt(value = "", query = "") {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const lower = text.toLowerCase();
  const firstWord = words(query)[0] || "";
  const index = firstWord ? lower.indexOf(firstWord.toLowerCase()) : -1;
  const start = index > 70 ? index - 70 : 0;
  const snippet = text.slice(start, start + 220);
  return `${start > 0 ? "... " : ""}${snippet}${text.length > start + 220 ? " ..." : ""}`;
}

function scoreItem(item, queryWords) {
  const title = normalize(item.title || "");
  const body = normalize(item.searchText || "");
  let score = 0;
  for (const word of queryWords) {
    if (title.includes(word)) score += 6;
    if (body.includes(word)) score += 2;
  }
  if (title === queryWords.join(" ")) score += 12;
  return score;
}

async function searchableItems(locale = "en") {
  const [products, blogPosts, newsPosts] = await Promise.all([getProductsWithCms(), getBlogPostsWithCms(), getNewsPosts()]);
  const ui = getPublicUi(locale);
  const t = getDictionary(locale);
  const localized = locale !== "en";
  const productTypes = [t.nav.products, t.applications.eyebrow, ui.industries, t.nav.blog, ui.news[0]];

  return [
    ...products.map((product) => ({
      type: localized ? productTypes[0] : "Product",
      title: product.name,
      href: `/products/${product.slug}`,
      description: localized ? getLocalizedProductSummary(product, locale) : getProductCardSummary(product),
      searchText: [
        product.name,
        product.category,
        getProductCardSummary(product),
        ...(localized ? [getLocalizedProductSummary(product, locale), ui.productCategories[productCategories.indexOf(product.category)] || ""] : []),
        ...(product.keywords || []),
        ...(product.features || []),
        ...(product.applications || [])
      ].join(" ")
    })),
    ...applications.flatMap((application, index) => [
      {
        type: localized ? productTypes[1] : "Application",
        title: localized ? ui.industryMenu[index]?.[0] || application.pageTitle : application.pageTitle || application.name,
        href: `/industries/${application.industrySlug || application.slug}`,
        description: localized ? ui.industryMenu[index]?.[1] || application.summary : application.summary,
        searchText: [
          ...(localized ? ui.industryMenu[index] || [] : []),
          application.name,
          application.pageTitle,
          application.summary,
          application.secondaryDescription,
          ...(application.painPoints || []),
          ...(application.recommendedProducts || []),
          ...(application.scenarios || [])
        ].join(" ")
      },
      {
        type: localized ? productTypes[2] : "Industry",
        title: localized ? ui.industryMenu[index]?.[0] || application.name : `${application.name} Magnetic Separation Solutions`,
        href: `/industries/${application.industrySlug}`,
        description: localized ? ui.industryMenu[index]?.[1] || application.summary : application.seoDescription || application.summary,
        searchText: [
          ...(localized ? ui.industryMenu[index] || [] : []),
          application.name,
          application.seoTitle,
          application.seoDescription,
          application.summary,
          ...(application.equipment || []).map((item) => `${item.name} ${item.usage}`)
        ].join(" ")
      }
    ]),
    ...blogPosts.map((post) => ({
      type: localized ? productTypes[3] : "Blog",
      title: post.title,
      href: `/blog/${post.slug}`,
      description: post.excerpt || post.metaDescription,
      searchText: [post.title, post.category, post.excerpt, post.metaDescription, ...(post.keywords || []), post.content].join(" ")
    })),
    ...newsPosts.map((post) => ({
      type: localized ? productTypes[4] : "News",
      title: post.title,
      href: `/news/${post.slug}`,
      description: post.excerpt || post.seoDescription,
      searchText: [
        post.title,
        post.categoryTitle,
        post.excerpt,
        post.seoDescription,
        ...(post.tags || []),
        ...(post.sections || []).map((section) => `${section.heading} ${section.body}`)
      ].join(" ")
    }))
  ];
}

export async function searchSite(query = "", locale = "en") {
  const queryWords = words(query);
  if (!queryWords.length) return [];

  const results = (await searchableItems(locale))
    .map((item) => ({
      ...item,
      score: scoreItem(item, queryWords),
      excerpt: excerpt(item.description || item.searchText, query)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .filter((item, index, list) => list.findIndex((candidate) => candidate.href === item.href) === index)
    .slice(0, MAX_RESULTS);

  return results;
}
