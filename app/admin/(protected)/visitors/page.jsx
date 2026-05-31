import { CsvExportButton } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Visitors | Cowinmagnet Admin"
};

export default async function VisitorsPage() {
  const { visitors } = await getAnalyticsSnapshot();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Visitors</p>
          <h1>Recent Buyer Visits</h1>
          <p>IP addresses are anonymized by default while preserving useful country, device and channel signals.</p>
        </div>
        <CsvExportButton rows={visitors} filename="cowin-visitors.csv" />
      </header>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Country</th>
                <th>Device</th>
                <th>Browser</th>
                <th>Channel</th>
                <th>Page</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((visitor, index) => (
                <tr key={`${visitor.sessionId}-${index}`}>
                  <td>{new Date(visitor.timestamp).toLocaleString()}</td>
                  <td>{visitor.country || "Unknown"}</td>
                  <td>{visitor.device}</td>
                  <td>{visitor.browser}</td>
                  <td>{visitor.channel}</td>
                  <td>{visitor.page}</td>
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
