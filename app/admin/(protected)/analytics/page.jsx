import { BarList, MetricCard, TrendChart } from "@/components/admin/AdminWidgets";
import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "流量分析 | Cowinmagnet 后台"
};

export default async function TrafficAnalyticsPage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const { overview, traffic } = await getAnalyticsSnapshot(range);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">流量分析</p>
          <h1>来源渠道与设备分析</h1>
          <p>了解海外客户从哪里进入网站、使用什么设备，以及询盘前关注了哪些页面。</p>
        </div>
        <AdminDateRangeFilter range={range} />
      </header>

      <section className="admin-grid four">
        <MetricCard label="平均停留" value={`${overview.avgDuration}s`} note="页面参与度" />
        <MetricCard label="跳出率" value={`${overview.bounceRate}%`} note="估算值" />
        <MetricCard label="国家地区" value={traffic.countries.length} note="活跃市场" />
        <MetricCard label="设备类型" value={traffic.devices.length} note="访问设备" />
      </section>

      <section className="admin-panel">
        <p className="eyebrow">每日趋势</p>
        <h2>每日浏览量变化</h2>
        <TrendChart rows={traffic.series} />
      </section>

      <section className="admin-grid three">
        <article className="admin-panel">
          <p className="eyebrow">获客来源</p>
          <h2>渠道分布</h2>
          <BarList rows={traffic.channels} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">目标市场</p>
          <h2>国家 / 地区</h2>
          <BarList rows={traffic.countries} />
        </article>
        <article className="admin-panel">
          <p className="eyebrow">设备环境</p>
          <h2>设备类型</h2>
          <BarList rows={traffic.devices} />
        </article>
      </section>
    </div>
  );
}
