import { BarList, MetricCard } from "@/components/admin/AdminWidgets";
import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getSearchConsoleSnapshot } from "@/lib/analyticsStore";
import { getSearchConsoleSitemapStatus } from "@/lib/searchConsoleClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search Console | Cowinmagnet 后台"
};

export default async function SearchConsolePage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const rangeKey = `${range.preset}:${range.startInput}:${range.endInput}`;
  const [data, sitemapResult] = await Promise.all([
    getSearchConsoleSnapshot(range),
    getSearchConsoleSitemapStatus().catch((error) => ({
      configured: true,
      submissionEnabled: false,
      live: false,
      error: error instanceof Error ? error.message : "Sitemap status check failed"
    }))
  ]);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Google SEO</p>
          <h1>Search Console 数据</h1>
          <p>用于查看点击量、曝光量、点击率、平均排名、页面和关键词搜索表现。</p>
        </div>
        <div className={data.live ? "admin-status good" : "admin-status"}>
          {data.live ? "GSC 已连接" : "GSC 未连接"}
        </div>
        <AdminDateRangeFilter key={rangeKey} range={range} />
      </header>

      <section className="admin-grid four">
        <MetricCard label="点击量" value={data.overview.clicks} note="GSC 指标" />
        <MetricCard label="曝光量" value={data.overview.impressions} note="GSC 指标" />
        <MetricCard label="点击率" value={`${data.overview.ctr}%`} note="平均值" />
        <MetricCard label="排名位置" value={data.overview.position} note="平均值" />
      </section>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">关键词</p>
          <h2>搜索词表现</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>搜索词</th>
                  <th>点击</th>
                  <th>曝光</th>
                  <th>点击率</th>
                  <th>排名</th>
                </tr>
              </thead>
              <tbody>
                {data.queries.map((row) => (
                  <tr key={row.query}>
                    <td>{row.query}</td>
                    <td>{row.clicks}</td>
                    <td>{row.impressions}</td>
                    <td>{row.ctr}%</td>
                    <td>{row.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-panel">
          <p className="eyebrow">网站收录状态</p>
          <h2>网站地图状态</h2>
          <dl className="admin-definition-list">
            <div><dt>自动提交</dt><dd>{sitemapResult.submissionEnabled ? "已启用" : "未启用"}</dd></div>
            <div><dt>连接状态</dt><dd>{sitemapResult.live ? "正常" : "准备中"}</dd></div>
            <div><dt>最近提交</dt><dd>{sitemapResult.lastSubmitted ? new Date(sitemapResult.lastSubmitted).toLocaleString("zh-CN") : "—"}</dd></div>
            <div><dt>最近更新</dt><dd>{sitemapResult.lastDownloaded ? new Date(sitemapResult.lastDownloaded).toLocaleString("zh-CN") : "—"}</dd></div>
            <div><dt>发现 URL</dt><dd>{sitemapResult.contents?.reduce((total, item) => total + item.submitted, 0) || 0}</dd></div>
            <div><dt>警告 / 错误</dt><dd>{`${sitemapResult.warnings || 0} / ${sitemapResult.errors || 0}`}</dd></div>
          </dl>
          <p className="admin-muted">网站地图会定期更新。</p>
        </article>

        <article className="admin-panel">
          <p className="eyebrow">搜索表现</p>
          <h2>搜索数据概览</h2>
          <BarList rows={data.indexingStatus} />
          <p className="admin-muted">
            {data.live
              ? "已更新 Google 搜索表现数据。"
              : "搜索数据正在准备中。"}
          </p>
        </article>
      </section>


      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">页面</p>
          <h2>SEO 落地页</h2>
          <BarList rows={data.pages.map((page) => ({ label: page.title, value: page.clicks }))} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">市场</p>
          <h2>各市场搜索需求</h2>
          <BarList rows={data.countries.map((row) => ({ label: row.country, value: row.clicks }))} />
        </article>
      </section>
    </div>
  );
}
