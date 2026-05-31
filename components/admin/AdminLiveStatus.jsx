"use client";

import { useEffect, useState } from "react";

export default function AdminLiveStatus() {
  const [status, setStatus] = useState({
    loading: true,
    pageViews: 0,
    inquiries: 0,
    syncedAt: ""
  });

  useEffect(() => {
    let active = true;

    async function sync() {
      try {
        const response = await fetch("/api/admin/analytics/overview", { cache: "no-store" });
        if (!response.ok) throw new Error("sync failed");
        const data = await response.json();
        if (!active) return;
        setStatus({
          loading: false,
          pageViews: data.pageViews || 0,
          inquiries: data.inquiries || 0,
          syncedAt: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        });
      } catch {
        if (!active) return;
        setStatus((current) => ({ ...current, loading: false, syncedAt: "同步失败" }));
      }
    }

    sync();
    const timer = window.setInterval(sync, 30000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="admin-live-status">
      <span>在线实时同步</span>
      <strong>{status.loading ? "连接中..." : `${status.pageViews} PV / ${status.inquiries} 询盘`}</strong>
      <small>最近同步：{status.syncedAt || "-"}</small>
    </div>
  );
}
