import { BarList, MetricCard } from "@/components/admin/AdminWidgets";
import { getSearchConsoleSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search Console | Cowinmagnet Admin"
};

export default function SearchConsolePage() {
  const data = getSearchConsoleSnapshot();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Google SEO</p>
          <h1>Search Console Dashboard</h1>
          <p>Prepared for clicks, impressions, CTR, average position, indexed pages and query analysis.</p>
        </div>
        <div className={data.configured ? "admin-status good" : "admin-status"}>
          {data.configured ? "GSC Connected" : "GSC API Reserved"}
        </div>
      </header>

      <section className="admin-grid four">
        <MetricCard label="Clicks" value={data.overview.clicks} note="GSC metric" />
        <MetricCard label="Impressions" value={data.overview.impressions} note="GSC metric" />
        <MetricCard label="CTR" value={`${data.overview.ctr}%`} note="Average" />
        <MetricCard label="Position" value={data.overview.position} note="Average" />
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">Queries</p>
          <h2>Search Terms</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Clicks</th>
                  <th>Impr.</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {data.queries.map((row) => (
                  <tr key={row.query}>
                    <td>{row.query}</td>
                    <td>{row.clicks}</td>
                    <td>{row.impressions}</td>
                    <td>{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <p className="eyebrow">Indexing</p>
          <h2>Page Index Status</h2>
          <BarList rows={data.indexingStatus} />
          <p className="admin-muted">
            Connect Google Search Console API to replace sample rows with live URL inspection and performance data.
          </p>
        </article>
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">Pages</p>
          <h2>SEO Landing Pages</h2>
          <BarList rows={data.pages.map((page) => ({ label: page.title, value: page.clicks }))} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">Countries</p>
          <h2>Search Demand by Market</h2>
          <BarList rows={data.countries.map((row) => ({ label: row.country, value: row.clicks }))} />
        </article>
      </section>
    </div>
  );
}
