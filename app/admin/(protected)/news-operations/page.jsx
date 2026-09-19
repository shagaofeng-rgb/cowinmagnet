import Link from "next/link";
import { getNewsOperationsDashboard } from "@/lib/newsOperations";

export const dynamic = "force-dynamic";

function date(value) {
  return value ? new Date(value).toLocaleString("zh-CN", { hour12: false }) : "-";
}

function publicationLabel(status) {
  const labels = {
    published_success: "发布成功",
    retry_pending: "等待下一次发布",
    paused: "已暂停",
    failed: "暂未完成"
  };
  return labels[status] || "暂无记录";
}

export default async function NewsOperationsPage() {
  let dashboard = null;
  try {
    dashboard = await getNewsOperationsDashboard();
  } catch {
    dashboard = null;
  }

  if (!dashboard) {
    return (
      <div className="admin-page">
        <header className="admin-page-head"><div><p className="eyebrow">新闻发布</p><h1>新闻发布状态</h1><p>发布信息暂时不可用，请稍后刷新。</p></div></header>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">新闻发布</p>
          <h1>新闻发布状态</h1>
          <p>查看新闻内容的发布进度与近期发布记录。</p>
        </div>
        <div className="admin-status good">内容服务正常</div>
      </header>

      <section className="admin-grid four">
        <article className="admin-stat"><span>今日状态</span><strong>{dashboard.publicationStatus.publishedToday ? "已发布" : "待发布"}</strong></article>
        <article className="admin-stat"><span>可发布内容</span><strong>{dashboard.publicationStatus.eligibleCandidateCount}</strong></article>
        <article className="admin-stat"><span>最近发布</span><strong>{date(dashboard.publicationStatus.lastSuccessfulAt)}</strong></article>
        <article className="admin-stat"><span>当前进度</span><strong>{publicationLabel(dashboard.publicationStatus.latestRunStatus)}</strong></article>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-headline">
          <div><p className="eyebrow">内容管理</p><h2>新闻内容</h2><p>可在新闻管理中查看、编辑和发布网站新闻。</p></div>
          <Link className="admin-detail-link" href="/admin/news">进入新闻管理</Link>
        </div>
      </section>

      <section className="admin-panel">
        <p className="eyebrow">近期记录</p>
        <h2>发布记录</h2>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>开始时间</th><th>状态</th></tr></thead><tbody>
          {dashboard.runs.length ? dashboard.runs.map((run) => <tr key={run.id}><td>{date(run.started_at)}</td><td>{publicationLabel(run.status)}</td></tr>) : <tr><td colSpan="2">暂无发布记录。</td></tr>}
        </tbody></table></div>
      </section>
    </div>
  );
}
