import { CsvExportButton, MetricCard } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Page Performance | Cowinmagnet Admin"
};

export default async function PagesPerformancePage() {
  const { pages } = await getAnalyticsSnapshot();
  const totalViews = pages.reduce((sum, page) => sum + page.views, 0);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Pages</p>
          <h1>Landing Page Performance</h1>
          <p>Compare product, blog, news and inquiry pages by views, visitors, time and conversion events.</p>
        </div>
        <CsvExportButton rows={pages} filename="cowin-pages.csv" />
      </header>

      <section className="admin-grid four">
        <MetricCard label="Tracked Pages" value={pages.length} note="Active URLs" />
        <MetricCard label="Total Views" value={totalViews.toLocaleString()} note="Across pages" />
        <MetricCard label="Best Page" value={pages[0]?.views || 0} note={pages[0]?.title || "No data"} />
        <MetricCard label="Avg Conversion" value={`${pages[0]?.conversionRate || 0}%`} note="Top page" />
      </section>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page</th>
                <th>URL</th>
                <th>Views</th>
                <th>Visitors</th>
                <th>Avg Time</th>
                <th>Inquiry Rate</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.page}>
                  <td>{page.title}</td>
                  <td>{page.page}</td>
                  <td>{page.views}</td>
                  <td>{page.visitors}</td>
                  <td>{page.avgDuration}s</td>
                  <td>{page.conversionRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
