import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "重置密码 | Cowinmagnet 后台"
};

const errorMessages = {
  weak: "新密码至少 10 位，并包含大小写字母和数字。",
  mismatch: "两次输入的新密码不一致。",
  invalid: "重置链接无效或已过期，请重新申请。"
};

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = String(params?.token || "");
  const error = params?.error;

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/admin/login">
          <span>CY</span>
          <strong>Cowinmagnet</strong>
        </Link>
        <p className="eyebrow">后台账号安全</p>
        <h1>重置密码</h1>
        <p className="admin-login-copy">
          设置一个新的后台管理员密码。重置链接只能使用一次，并会在 60 分钟后过期。
        </p>

        {error ? <div className="admin-alert">{errorMessages[error] || "密码重置失败。"}</div> : null}

        <form className="admin-login-form" action="/api/admin/reset-password" method="post">
          <input name="token" type="hidden" value={token} />
          <label>
            新密码
            <input name="password" type="password" placeholder="至少 10 位，包含大小写字母和数字" required />
          </label>
          <label>
            确认新密码
            <input name="confirmPassword" type="password" placeholder="再次输入新密码" required />
          </label>
          <button type="submit" disabled={!token}>
            保存新密码
          </button>
        </form>

        <Link className="admin-login-helper" href="/admin/forgot-password">
          重新发送重置邮件
        </Link>
      </section>
    </main>
  );
}
