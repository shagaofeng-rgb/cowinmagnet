import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { AdminTrafficRealtime } from "@/components/admin/AdminRealtimePanels";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "流量分析 | Cowinmagnet 后台"
};

export default async function TrafficAnalyticsPage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const rangeKey = `${range.preset}:${range.startInput}:${range.endInput}`;
  const data = await getAnalyticsSnapshot(range);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">流量分析</p>
          <h1>来源渠道与设备分析</h1>
          <p>了解海外客户从哪里进入网站、使用什么设备，以及询盘前关注了哪些页面。</p>
        </div>
        <AdminDateRangeFilter key={rangeKey} range={range} />
      </header>

      <AdminTrafficRealtime key={rangeKey} initialData={data} />
    </div>
  );
}
