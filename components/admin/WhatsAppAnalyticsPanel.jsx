"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BarList, CsvExportButton, MetricCard } from "@/components/admin/AdminWidgets";

function rows(value) {
  return Array.isArray(value) ? value : [];
}

function display(value) {
  return String(value || "").trim() || "-";
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

const eventLabels = {
  page_view: "浏览页面",
  session_end: "结束浏览",
  scroll_depth: "页面滚动",
  form_submit: "提交表单",
  submit_inquiry: "提交询盘",
  form_success: "表单提交成功",
  click_whatsapp: "点击 WhatsApp",
  whatsapp_click: "点击 WhatsApp",
  click_email: "点击邮箱",
  click_phone: "点击电话",
  outbound_link_click: "点击外部链接"
};

function placementLabel(value) {
  const labels = {
    floating: "悬浮窗口",
    header: "顶部导航",
    "mobile-menu": "移动端菜单",
    "footer-chat": "页脚咨询",
    "footer-social": "页脚社媒",
    "product-hero": "产品首屏",
    "product-final-cta": "产品底部 CTA",
    "contact-page": "联系页面",
    blog: "Blog 页面",
    other: "其他入口"
  };
  return labels[value] || display(value);
}

function PlacementLabel({ value }) {
  return placementLabel(value);
}

function Journey({ loading, journey, error }) {
  if (loading) return <div className="admin-empty compact">正在读取该访客的已关联浏览路径…</div>;
  if (error) return <div className="admin-alert warning">{error}</div>;
  if (!journey) return null;
  if (!journey.available) return <div className="admin-alert warning">分析存储暂不可用，无法读取浏览路径。</div>;
  if (!rows(journey.events).length) return <div className="admin-empty compact">当前点击没有可安全关联的浏览事件。</div>;

  return (
    <div className="admin-visitor-history">
      {journey.events.map((event, index) => (
        <article className="admin-visitor-event" key={`${event.timestamp}-${event.type}-${index}`}>
          <div className="admin-visitor-event-head">
            <strong>{eventLabels[event.type] || event.type}</strong>
            <time dateTime={event.timestamp}>{formatDateTime(event.timestamp)}</time>
          </div>
          <p>{display(event.pageTitle !== event.page ? event.pageTitle : event.page)}</p>
          <div className="admin-visitor-event-meta">
            {event.page ? <span>{event.page}</span> : null}
            {event.previousPage ? <span>来自 {event.previousPage}</span> : null}
            {[event.channel, event.country, event.device, event.browser].filter(Boolean).length ? <span>{[event.channel, event.country, event.device, event.browser].filter(Boolean).join(" · ")}</span> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function WhatsAppAnalyticsPanel({ initialData }) {
  const searchParams = useSearchParams();
  const [data, setData] = useState(initialData || {});
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState("");
  const [journey, setJourney] = useState(null);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [error, setError] = useState("");
  const events = rows(data.events);
  const csvRows = useMemo(() => events.map((event) => ({
    clicked_at: event.timestamp,
    status: event.clickStatus,
    placement: event.placement,
    page: event.page,
    product: event.productName,
    country: event.country,
    device: event.device,
    channel: event.channel,
    source: event.sourcePlatform,
    outbound_url: event.outboundUrl
  })), [events]);

  async function refresh() {
    setRefreshing(true);
    setError("");
    try {
      const query = searchParams.toString();
      const response = await fetch(`/api/admin/analytics/whatsapp${query ? `?${query}` : ""}`, { cache: "no-store" });
      if (!response.ok) throw new Error("refresh failed");
      setData(await response.json());
    } catch {
      setError("刷新失败，当前仍显示最近一次成功读取的数据。");
    } finally {
      setRefreshing(false);
    }
  }

  async function toggleJourney(event) {
    if (expandedId === event.id) {
      setExpandedId("");
      setJourney(null);
      return;
    }
    setExpandedId(event.id);
    setJourney(null);
    setJourneyLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        visitorId: event.visitorId || "",
        sessionId: event.sessionId || "",
        clickedAt: event.timestamp || ""
      });
      const response = await fetch(`/api/admin/analytics/whatsapp/journey?${query.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("journey failed");
      setJourney(await response.json());
    } catch {
      setError("无法读取该访客的浏览路径。");
    } finally {
      setJourneyLoading(false);
    }
  }

  const overview = data.overview || {};
  return (
    <>
      <section className="admin-metric-grid">
        <MetricCard label="WhatsApp 发起点击" value={Number(overview.clicks || 0).toLocaleString()} note="仅记录站内跳转意图" />
        <MetricCard label="独立访客" value={Number(overview.uniqueVisitors || 0).toLocaleString()} note="按匿名访客标识去重" />
        <MetricCard label="点击率" value={`${Number(overview.clickThroughRate || 0).toFixed(2)}%`} note="WhatsApp 点击 / 页面浏览" />
        <MetricCard label="悬浮窗口点击" value={Number(overview.floatingClicks || 0).toLocaleString()} note="全局 WhatsApp 悬浮入口" />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">会话发起入口</p>
            <h2>入口、来源与意向页面</h2>
            <p>后续接入 WhatsApp Business API 或 CRM Webhook 后，可在此基础上补充真实会话、回复和成交状态。</p>
          </div>
          <div className="admin-toolbar-actions">
            <CsvExportButton rows={csvRows} filename="cowin-whatsapp-clicks.csv" />
            <button className="admin-ghost-button" type="button" onClick={refresh} disabled={refreshing}>{refreshing ? "正在刷新…" : "刷新数据"}</button>
          </div>
        </div>
        {error ? <div className="admin-alert warning">{error}</div> : null}
        <div className="admin-grid two">
          <div><h3>点击入口</h3><BarList rows={rows(data.placements).map((row) => ({ ...row, displayLabel: placementLabel(row.label) }))} label="clicks" /></div>
          <div><h3>来源渠道</h3><BarList rows={data.channels} label="clicks" /></div>
          <div><h3>来源平台</h3><BarList rows={data.sourcePlatforms} label="clicks" /></div>
          <div><h3>点击页面</h3><BarList rows={data.pages} label="clicks" /></div>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div>
            <p className="eyebrow">点击记录</p>
            <h2>查看会话发起前后的浏览路径</h2>
            <p>每条记录只显示由相同匿名访客或会话标识直接关联的站内事件。</p>
          </div>
          <span className="admin-result-count">{events.length} 条记录</span>
        </div>
        {events.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>点击时间</th><th>入口</th><th>当前页面</th><th>产品</th><th>来源</th><th>国家 / 设备</th><th>状态</th><th>操作</th></tr></thead>
              <tbody>{events.map((event) => (
                <tr key={event.id}>
                  <td>{formatDateTime(event.timestamp)}</td>
                  <td><PlacementLabel value={event.placement} /></td>
                  <td><span title={event.pageTitle}>{display(event.page)}</span></td>
                  <td>{display(event.productName)}</td>
                  <td>{display(event.sourcePlatform)}<small className="admin-cell-subtext">{display(event.channel)}</small></td>
                  <td>{display(event.country)}<small className="admin-cell-subtext">{display(event.device)}</small></td>
                  <td><span className="admin-customer-tag new">已点击</span></td>
                  <td><button className="admin-ghost-button" type="button" onClick={() => toggleJourney(event)}>{expandedId === event.id ? "收起路径" : "查看路径"}</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <div className="admin-empty">当前时间范围内还没有 WhatsApp 点击记录。访客点击悬浮窗口、导航、产品页或页脚入口后会自动显示在这里。</div>}
        {expandedId ? <div className="admin-detail-history-section"><Journey loading={journeyLoading} journey={journey} error={error} /></div> : null}
      </section>
    </>
  );
}
