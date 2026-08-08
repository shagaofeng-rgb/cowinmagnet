import Link from "next/link";
import { getNewsOperationsDashboard } from "@/lib/newsOperations";

export const dynamic = "force-dynamic";

function date(value) {
  return value ? new Date(value).toLocaleString("zh-CN") : "-";
}

export default async function NewsOperationsPage() {
  let dashboard;
  let error = "";
  try {
    dashboard = await getNewsOperationsDashboard();
  } catch (reason) {
    error = reason instanceof Error ? reason.message : "新闻运营数据库不可用";
  }

  if (error) {
    return <div className="admin-page"><header className="admin-page-head"><div><p className="eyebrow">NEWS OPERATIONS</p><h1>自主新闻运营</h1><p>当前模块需要 PostgreSQL 持久化存储，未使用临时文件或内存代替。</p></div></header><div className="admin-alert">{error}</div></div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div><p className="eyebrow">NEWS OPERATIONS</p><h1>自主新闻运营</h1><p>每日采集线索；每 48 小时最多发布一篇。自动发布只在环境变量开启且所有自动质量闸门通过时执行。</p></div>
        <div className={`admin-status ${dashboard.config.enabled ? "good" : ""}`}>{dashboard.config.enabled ? "自动发布已开启" : "自动发布已暂停"}</div>
      </header>
      <section className="admin-panel"><h2>运行状态</h2><p className="admin-muted">存储：PostgreSQL | 时区：{dashboard.config.timezone} | 生成器：{dashboard.config.hasGenerator ? dashboard.config.model : "未配置"} | 发布间隔：48 小时</p><p className="admin-muted">首批 10 个选题仅作为排期草稿。只有设置 <code>NEWS_AUTOPUBLISH_ENABLED=true</code> 后，系统才会尝试自动发布；无需每篇人工审核，但所有质量门必须通过。</p><Link href="/admin/news">打开 News 内容管理</Link></section>
      <section className="admin-panel"><h2>来源白名单</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>来源</th><th>优先级</th><th>RSS</th><th>状态</th></tr></thead><tbody>{dashboard.sources.map((source) => <tr key={source.id}><td>{source.name}<br /><small>{source.domain}</small></td><td>{source.priority}</td><td>{source.rssUrl || "-"}</td><td>{source.active && source.allowed ? "Active" : "Disabled"}</td></tr>)}</tbody></table></div></section>
      <section className="admin-panel"><h2>选题排期</h2><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>行业</th><th>主产品</th><th>角度</th><th>状态</th></tr></thead><tbody>{dashboard.plans.map((plan) => <tr key={plan.id}><td>{plan.industry}</td><td>{plan.primary_product_id || plan.primaryProductId}</td><td>{plan.angle}<br /><small>{plan.reason}</small></td><td>{plan.status}</td></tr>)}</tbody></table></div></section>
      <section className="admin-panel"><h2>最近候选与发布记录</h2><p className="admin-muted">候选、质量拒绝原因和发布运行日志均保存在数据库。管理动作可通过受保护 API 发起：<code>/api/admin/news-operations</code>。</p><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>候选</th><th>来源</th><th>日期</th><th>状态</th></tr></thead><tbody>{dashboard.candidates.map((candidate) => <tr key={candidate.id}><td>{candidate.title}</td><td>{candidate.publisher}</td><td>{date(candidate.published_at || candidate.publishedAt)}</td><td>{candidate.status}</td></tr>)}</tbody></table></div></section>
    </div>
  );
}
