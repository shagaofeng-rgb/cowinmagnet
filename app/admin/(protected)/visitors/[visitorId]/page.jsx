import Link from "next/link";
import { notFound } from "next/navigation";
import { readAnalyticsVisitorJourney } from "@/lib/analyticsStore";

export const dynamic = "force-dynamic";

function formatTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date(value));
}

function eventLabel(event) {
  if (event.type === "form_submit") return "提交询盘";
  if (event.type === "click_whatsapp" || event.type === "whatsapp_click") return "点击 WhatsApp";
  return "浏览页面";
}

export default async function VisitorDetailPage({ params }) {
  const { visitorId } = await params;
  const id = String(visitorId || "").trim();
  if (!id || id.length > 80) notFound();
  const journey = await readAnalyticsVisitorJourney({ visitorId: id });
  const events = Array.isArray(journey.events) ? journey.events : [];
  const pages = new Set(events.map((event) => event.page).filter(Boolean));
  const sessions = new Set(events.map((event) => event.sessionId).filter(Boolean));
  const latest = events[0];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">客户访问详情</p>
          <h1>客户完整访问路径</h1>
          <p>同一匿名访客标识下的页面浏览、询盘和 WhatsApp 点击会归并在这一时间线中。该归属基于浏览器访客标识，不会把不同设备或不同浏览器强行合并。</p>
        </div>
        <Link className="admin-detail-link" href="/admin/visitors">返回客户列表</Link>
      </header>

      {!journey.available ? <div className="admin-alert warning">访问明细暂时无法读取，请稍后重试。</div> : null}
      <section className="admin-grid four">
        <article className="admin-stat"><span>访问事件</span><strong>{events.length}</strong></article>
        <article className="admin-stat"><span>会话数</span><strong>{sessions.size}</strong></article>
        <article className="admin-stat"><span>浏览页面</span><strong>{pages.size}</strong></article>
        <article className="admin-stat"><span>最近来源</span><strong>{latest?.channel || "-"}</strong></article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div><p className="eyebrow">路径时间线</p><h2>全部可用访问记录</h2></div>
          <span className="admin-result-count">{events.length} 条</span>
        </div>
        {events.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>时间</th><th>行为</th><th>当前页面</th><th>上一页</th><th>来源</th><th>国家</th><th>设备</th></tr></thead><tbody>{events.map((event, index) => <tr key={`${event.timestamp}-${event.type}-${index}`}><td>{formatTime(event.timestamp)}</td><td>{eventLabel(event)}</td><td>{event.pageTitle || event.page || "-"}</td><td>{event.previousPage || "直接进入"}</td><td>{event.channel || "-"}</td><td>{event.country || "-"}</td><td>{event.device || "-"}</td></tr>)}</tbody></table></div> : <div className="admin-empty">该客户在当前存储中暂无可用访问路径。</div>}
      </section>
    </div>
  );
}
