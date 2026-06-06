import { hashAdminPassword, isAdminAuthConfigured } from "@/lib/adminAuth";
import { adminAccountStorageMode } from "@/lib/adminAccountStore";
import { isSmtpConfigured } from "@/lib/adminEmail";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "系统设置 | Cowinmagnet 后台"
};

function configured(value) {
  return value ? "已配置" : "未配置";
}

function mask(value) {
  if (!value) return "-";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export default async function SettingsPage() {
  const authConfigured = await isAdminAuthConfigured();
  const sampleHash = hashAdminPassword("replace-with-your-password");
  const rows = [
    ["ADMIN_EMAIL", process.env.ADMIN_EMAIL || "davidsha@cowinmagnet.com"],
    ["ADMIN_NAME", process.env.ADMIN_NAME || "-"],
    ["ADMIN_PASSWORD_HASH", configured(process.env.ADMIN_PASSWORD_HASH)],
    ["ADMIN_DEFAULT_PASSWORD", configured(process.env.ADMIN_DEFAULT_PASSWORD)],
    ["ADMIN_PASSWORD", configured(process.env.ADMIN_PASSWORD)],
    ["ADMIN_JWT_SECRET", configured(process.env.ADMIN_JWT_SECRET)],
    ["Admin account storage", adminAccountStorageMode()],
    ["DATABASE_URL", configured(process.env.DATABASE_URL)],
    ["SMTP_HOST", process.env.SMTP_HOST || "-"],
    ["SMTP_PORT", process.env.SMTP_PORT || "-"],
    ["SMTP_USER", process.env.SMTP_USER || "-"],
    ["SMTP_PASSWORD / SMTP_PASS", configured(process.env.SMTP_PASSWORD || process.env.SMTP_PASS)],
    ["SMTP_FROM / INQUIRY_FROM_EMAIL", process.env.SMTP_FROM || process.env.INQUIRY_FROM_EMAIL || "-"],
    ["INQUIRY_TO_EMAIL", process.env.INQUIRY_TO_EMAIL || "-"],
    ["INQUIRY_BCC_EMAILS", process.env.INQUIRY_BCC_EMAILS || "-"],
    ["NEXT_PUBLIC_GA_MEASUREMENT_ID", mask(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID)],
    ["GOOGLE_ANALYTICS_PROPERTY_ID", configured(process.env.GOOGLE_ANALYTICS_PROPERTY_ID)],
    ["GOOGLE_SEARCH_CONSOLE_SITE_URL", process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "-"],
    ["GOOGLE_CLIENT_EMAIL", configured(process.env.GOOGLE_CLIENT_EMAIL)],
    ["GOOGLE_PRIVATE_KEY", configured(process.env.GOOGLE_PRIVATE_KEY)]
  ];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="eyebrow">系统设置</p>
          <h1>后台配置检查</h1>
          <p>检查后台登录、数据库、SMTP 邮件、GA4、Search Console 和内容同步相关配置。</p>
        </div>
        <div className={authConfigured ? "admin-status good" : "admin-status"}>
          {authConfigured ? "后台已启用" : "后台未启用"}
        </div>
      </header>

      <section className="admin-grid two">
        <article className={authConfigured ? "admin-status good" : "admin-status"}>登录保护：{authConfigured ? "可用" : "未配置"}</article>
        <article className={isSmtpConfigured() ? "admin-status good" : "admin-status"}>
          SMTP 邮件：{isSmtpConfigured() ? "可用" : "未配置"}
        </article>
      </section>

      <section className="admin-panel">
        <h2>环境变量</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <tbody>
              {rows.map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-panel">
        <h2>密码 Hash 示例</h2>
        <p className="admin-muted">
          生产环境建议先设置强随机 ADMIN_JWT_SECRET，再用同一个密钥生成 ADMIN_PASSWORD_HASH。下面仅展示 Hash 格式示例。
        </p>
        <pre className="admin-code">{sampleHash}</pre>
      </section>
    </div>
  );
}
