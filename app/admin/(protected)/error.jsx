"use client";

export default function AdminError({ error, reset }) {
  return (
    <div className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">错误</p>
        <h1>数据加载失败</h1>
        <p>{error?.message || "请稍后重试。"}</p>
        <button className="admin-ghost-button" type="button" onClick={reset}>
          重新加载
        </button>
      </section>
    </div>
  );
}
