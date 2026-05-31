import { CsvExportButton } from "@/components/admin/AdminWidgets";
import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "访客记录 | Cowinmagnet 后台"
};

export default async function VisitorsPage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const { visitors } = await getAnalyticsSnapshot(range);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">访客记录</p>
          <h1>近期客户访问记录</h1>
          <p>系统默认匿名化 IP，同时保留国家地区、设备、浏览器和来源渠道等有用信号。</p>
        </div>
        <div className="admin-head-actions">
          <AdminDateRangeFilter range={range} />
          <CsvExportButton rows={visitors} filename="cowin-visitors.csv" />
        </div>
      </header>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>时间</th>
                <th>国家</th>
                <th>设备</th>
                <th>浏览器</th>
                <th>来源</th>
                <th>页面</th>
                <th>客户标签</th>
                <th>访问日</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor, index) => (
                <tr key={`${visitor.sessionId}-${index}`}>
                  <td>{new Date(visitor.timestamp).toLocaleString()}</td>
                  <td>{visitor.country || "未知"}</td>
                  <td>{visitor.device}</td>
                  <td>{visitor.browser}</td>
                  <td>{visitor.channel}</td>
                  <td>{visitor.page}</td>
                  <td>
                    <span className={`admin-customer-tag ${visitor.visitDayNumber === 1 ? "new" : "returning"}`}>
                      {visitor.customerTypeLabel}
                    </span>
                  </td>
                  <td>第 {visitor.visitDayNumber} 次访问日</td>
                  <td>{visitor.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
