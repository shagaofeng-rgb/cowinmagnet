import { BarList, MetricCard, TrendChart } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "数据总览 | Cowinmagnet 后台"
};

export default async function AdminOverviewPage() {
  const data = await getAnalyticsSnapshot();
  const { overview, traffic, pages, searchConsole } = data;

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">数据总览</p>
          <h1>网站数据总览</h1>
          <p>集中查看 B2B 访客行为、询盘信号、SEO 搜索表现和页面转化情况。</p>
        </div>
        <div className="admin-date-pill">最近 {data.rangeDays} 天 · {data.storageMode === "database" ? "在线数据库" : "预览模式"}</div>
      </header>

      <section className="admin-grid four">
        <MetricCard label="页面浏览量" value={overview.pageViews.toLocaleString()} note="PV" />
        <MetricCard label="独立访客" value={overview.uniqueVisitors.toLocaleString()} note="UV" />
        <MetricCard label="访问会话" value={overview.sessions.toLocaleString()} note="有效访问" />
        <MetricCard label="询盘提交" value={overview.inquiries.toLocaleString()} note="表单提交事件" />
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <p className="eyebrow">流量趋势</p>
              <h2>每日 PV / UV</h2>
            </div>
          </div>
          <TrendChart rows={traffic.series} />
        </article>

        <article className="admin-panel">
          <p className="eyebrow">来源渠道</p>
          <h2>客户从哪里来</h2>
          <BarList rows={traffic.channels} />
        </article>
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">SEO 快照</p>
          <h2>Google Search Console</h2>
          <div className="admin-mini-metrics">
            <MetricCard label="点击量" value={searchConsole.overview.clicks} note="预留 GSC 字段" />
            <MetricCard label="曝光量" value={searchConsole.overview.impressions} note="预留 GSC 字段" />
            <MetricCard label="点击率" value={`${searchConsole.overview.ctr}%`} note="平均值" />
            <MetricCard label="排名位置" value={searchConsole.overview.position} note="平均值" />
          </div>
          {!searchConsole.configured ? (
            <p className="admin-muted">Google Search Console API 尚未连接，因此这里先显示数据结构示例。</p>
          ) : null}
        </article>

        <article className="admin-panel">
          <p className="eyebrow">热门页面</p>
          <h2>页面表现排行</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>页面</th>
                  <th>浏览</th>
                  <th>平均停留</th>
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
