import Link from "next/link";
import { getLinkAuditReport } from "@/lib/linkStrategy";

const riskLabels = {
  safe: "安全外链",
  "needs-confirmation": "待确认",
  "high-risk": "高风险"
};

export default async function LinkAuditPage() {
  const report = await getLinkAuditReport();

  return (
    <div className="admin-page admin-link-audit-page">
      <section className="admin-hero">
        <div>
          <span className="admin-kicker">SEO 链接网络</span>
          <h1>内外链审计</h1>
          <p>检查产品、Blog、News、应用页之间的内链覆盖，并对当前代码和内容中的外链做风险分级。</p>
        </div>
        <div className="admin-hero-actions">
          <Link href="/api/admin/link-audit" className="admin-secondary-button">查看 JSON 报告</Link>
        </div>
      </section>

      <section className="admin-stat-grid">
        <div className="admin-stat-card"><span>内容页面</span><strong>{report.summary.pages}</strong><small>产品 / 应用 / Blog / News</small></div>
        <div className="admin-stat-card"><span>内链达标页面</span><strong>{report.summary.pagesWithEnoughInternalLinks}</strong><small>至少 2 条推荐内链</small></div>
        <div className="admin-stat-card"><span>外链总数</span><strong>{report.summary.externalLinks}</strong><small>去重后的出站链接</small></div>
        <div className="admin-stat-card"><span>高风险外链</span><strong>{report.summary.highRiskExternalLinks}</strong><small>发现后应立即删除或拒绝</small></div>
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <div>
            <span className="admin-kicker">自动推荐</span>
            <h2>内容发布时的内链建议</h2>
          </div>
          <p>推荐逻辑按标题、分类、摘要、正文关键词和产品应用场景匹配，每条内容保留 2-5 个自然内链。</p>
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
              {report.internalRows.map((row) => (
                <tr key={`${row.type}-${row.href}`}>
                  <td><Link href={row.href} target="_blank">{row.title}</Link></td>
                  <td>{row.type}</td>
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
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <div>
            <span className="admin-kicker">出站链接</span>
            <h2>外链质量分级</h2>
          </div>
          <p>安全外链可以保留；待确认外链需要人工确认用途；高风险外链应删除或加入拒绝外链清单。</p>
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
              {report.externalRows.map((row) => (
                <tr key={row.url}>
                  <td><a href={row.url} target="_blank" rel="noopener noreferrer nofollow">{row.domain}</a></td>
                  <td>{row.source}</td>
                  <td><span className={`admin-risk-pill ${row.risk}`}>{riskLabels[row.risk] || row.risk}</span></td>
                  <td><code>{row.recommendedRel}</code></td>
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-section-head">
          <div>
            <span className="admin-kicker">执行规则</span>
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
