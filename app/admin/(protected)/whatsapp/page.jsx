import AdminDateRangeFilter from "@/components/admin/AdminDateRangeFilter";
import WhatsAppAnalyticsPanel from "@/components/admin/WhatsAppAnalyticsPanel";
import { getAdminSession } from "@/lib/adminAuth";
import { getAdminDateRange } from "@/lib/adminDateRange";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "WhatsApp 分析 | Cowinmagnet 后台"
};

export default async function WhatsAppAnalyticsPage({ searchParams }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const range = getAdminDateRange(await searchParams);
  const rangeKey = `${range.preset}:${range.startInput}:${range.endInput}`;
  const snapshot = await getAnalyticsSnapshot({
    ...range,
    cache: false,
    preferStoredSnapshot: false
  });

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">WhatsApp 会话分析</p>
          <h1>发起会话点击与访客路径</h1>
          <p>记录站内 WhatsApp 入口点击、来源、页面和产品上下文。点击仅代表访客发起跳转，不代表消息已发送、已回复或已成交。</p>
        </div>
        <AdminDateRangeFilter key={rangeKey} range={range} />
      </header>

      <WhatsAppAnalyticsPanel key={rangeKey} initialData={snapshot.whatsapp || {}} />
    </div>
  );
}
