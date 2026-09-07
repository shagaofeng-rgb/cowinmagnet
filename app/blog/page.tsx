import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { DateBadge } from "@/components/DateBadge";
import { BlogImage } from "@/components/BlogImage";
import { PageHero } from "@/components/PageHero";
import { PaginationNav } from "@/components/PaginationNav";
import { getBlogPostsWithCms } from "@/lib/blogCms";

type BlogPageProps = { searchParams?: Promise<{ page?: string }> };
const POSTS_PER_PAGE = 9;

function safePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog | Magnetic Separator Selection Guides",
  description:
    "Read COWIN MAGNET selection guides, comparison articles, and application solutions for magnetic separators, overband magnets, magnetic pulleys, and industrial magnets.",
  alternates: { canonical: "/blog" }
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const query = await searchParams;
  const blogPosts = await getBlogPostsWithCms();
  const totalPages = Math.max(1, Math.ceil(blogPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(safePage(query?.page), totalPages);
  const pagePosts = blogPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const startItem = blogPosts.length ? (currentPage - 1) * POSTS_PER_PAGE + 1 : 0;
  const endItem = Math.min(blogPosts.length, currentPage * POSTS_PER_PAGE);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Magnetic separator guides for industrial buyers"
        description="Practical articles for procurement teams, plant engineers, distributors, and EPC buyers comparing magnetic separation equipment."
        image="/images/generated/recycling-application-cowinmagnet.png"
        secondaryHref="/request-quote"
        secondaryLabel="Send Requirements"
      />

      <section className="section blog-list-section">
        <div className="section-heading align-left">
          <span className="eyebrow">SEO Knowledge Hub</span>
          <h2>Selection, comparison, and application articles</h2>
          <p>Use these guides to prepare conveyor data, compare product options, and request a more accurate magnetic separator quotation.</p>
        </div>

        <div className="catalog-list-summary"><p>{startItem}-{endItem} of {blogPosts.length} articles</p></div>
        <div className="blog-grid">
          {pagePosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="blog-card-image" aria-label={post.title}>
                <DateBadge date={post.publishedAt} />
                <BlogImage src={post.image} width={760} height={460} alt={post.title} />
              </Link>
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{post.category}</span>
                  <span><Clock size={14} aria-hidden /> {post.readingTime} min read</span>
                </div>
                <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-link">
                  Read article <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => page > 1 ? `/blog?page=${page}` : "/blog"} label="Blog pagination" summary={`Page ${currentPage} of ${totalPages}`} />
      </section>
    </>
  );
}
