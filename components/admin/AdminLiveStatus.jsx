"use client";

import { useEffect, useState } from "react";

const syncIntervalMs = 30 * 60 * 1000;

export default function AdminLiveStatus({ rangeQuery }) {
  const [status, setStatus] = useState({
    loading: true,
    pageViews: null,
    inquiries: null,
    syncedAt: "",
    error: false
  });

  useEffect(() => {
    let active = true;

    async function sync() {
      if (document.visibilityState === "hidden") return;
      try {
        const response = await fetch(`/api/admin/analytics/overview${rangeQuery ? `?${rangeQuery}` : ""}`, { cache: "no-store" });
        if (!response.ok) throw new Error("sync failed");
        const data = await response.json();
        if (!active) return;
        if (data.storageMode !== "database" || !data.generatedAt) throw new Error("analytics not available");
        setStatus({
          loading: false,
          error: false,
          pageViews: data.pageViews ?? null,
          inquiries: data.inquiries ?? null,
          syncedAt: new Date(data.generatedAt).toLocaleTimeString("zh-CN", {
            timeZone: "Asia/Shanghai",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          })
        });
      } catch {
        if (!active) return;
        setStatus((current) => ({ ...current, loading: false, error: true }));
      }
    }

    sync();
    const timer = window.setInterval(sync, syncIntervalMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [rangeQuery]);

  return (
    <div className="admin-live-status">
      <span>数据更新时间</span>
      <strong>{status.loading ? "连接中…" : status.pageViews == null ? "数据暂不可用" : `${status.pageViews} PV / ${status.inquiries ?? "—"} 询盘`}</strong>
      <small>{status.error ? "更新暂时失败 · " : ""}{status.syncedAt ? `上次更新 ${status.syncedAt}（北京时间）` : "等待数据更新"}</small>
    </div>
  );
}
