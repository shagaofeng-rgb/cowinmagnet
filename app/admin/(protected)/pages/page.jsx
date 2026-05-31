import { CsvExportButton, MetricCard } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "页面表现 | Cowinmagnet 后台"
};

export default async function PagesPerformancePage() {
  const { pages } = await getAnalyticsSnapshot();
  const totalViews = pages.reduce((sum, page) => sum + page.views, 0);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">页面表现</p>
          <h1>落地页数据表现</h1>
          <p>按浏览量、访客数、停留时间和询盘事件，比较产品页、博客、新闻和询盘页的效果。</p>
        </div>
        <CsvExportButton rows={pages} filename="cowin-pages.csv" />
      </header>

      <section className="admin-grid four">
        <MetricCard label="追踪页面" value={pages.length} note="活跃 URL" />
        <MetricCard label="总浏览量" value={totalViews.toLocaleString()} note="所有页面" />
        <MetricCard label="最佳页面" value={pages[0]?.views || 0} note={pages[0]?.title || "暂无数据"} />
        <MetricCard label="转化率" value={`${pages[0]?.conversionRate || 0}%`} note="热门页面" />
      </section>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>页面</th>
                <th>URL</th>
                <th>浏览</th>
                <th>访客</th>
                <th>平均停留</th>
                <th>询盘率</th>
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
