import { CsvExportButton, MetricCard } from "@/components/admin/AdminWidgets";
import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "页面表现 | Cowinmagnet 后台"
};

export default async function PagesPerformancePage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const { landingJourneys, pages } = await getAnalyticsSnapshot(range);
  const totalViews = pages.reduce((sum, page) => sum + page.views, 0);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">页面表现</p>
          <h1>落地页数据表现</h1>
          <p>按浏览量、访客数、停留时间和询盘事件，比较产品页、博客、新闻和询盘页的效果。</p>
        </div>
        <div className="admin-head-actions">
          <AdminDateRangeFilter range={range} />
          <CsvExportButton rows={pages} filename="cowin-pages.csv" />
        </div>
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

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">行为轨迹标签</p>
            <h2>新老客户与访问日次数</h2>
            <p>
              同一个访客在同一天多次浏览只算第 1 个访问日；隔天再次访问才累计为第 2 次访问日。
            </p>
          </div>
          <CsvExportButton rows={landingJourneys} filename="cowin-landing-journeys.csv" />
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>客户标签</th>
                <th>访问日</th>
                <th>当前页面</th>
                <th>上一页</th>
                <th>来源</th>
                <th>国家</th>
                <th>设备</th>
                <th>访客ID</th>
              </tr>
            </thead>
            <tbody>
              {landingJourneys.map((item, index) => (
                <tr key={`${item.visitorId}-${item.timestamp}-${index}`}>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>
                    <span className={`admin-customer-tag ${item.visitDayNumber === 1 ? "new" : "returning"}`}>
                      {item.customerTypeLabel}
                    </span>
                  </td>
                  <td>第 {item.visitDayNumber} 次访问日</td>
                  <td>{item.pageTitle}</td>
                  <td>{item.previousPage}</td>
                  <td>{item.channel}</td>
                  <td>{item.country || "未知"}</td>
                  <td>{item.device}</td>
                  <td>{item.visitorId?.slice(0, 16)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
