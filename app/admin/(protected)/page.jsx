import { BarList, MetricCard, TrendChart } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Analytics Overview | Cowinmagnet Admin"
};

export default async function AdminOverviewPage() {
  const data = await getAnalyticsSnapshot();
  const { overview, traffic, pages, searchConsole } = data;

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Website Analytics Overview</h1>
          <p>Track B2B visitor behavior, inquiry signals and SEO search visibility in one place.</p>
        </div>
        <div className="admin-date-pill">Last {data.rangeDays} days</div>
      </header>

      <section className="admin-grid four">
        <MetricCard label="Page Views" value={overview.pageViews.toLocaleString()} note="PV" />
        <MetricCard label="Unique Visitors" value={overview.uniqueVisitors.toLocaleString()} note="UV" />
        <MetricCard label="Sessions" value={overview.sessions.toLocaleString()} note="Active visits" />
        <MetricCard label="Inquiries" value={overview.inquiries.toLocaleString()} note="Tracked form submits" />
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">Traffic Trend</p>
              <h2>Daily PV / UV</h2>
            </div>
          </div>
          <TrendChart rows={traffic.series} />
        </article>

        <article className="admin-panel">
          <p className="eyebrow">Channels</p>
          <h2>Traffic Sources</h2>
          <BarList rows={traffic.channels} />
        </article>
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">SEO Snapshot</p>
          <h2>Google Search Console</h2>
          <div className="admin-mini-metrics">
            <MetricCard label="Clicks" value={searchConsole.overview.clicks} note="Reserved GSC field" />
            <MetricCard label="Impressions" value={searchConsole.overview.impressions} note="Reserved GSC field" />
            <MetricCard label="CTR" value={`${searchConsole.overview.ctr}%`} note="Average" />
            <MetricCard label="Position" value={searchConsole.overview.position} note="Average" />
          </div>
          {!searchConsole.configured ? (
            <p className="admin-muted">GSC API keys are not connected yet, so this area shows sample structure.</p>
          ) : null}
        </article>

        <article className="admin-panel">
          <p className="eyebrow">Top Pages</p>
          <h2>Best Performing Pages</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Views</th>
                  <th>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {pages.slice(0, 6).map((page) => (
                  <tr key={page.page}>
                    <td>{page.title}</td>
                    <td>{page.views}</td>
                    <td>{page.avgDuration}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
