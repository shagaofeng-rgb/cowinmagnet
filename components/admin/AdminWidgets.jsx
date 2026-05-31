"use client";

export function MetricCard({ label, value, note }) {
  return (
    <article className="admin-metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small>{note}</small> : null}
    </article>
  );
}

export function BarList({ rows, label = "value" }) {
  const max = Math.max(...rows.map((row) => row.value || row.clicks || row.impressions || 1), 1);
  return (
    <div className="admin-bar-list">
      {rows.map((row) => {
        const value = row.value || row.clicks || row.impressions || 0;
        return (
          <div className="admin-bar-row" key={row.label || row.country || row.device || row.query || row.status}>
            <div>
              <span>{row.label || row.country || row.device || row.query || row.status}</span>
              <strong>{value.toLocaleString()}</strong>
            </div>
            <i style={{ width: `${Math.max(7, (value / max) * 100)}%` }} aria-label={`${label}: ${value}`} />
          </div>
        );
      })}
    </div>
  );
}

export function TrendChart({ rows }) {
  const max = Math.max(...rows.map((row) => row.pv || 1), 1);
  return (
    <div className="admin-trend" aria-label="Traffic trend">
      {rows.map((row) => (
        <div className="admin-trend-day" key={row.date}>
          <span style={{ height: `${Math.max(10, (row.pv / max) * 100)}%` }} />
          <small>{row.date.slice(5)}</small>
        </div>
      ))}
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
      Export CSV
    </button>
  );
}
