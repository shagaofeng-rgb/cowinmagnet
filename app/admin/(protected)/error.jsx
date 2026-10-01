"use client";

export default function AdminError({ reset }) {
  return (
    <div className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">错误</p>
        <h1>数据加载失败</h1>
        <p>数据暂时无法加载，请稍后重试。页面显示异常不代表历史记录已被删除。</p>
        <button className="admin-ghost-button" type="button" onClick={reset}>
          重新加载
        </button>
      </section>
    </div>
  );
}
