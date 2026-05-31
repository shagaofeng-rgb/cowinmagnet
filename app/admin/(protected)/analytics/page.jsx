import { BarList, MetricCard, TrendChart } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Traffic Analytics | Cowinmagnet Admin"
};

export default async function TrafficAnalyticsPage() {
  const { overview, traffic } = await getAnalyticsSnapshot();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">Traffic</p>
          <h1>Traffic Sources and Devices</h1>
          <p>Understand where overseas buyers come from and which devices they use before sending inquiries.</p>
        </div>
      </header>

      <section className="admin-grid four">
        <MetricCard label="Avg. Time" value={`${overview.avgDuration}s`} note="Page engagement" />
        <MetricCard label="Bounce Rate" value={`${overview.bounceRate}%`} note="Estimated" />
        <MetricCard label="Countries" value={traffic.countries.length} note="Active regions" />
        <MetricCard label="Devices" value={traffic.devices.length} note="Device classes" />
      </section>

      <section className="admin-panel">
        <p className="eyebrow">Daily Trend</p>
        <h2>Page Views by Day</h2>
        <TrendChart rows={traffic.series} />
      </section>

      <section className="admin-grid three">
        <article className="admin-panel">
          <p className="eyebrow">Acquisition</p>
          <h2>Channels</h2>
          <BarList rows={traffic.channels} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">Markets</p>
          <h2>Countries / Regions</h2>
          <BarList rows={traffic.countries} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">Technology</p>
          <h2>Devices</h2>
          <BarList rows={traffic.devices} />
        </article>
      </section>
    </div>
  );
}
