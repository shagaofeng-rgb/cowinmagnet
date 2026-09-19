import Link from "next/link";
import AdminPasswordField from "@/components/admin/AdminPasswordField";
import { getConfiguredAdminEmail } from "@/lib/adminAccountStore";
import { isAdminAuthConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "后台登录 | Cowinmagnet"
};

const errorMessages = {
  invalid: "邮箱或密码不正确。",
  "not-configured": "后台暂时不可用，请联系网站管理员。",
  "rate-limited": "登录尝试过于频繁，请稍后再试。"
};

export default async function AdminLoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const reset = params?.reset;
  const configured = await isAdminAuthConfigured();

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
          登录后可以查看网站访问数据、询盘信号、SEO 数据，并管理后台上传的产品和 News 内容。
        </p>

        {!configured ? (
          <div className="admin-alert">
            后台暂时不可用，请联系网站管理员。
          </div>
        ) : null}

        {reset === "success" ? <div className="admin-alert good">密码已重置，请使用新密码登录。</div> : null}
        {error ? <div className="admin-alert">{errorMessages[error] || "登录失败。"}</div> : null}

        <form className="admin-login-form" action="/api/admin/login" method="post">
          <label>
            登录邮箱
            <input name="email" type="email" defaultValue={getConfiguredAdminEmail()} required />
          </label>
          <AdminPasswordField />
          <button type="submit" disabled={!configured}>
            登录后台
          </button>
        </form>

        <Link className="admin-login-helper" href="/admin/forgot-password">
          忘记密码？
        </Link>
      </section>
    </main>
  );
}
