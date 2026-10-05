"use client";

import { Activity, Box, Clock3, Eye, FileText, Globe2, MessageCircle, MousePointer2, Newspaper, Search, Users } from "lucide-react";
import { displayAdminLabel } from "@/lib/adminDisplayLabels";

const metricIcons = {
  页面浏览量: Eye,
  独立访客: Users,
  访问会话: MessageCircle,
  询盘提交: FileText,
  前台产品: Box,
  "Blog 文章": Newspaper,
  新闻文章: Newspaper,
  应用场景: Globe2,
  平均停留: Clock3,
  点击量: MousePointer2,
  曝光量: Eye,
  点击率: Activity,
  排名位置: Search
};

export function MetricCard({ label, value, note }) {
  const Icon = metricIcons[label] || Activity;
  return (
    <article className="admin-metric-card">
      <span className="admin-metric-icon"><Icon size={22} strokeWidth={1.9} aria-hidden="true" /></span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {note ? <small>{note}</small> : null}
      </div>
    </article>
  );
}

function localizeLabel(label) {
  const labels = {
    Indexed: "已收录",
    "Crawled - currently not indexed": "已抓取，暂未收录",
    "Discovered - currently not indexed": "已发现，暂未收录",
    "Search Analytics Connected": "搜索数据已连接",
    "URL Inspection can be added later": "URL 检查可后续接入"
  };
  if (/^(AI Search|AI Search Index)$/i.test(String(label))) return "推荐来源";
  if (/^(ChatGPT|Perplexity|Claude|Gemini|Microsoft Copilot|Phind|You\.com)$/i.test(String(label))) return "推荐来源";
  return labels[label] || displayAdminLabel(label);
}

function numericValue(row) {
  return Number(row.value || row.clicks || row.impressions || row.count || row.pv || 0);
}

function normalizePathLabel(label = "") {
  const value = String(label || "");
  const shouldNormalizePath =
    value.includes(" -> ") ||
    value.startsWith("/") ||
    /^https?:\/\//i.test(value);
  if (!shouldNormalizePath) return value;

  try {
    if (value.includes(" -> ")) {
      return value
        .split(" -> ")
        .map((part) => normalizePathLabel(part))
        .join(" -> ");
    }
    const url = value.startsWith("http") ? new URL(value) : new URL(value, "https://cowinmagnet.com");
    ["fbclid", "gclid", "gbraid", "wbraid", "msclkid"].forEach((key) => url.searchParams.delete(key));
    [...url.searchParams.keys()].forEach((key) => {
      if (key.startsWith("utm_")) url.searchParams.delete(key);
    });
    return `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ""}`;
  } catch {
    return value;
  }
}

export function BarList({ rows = [], label = "value" }) {
  const max = Math.max(...rows.map((row) => numericValue(row)), 1);
  const total = rows.reduce((sum, row) => sum + numericValue(row), 0);

  if (!rows.length) {
    return <div className="admin-empty compact">暂无可展示数据，收到更多访问后这里会自动生成图表。</div>;
  }

  return (
    <div className="admin-bar-list">
      {rows.map((row) => {
        const value = numericValue(row);
        const percent = total ? Math.round((value / total) * 100) : 0;
        const rowLabel = row.displayLabel || row.label || row.country || row.device || row.query || row.status || row.title || "Unknown";
        return (
          <div className="admin-bar-row" key={rowLabel}>
            <div className="admin-bar-row-head">
              <span title={String(rowLabel)}>{localizeLabel(normalizePathLabel(rowLabel))}</span>
              <strong>{Number(value).toLocaleString()}</strong>
            </div>
            <div className="admin-bar-track">
              <i style={{ width: `${value ? Math.max(5, (value / max) * 100) : 0}%` }} aria-label={`${label}: ${value}`} />
            </div>
            <small>{percent}%</small>
          </div>
        );
      })}
    </div>
  );
}

export function TrendChart({ rows = [] }) {
  const max = Math.max(...rows.map((row) => Math.max(row.pv || 0, row.uv || 0)), 1);
  const totalPv = rows.reduce((sum, row) => sum + Number(row.pv || 0), 0);
  const totalUv = rows.reduce((sum, row) => sum + Number(row.uv || 0), 0);

  if (!rows.length) {
    return <div className="admin-empty compact">暂无趋势数据。</div>;
  }

  return (
    <div className="admin-trend-wrap">
      <div className="admin-trend-summary">
        <span><b>{totalPv.toLocaleString()}</b> PV</span>
        <span><b>{totalUv.toLocaleString()}</b> UV</span>
      </div>
      <div className="admin-trend" style={{ "--trend-count": rows.length || 1 }} aria-label="流量趋势">
        {rows.map((row) => {
          const pv = Number(row.pv || 0);
          const uv = Number(row.uv || 0);
          return (
            <div className="admin-trend-day" key={row.date} title={`${row.date}: ${pv} PV / ${uv} UV`}>
              <div className="admin-trend-bars">
                <span className="pv" style={{ height: `${pv ? Math.max(8, (pv / max) * 100) : 0}%` }} />
                <span className="uv" style={{ height: `${uv ? Math.max(8, (uv / max) * 100) : 0}%` }} />
              </div>
              <strong>{pv}</strong>
              <small>{String(row.date || "").slice(5)}</small>
            </div>
          );
        })}
      </div>
      <div className="admin-trend-legend">
        <span><i className="pv" />PV</span>
        <span><i className="uv" />UV</span>
      </div>
    </div>
  );
}

export function LineTrendChart({ rows = [] }) {
  if (!rows.length) return <div className="admin-empty compact">暂无趋势数据。</div>;

  const width = 700;
  const height = 230;
  const top = 12;
  const bottom = 205;
  const max = Math.max(1, ...rows.map((row) => Math.max(Number(row.pv || 0), Number(row.uv || 0))));
  const x = (index) => rows.length === 1 ? width / 2 : (index / (rows.length - 1)) * width;
  const y = (value) => bottom - (Number(value || 0) / max) * (bottom - top);
  const points = (key) => rows.map((row, index) => `${x(index)},${y(row[key])}`).join(" ");
  const labelStep = rows.length >= 20 ? 3 : rows.length >= 10 ? 2 : 1;

  return (
    <div className="admin-line-trend">
      <div className="admin-line-chart" role="img" aria-label={`页面浏览量及独立访客趋势，${rows.length} 个时间点`}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((step) => (
            <line key={step} x1="0" x2={width} y1={bottom - step * (bottom - top) / 4} y2={bottom - step * (bottom - top) / 4} className="admin-line-grid" />
          ))}
          <polyline points={points("pv")} className="admin-line-pv" />
          <polyline points={points("uv")} className="admin-line-uv" />
          {rows.map((row, index) => (
            <circle key={`${row.date}-${index}`} cx={x(index)} cy={y(row.pv)} r="3" className="admin-line-point">
              <title>{`${row.date}：${row.pv || 0} PV，${row.uv || 0} UV`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <div className="admin-line-axis" aria-hidden="true">
        {rows.filter((_, index) => index % labelStep === 0 || index === rows.length - 1).map((row, index) => <span key={`${row.date}-${index}`}>{row.date}</span>)}
      </div>
      <div className="admin-line-legend"><span><i className="pv" />页面浏览量</span><span><i className="uv" />独立访客</span></div>
    </div>
  );
}

export function CsvExportButton({ rows, filename = "cowin-analytics.csv" }) {
  function exportCsv() {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) return;
    const headers = Object.keys(list[0]);
    const csv = [
      headers.join(","),
      ...list.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button className="admin-ghost-button" type="button" onClick={exportCsv}>
      导出 CSV
    </button>
  );
}
