import Link from "next/link";
import { isAdminAuthConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "后台登录 | Cowinmagnet"
};

const errorMessages = {
  invalid: "邮箱或密码不正确。",
  "not-configured": "后台密码还没有配置。请在 Vercel 中添加 ADMIN_PASSWORD_HASH 或 ADMIN_PASSWORD。"
};

export default function AdminLoginPage({ searchParams }) {
  const error = searchParams?.error;
  const configured = isAdminAuthConfigured();

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/en">
          <span>CY</span>
          <strong>Cowinmagnet</strong>
        </Link>
        <p className="eyebrow">网站数据后台</p>
        <h1>后台登录</h1>
        <p className="admin-login-copy">
          查看网站流量、访客行为、询盘事件和 Google SEO 数据，帮助你判断哪些页面真正带来客户。
        </p>

        {!configured ? (
          <div className="admin-alert">
            后台登录暂未启用，请先配置后台密码环境变量。
          </div>
        ) : null}

        {error ? <div className="admin-alert">{errorMessages[error] || "登录失败。"}</div> : null}

        <form className="admin-login-form" action="/api/admin/login" method="post">
          <label>
            登录邮箱
            <input name="email" type="email" defaultValue="davidsha@cowinmagnet.com" required />
          </label>
          <label>
            登录密码
            <input name="password" type="password" placeholder="请输入后台密码" required />
          </label>
          <button type="submit" disabled={!configured}>
            登录后台
          </button>
        </form>
      </section>
    </main>
  );
}
