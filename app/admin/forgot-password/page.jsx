import Link from "next/link";
import { getConfiguredAdminEmail } from "@/lib/adminAccountStore";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "忘记密码 | Cowinmagnet 后台"
};

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;
  const sent = params?.sent === "1";

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/admin/login">
          <span>CY</span>
          <strong>Cowinmagnet</strong>
        </Link>
        <p className="eyebrow">后台账号安全</p>
        <h1>忘记密码</h1>
        <p className="admin-login-copy">
          输入管理员邮箱后，如果账号存在，系统会发送一个 60 分钟内有效的密码重置链接。
        </p>

        {sent ? (
          <div className="admin-alert good">
            If the email exists, a password reset link has been sent.
          </div>
        ) : null}

        <form className="admin-login-form" action="/api/admin/forgot-password" method="post">
          <label>
            管理员邮箱
            <input name="email" type="email" defaultValue={getConfiguredAdminEmail()} required />
          </label>
          <button type="submit">发送重置邮件</button>
        </form>

        <Link className="admin-login-helper" href="/admin/login">
          返回登录
        </Link>
      </section>
    </main>
  );
}
