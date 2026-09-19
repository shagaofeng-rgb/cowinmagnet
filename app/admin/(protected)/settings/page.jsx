import { getAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "账户设置 | Cowinmagnet 后台"
};

export default async function SettingsPage() {
  const session = await getAdminSession();

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">账户设置</p>
          <h1>后台账户与通知</h1>
          <p>查看当前登录账户，并通过客户表单及时跟进网站线索。</p>
        </div>
        <div className="admin-status good">账户正常</div>
      </header>

      <section className="admin-grid two">
        <article className="admin-panel">
          <p className="eyebrow">当前账户</p>
          <h2>登录信息</h2>
          <dl className="admin-definition-list">
            <div><dt>登录邮箱</dt><dd>{session?.email || "-"}</dd></div>
            <div><dt>账户状态</dt><dd>正常</dd></div>
          </dl>
        </article>
        <article className="admin-panel">
          <p className="eyebrow">线索通知</p>
          <h2>客户提交提醒</h2>
          <p className="admin-muted">新的客户表单会保存在客户表单列表中，建议每日查看并更新跟进状态。</p>
        </article>
      </section>
    </div>
  );
}
