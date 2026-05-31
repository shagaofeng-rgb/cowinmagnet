import { BarList, MetricCard } from "@/components/admin/AdminWidgets";
import { getSearchConsoleSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search Console | Cowinmagnet 后台"
};

export default function SearchConsolePage() {
  const data = getSearchConsoleSnapshot();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Google SEO</p>
          <h1>Search Console 数据</h1>
          <p>用于查看点击量、曝光量、点击率、平均排名、收录状态和关键词表现。</p>
        </div>
        <div className={data.configured ? "admin-status good" : "admin-status"}>
          {data.configured ? "GSC 已连接" : "GSC 接口预留"}
        </div>
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
                  <th>排名</th>
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
          <p className="eyebrow">收录情况</p>
          <h2>页面收录状态</h2>
          <BarList rows={data.indexingStatus} />
          <p className="admin-muted">
            连接 Google Search Console API 后，这里会替换成真实的收录和搜索表现数据。
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
