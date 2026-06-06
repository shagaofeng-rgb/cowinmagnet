"use client";

export function MetricCard({ label, value, note }) {
  return (
    <article className="admin-metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {note ? <small>{note}</small> : null}
      </div>
      <i aria-hidden="true" />
    </article>
  );
}

function localizeLabel(label) {
  const labels = {
    Direct: "直接访问",
    "Organic Search": "自然搜索",
    Social: "社交媒体",
    Referral: "外部推荐",
    Desktop: "电脑端",
    Mobile: "手机端",
    Tablet: "平板",
    Chrome: "Chrome 浏览器",
    Safari: "Safari 浏览器",
    Firefox: "Firefox 浏览器",
    Edge: "Edge 浏览器",
    Other: "其他",
    Windows: "Windows 系统",
    macOS: "macOS 系统",
    Android: "Android 系统",
    iOS: "iOS 系统",
    Linux: "Linux 系统",
    Indexed: "已收录",
    "Crawled - currently not indexed": "已抓取，暂未收录",
    "Discovered - currently not indexed": "已发现，暂未收录",
    "Search Analytics Connected": "搜索数据已连接",
    "URL Inspection can be added later": "URL 检查可后续接入"
  };
  return labels[label] || label;
}

function numericValue(row) {
  return Number(row.value || row.clicks || row.impressions || row.count || row.pv || 0);
}

function normalizePathLabel(label = "") {
  const value = String(label || "");
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
        const rowLabel = row.label || row.country || row.device || row.query || row.status || row.title || "Unknown";
        return (
          <div className="admin-bar-row" key={rowLabel}>
            <div className="admin-bar-row-head">
              <span title={String(rowLabel)}>{localizeLabel(normalizePathLabel(rowLabel))}</span>
              <strong>{Number(value).toLocaleString()}</strong>
            </div>
            <div className="admin-bar-track">
              <i style={{ width: `${Math.max(5, (value / max) * 100)}%` }} aria-label={`${label}: ${value}`} />
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
                <span className="pv" style={{ height: `${Math.max(8, (pv / max) * 100)}%` }} />
                <span className="uv" style={{ height: `${Math.max(8, (uv / max) * 100)}%` }} />
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
