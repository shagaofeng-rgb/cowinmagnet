import Link from "next/link";
import { listDailyRuns, readDailyRun } from "@/lib/news-system/storage.mjs";
import { createSeoMetadata, withLocale } from "@/data/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createSeoMetadata(locale, "/admin/news-opportunities", {
    title: "Cowinmagnet News Opportunity Dashboard",
    description: "Review scored global industry news and Cowinmagnet product viewpoints before publishing."
  });
}

export default async function NewsOpportunityAdminPage({ params }) {
  const { locale } = await params;
  const runs = await listDailyRuns();
  const latest = runs[0] ? await readDailyRun(runs[0]) : null;

  return (
    <main className="news-admin-page">
      <section className="news-admin-hero">
        <p className="eyebrow">Content Intelligence</p>
        <h1>Industry News Opportunity Dashboard</h1>
        <p>
          Fetch global industry news, score content opportunities, match Cowinmagnet product viewpoints, and review drafts
          before publishing.
        </p>
        <div className="news-admin-actions">
          <Link href="/api/news-opportunities">API Status</Link>
          <Link href={withLocale(locale, "/news")}>Public News Page</Link>
        </div>
      </section>

      <section className="news-admin-shell">
        <aside className="news-run-list" aria-label="Daily runs">
          <h2>Daily Runs</h2>
          {runs.length ? (
            runs.map((date) => (
              <a key={date} href={`/api/news-opportunities/${date}`} target="_blank" rel="noopener noreferrer nofollow">
                {date}
              </a>
            ))
          ) : (
            <p>No runs yet. Run the script or POST the API route to generate a local report.</p>
          )}
        </aside>

        <div className="news-opportunity-list">
          {latest ? (
            <>
              <div className="news-run-summary">
                <span>{latest.date}</span>
                <strong>
                  {latest.selectedCount} selected from {latest.sourceCount} fetched items
                </strong>
                <div>
                  <a href={`/api/news-opportunities/${latest.date}?format=md`}>Markdown</a>
                  <a href={`/api/news-opportunities/${latest.date}?format=csv`}>CSV</a>
                  <a href={`/api/news-opportunities/${latest.date}?format=html`}>HTML</a>
                </div>
              </div>

              {latest.items.map((item) => (
                <article className="news-opportunity-card" key={item.url}>
                  <div className="news-card-head">
                    <span>Score {item.scores.final_score}</span>
                    <small>{item.workflow.status}</small>
                  </div>
                  <h2>{item.generated.contentTitle}</h2>
                  <p>{item.generated.newsSummary}</p>
                  <dl>
                    <div>
                      <dt>Source</dt>
                      <dd>
                        <a href={item.url} target="_blank" rel="noopener noreferrer nofollow">
                          {item.sourceName}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt>Product Match</dt>
                      <dd>{item.generated.recommendedProductMatch.category}</dd>
                    </div>
                    <div>
                      <dt>CTA</dt>
                      <dd>{item.generated.suggestedCta}</dd>
                    </div>
                  </dl>
                  <h3>Cowinmagnet Viewpoint</h3>
                  <p>{item.generated.cowinmagnetViewpoint}</p>
                  <div className="news-review-actions" aria-label="Manual review workflow">
                    <button type="button">Mark Reviewed</button>
                    <button type="button">Approve Draft</button>
                    <button type="button">Reject</button>
                  </div>
                </article>
              ))}
            </>
          ) : (
            <article className="news-opportunity-card">
              <h2>No local report yet</h2>
              <p>
                Run <code>npm run news:daily</code> to create the first JSON and Markdown output.
              </p>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
