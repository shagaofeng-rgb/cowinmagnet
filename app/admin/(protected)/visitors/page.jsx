import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { AdminVisitorsRealtime } from "@/components/admin/AdminRealtimePanels";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "访客记录 | Cowinmagnet 后台"
};

export default async function VisitorsPage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const data = await getAnalyticsSnapshot(range);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">访客记录</p>
          <h1>近期客户访问记录</h1>
          <p>系统默认匿名化 IP，同时保留国家地区、设备、浏览器和来源渠道等有用信号。</p>
        </div>
        <AdminDateRangeFilter range={range} />
      </header>

      <AdminVisitorsRealtime initialData={data} />
    </div>
  );
}
