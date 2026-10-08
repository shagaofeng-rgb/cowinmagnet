import Link from "next/link";
import { getLinkAuditReport } from "@/lib/linkStrategy";

const riskLabels = {
  safe: "安全外链",
  "needs-confirmation": "待确认",
  "high-risk": "高风险"
};
const typeLabels = { product: "产品", application: "应用", blog: "博客", news: "新闻" };
const reasonLabels = {
  "URL format needs manual confirmation.": "链接格式需人工确认。",
  "Domain or URL contains spam, adult, finance, malware, or black-hat terms.": "链接包含高风险关键词，需人工复核。",
  "Known official platform, industry source, map, analytics, or approved social/service link.": "已识别的官方平台、行业来源或服务链接。",
  "Third-party domain is not on the current allowlist.": "第三方域名尚未确认。"
};

function sourceLabel(value) {
  if (value === "Site contact / WhatsApp") return "网站联系入口";
  if (value === "Footer social") return "页脚社交链接";
  if (value === "Map navigation") return "地图导航";
  return String(value || "-").replace(/^News source: /, "新闻来源：");
}

const PAGE_SIZE = 20;

function pageNumber(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}

function pageHref(params, key, page) {
  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params || {})) {
    if (typeof value === "string" && value) query.set(name, value);
  }
  query.set(key, String(page));
  return `?${query.toString()}`;
}

function Pagination({ params, pageKey, page, total }) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <nav className="admin-pagination" aria-label={`${pageKey === "internalPage" ? "内链" : "外链"}分页`}>
      <span>共 {total} 条，每页 {PAGE_SIZE} 条</span>
      {page > 1 ? <Link href={pageHref(params, pageKey, page - 1)}>上一页</Link> : <span>上一页</span>}
      <span>第 {page} / {totalPages} 页</span>
      {page < totalPages ? <Link href={pageHref(params, pageKey, page + 1)}>下一页</Link> : <span>下一页</span>}
    </nav>
  );
}

export default async function LinkAuditPage({ searchParams }) {
  const params = await searchParams;
  const report = await getLinkAuditReport();
  const internalPage = Math.min(pageNumber(params?.internalPage), Math.max(1, Math.ceil(report.internalRows.length / PAGE_SIZE)));
  const externalPage = Math.min(pageNumber(params?.externalPage), Math.max(1, Math.ceil(report.externalRows.length / PAGE_SIZE)));
  const internalRows = report.internalRows.slice((internalPage - 1) * PAGE_SIZE, internalPage * PAGE_SIZE);
  const externalRows = report.externalRows.slice((externalPage - 1) * PAGE_SIZE, externalPage * PAGE_SIZE);

  return (
    <div className="admin-page admin-link-audit-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">SEO 链接网络</p>
          <h1>内外链审计</h1>
          <p>查看产品、应用、博客和新闻页面的内链覆盖与外链风险。</p>
        </div>
        <Link href="/api/admin/link-audit" className="admin-submit-button">查看完整报告</Link>
      </header>

      <section className="admin-grid four">
        <article className="admin-stat"><span>内容页面</span><strong>{report.summary.pages}</strong><small>产品 / 应用 / 博客 / 新闻</small></article>
        <article className="admin-stat"><span>内链达标页面</span><strong>{report.summary.pagesWithEnoughInternalLinks}</strong><small>至少 2 条推荐内链</small></article>
        <article className="admin-stat"><span>外链总数</span><strong>{report.summary.externalLinks}</strong><small>去重后的出站链接</small></article>
        <article className="admin-stat"><span>高风险外链</span><strong>{report.summary.highRiskExternalLinks}</strong><small>需人工复核</small></article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">页面内链</p>
            <h2>内容发布时的内链建议</h2>
          </div>
          <span className="admin-result-count">{report.internalRows.length} 个页面</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>页面</th>
                <th>类型</th>
                <th>推荐内链</th>
                <th>建议锚文本</th>
              </tr>
            </thead>
            <tbody>
              {internalRows.map((row) => (
                <tr key={`${row.type}-${row.href}`}>
                  <td><Link href={row.href} target="_blank">{row.title}</Link></td>
                  <td>{typeLabels[row.type] || row.type}</td>
                  <td>{row.suggestions.length}</td>
                  <td>
                    <div className="admin-link-chip-list">
                      {row.suggestions.slice(0, 5).map((item) => (
                        <Link href={item.href} target="_blank" key={item.href}>{item.anchor || item.title}</Link>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination params={params} pageKey="internalPage" page={internalPage} total={report.internalRows.length} />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">出站链接</p>
            <h2>外链质量分级</h2>
          </div>
          <span className="admin-result-count">{report.externalRows.length} 条链接</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>外链</th>
                <th>来源位置</th>
                <th>风险</th>
                <th>建议 rel</th>
                <th>原因</th>
              </tr>
            </thead>
            <tbody>
              {externalRows.map((row) => (
                <tr key={row.url}>
                  <td><a href={row.url} target="_blank" rel="noopener noreferrer nofollow">{row.domain}</a></td>
                  <td>{sourceLabel(row.source)}</td>
                  <td><span className={`admin-risk-pill ${row.risk}`}>{riskLabels[row.risk] || row.risk}</span></td>
                  <td>{row.recommendedRel === "review before publishing" ? "发布前复核" : <code>{row.recommendedRel}</code>}</td>
                  <td>{reasonLabels[row.reason] || row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination params={params} pageKey="externalPage" page={externalPage} total={report.externalRows.length} />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">维护建议</p>
            <h2>每次发布内容的操作清单</h2>
          </div>
        </div>
        <ul className="admin-check-list">
          {report.recommendations.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="admin-note-box">
          当前没有可生成的 <code>disavow.txt</code>。外部垃圾反链必须来自 Google Search Console、Ahrefs 或 Semrush 的真实反链导出，不能凭空生成，避免误伤正常链接。
        </div>
      </section>
    </div>
  );
}
