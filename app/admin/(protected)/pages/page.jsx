import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import { AdminPagesRealtime } from "@/components/admin/AdminRealtimePanels";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "页面表现 | Cowinmagnet 后台"
};

export default async function PagesPerformancePage({ searchParams }) {
  const range = getAdminDateRange(await searchParams);
  const rangeKey = `${range.preset}:${range.startInput}:${range.endInput}`;
  const data = await getAnalyticsSnapshot(range);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">页面表现</p>
          <h1>落地页数据表现</h1>
          <p>按浏览量、访客数、停留时间和询盘事件，比较产品页、博客、新闻和询盘页的效果。</p>
        </div>
        <AdminDateRangeFilter key={rangeKey} range={range} />
      </header>

      <AdminPagesRealtime key={rangeKey} initialData={data} />
    </div>
  );
}
