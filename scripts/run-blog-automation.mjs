import { runDailyBlogPublisher } from "../lib/blog-system/daily-publisher.mjs";

const force = process.argv.includes("--force");
const result = await runDailyBlogPublisher({ force });

console.log(
  JSON.stringify(
    {
      status: result.status,
      reason: result.reason,
      publishedCount: result.publishedCount,
      post: result.post
        ? {
            title: result.post.title,
            slug: result.post.slug,
            href: `/blog/${result.post.slug}`,
            publishedAt: result.post.publishedAt
          }
        : null
    },
    null,
    2
  )
);
