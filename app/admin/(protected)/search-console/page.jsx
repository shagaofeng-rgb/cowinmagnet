import { BarList, MetricCard } from "@/components/admin/AdminWidgets";
import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getSearchConsoleSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Search Console | Cowinmagnet 后台"
};

export default async function SearchConsolePage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const rangeKey = `${range.preset}:${range.startInput}:${range.endInput}`;
  const data = await getSearchConsoleSnapshot(range);

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
          <p className="eyebrow">连接状态</p>
          <h2>Search Console API</h2>
          <BarList rows={data.indexingStatus} />
          <p className="admin-muted">
            {data.live
              ? "已读取 Google Search Console 搜索表现数据。收录明细如需逐 URL 检查，可后续接入 URL Inspection API。"
              : "尚未连接 Google Search Console API，因此当前显示 0 和空表，不再显示示例数据。"}
          </p>
          {data.error ? <p className="admin-alert">{data.error}</p> : null}
        </article>
      </section>

      {!data.live ? (
        <section className="admin-panel">
          <p className="eyebrow">接入链路</p>
          <h2>Google Search Console API 连接步骤</h2>
          <ol className="admin-setup-list">
            <li>在 Google Cloud 创建项目，并启用 <strong>Google Search Console API</strong>。</li>
            <li>创建 Service Account，下载 JSON Key。</li>
            <li>打开 Google Search Console，在网站资源中把 Service Account 邮箱添加为用户，权限选择“完整”。</li>
            <li>在 Vercel 项目环境变量里配置：<code>GOOGLE_SEARCH_CONSOLE_SITE_URL</code>、<code>GOOGLE_CLIENT_EMAIL</code>、<code>GOOGLE_PRIVATE_KEY</code>。</li>
            <li><code>GOOGLE_SEARCH_CONSOLE_SITE_URL</code> 必须和 GSC 资源完全一致，例如 <code>https://www.cowinmagnet.com/</code> 或 <code>sc-domain:cowinmagnet.com</code>。</li>
            <li><code>GOOGLE_PRIVATE_KEY</code> 使用 JSON 里的 private_key，保留换行，或写成带 <code>\n</code> 的一行。</li>
            <li>保存环境变量后重新部署 Vercel，后台 SEO 数据会从真实 API 读取。</li>
          </ol>
        </section>
      ) : null}

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
