import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const privatePaths = [
  "/admin",
  "/admin/",
  "/api/admin",
  "/api/admin/",
  "/api/cron",
  "/api/cron/",
  "/api/analytics",
  "/api/analytics/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      { userAgent: "GPTBot", allow: "/", disallow: privatePaths },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: privatePaths },
      { userAgent: "ChatGPT-User", allow: "/", disallow: privatePaths },
      { userAgent: "Googlebot", allow: "/", disallow: privatePaths },
      { userAgent: "Google-Extended", allow: "/", disallow: privatePaths },
      { userAgent: "ClaudeBot", allow: "/", disallow: privatePaths },
      { userAgent: "Claude-SearchBot", allow: "/", disallow: privatePaths },
      { userAgent: "Claude-User", allow: "/", disallow: privatePaths },
      { userAgent: "PerplexityBot", allow: "/", disallow: privatePaths },
      { userAgent: "Perplexity-User", allow: "/", disallow: privatePaths }
    ],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/news-sitemap.xml`]
  };
}
