import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { searchSite } from "@/lib/siteSearch";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Search | COWIN MAGNET",
  description: "Search COWIN MAGNET products, industry solutions, news, and technical articles.",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true }
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = String(params?.q || "").trim();
  const results = await searchSite(query);

  return (
    <>
      <PageHero
        eyebrow="Search"
        title="Search COWIN MAGNET"
        description="Find product pages, industry solutions, news updates, and technical buying guides."
        image="/images/generated/contact-support-cowinmagnet.png"
        imageAlt="Cowinmagnet website search"
        secondaryHref="/request-quote"
        secondaryLabel="Send Requirements"
      />

      <section className="section search-section">
        <form className="site-search-form" action="/search" role="search">
          <label htmlFor="site-search-query">Search the website</label>
          <div>
            <input id="site-search-query" name="q" defaultValue={query} placeholder="Search products, news, applications..." />
            <button type="submit" className="btn btn-primary">
              <Search size={17} aria-hidden /> Search
            </button>
          </div>
        </form>

        <div className="search-results-header">
          <span className="eyebrow">Results</span>
          <h2>{query ? `${results.length} results for "${query}"` : "Enter a keyword to search"}</h2>
        </div>

        {query && results.length ? (
          <div className="search-result-list">
            {results.map((item) => (
              <article className="search-result-card" key={`${item.type}-${item.href}`}>
                <span>{item.type}</span>
                <h3><Link href={item.href}>{item.title}</Link></h3>
                <p>{item.excerpt}</p>
                <Link className="text-link" href={item.href}>Open result</Link>
              </article>
            ))}
          </div>
        ) : query ? (
          <div className="search-empty-state">
            <h3>No direct match found</h3>
            <p>Try broader terms such as magnetic separator, overband magnet, recycling, mining, cement, or food processing.</p>
            <Link href="/request-quote" className="btn btn-primary">Ask for selection support</Link>
          </div>
        ) : null}
      </section>
    </>
  );
}
