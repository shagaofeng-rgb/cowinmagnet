import { BarList } from "@/components/admin/AdminWidgets";
import { getAnalyticsSnapshot } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "访问路径 | Cowinmagnet 后台"
};

export default async function JourneysPage() {
  const { journeys } = await getAnalyticsSnapshot();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">访问路径</p>
          <h1>客户浏览路径</h1>
          <p>查看客户从哪些页面进入产品详情、询盘页面和联系方式页面。</p>
        </div>
      </header>

      <section className="admin-panel">
        {journeys.length ? (
          <BarList rows={journeys.map((item) => ({ label: item.route, value: item.value }))} />
        ) : (
          <div className="admin-empty">
            当访客在同一个会话中浏览多个页面后，这里会显示更多路径数据。
          </div>
        )}
      </section>
    </div>
  );
}
