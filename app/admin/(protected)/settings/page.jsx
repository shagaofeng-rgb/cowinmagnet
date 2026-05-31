import { hashAdminPassword, isAdminAuthConfigured } from "@/lib/adminAuth";

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

export default function SettingsPage() {
  const sampleHash = hashAdminPassword("replace-with-your-password");
  const rows = [
    ["ADMIN_EMAIL", process.env.ADMIN_EMAIL || "davidsha@cowinmagnet.com"],
    ["ADMIN_PASSWORD_HASH", configured(process.env.ADMIN_PASSWORD_HASH)],
    ["ADMIN_JWT_SECRET", configured(process.env.ADMIN_JWT_SECRET)],
    ["DATABASE_URL", configured(process.env.DATABASE_URL)],
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
          <h1>数据后台配置</h1>
          <p>管理后台登录、在线数据库、GA4、Search Console 和后续数据接口配置。</p>
        </div>
        <div className={isAdminAuthConfigured() ? "admin-status good" : "admin-status"}>
          {isAdminAuthConfigured() ? "后台已启用" : "后台未启用"}
        </div>
      </header>

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
          生产环境建议先设置强随机 ADMIN_JWT_SECRET，再用同一个密钥生成 ADMIN_PASSWORD_HASH。
          下面仅展示 Hash 格式示例。
        </p>
        <pre className="admin-code">{sampleHash}</pre>
      </section>
    </div>
  );
}
