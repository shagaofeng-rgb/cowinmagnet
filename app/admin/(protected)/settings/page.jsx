import { hashAdminPassword, isAdminAuthConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Analytics Settings | Cowinmagnet Admin"
};

function configured(value) {
  return value ? "Configured" : "Not configured";
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
          <p className="eyebrow">Settings</p>
          <h1>Analytics Configuration</h1>
          <p>Manage admin login, GA4, Search Console and future database integration variables.</p>
        </div>
        <div className={isAdminAuthConfigured() ? "admin-status good" : "admin-status"}>
          {isAdminAuthConfigured() ? "Admin Enabled" : "Admin Disabled"}
        </div>
      </header>

      <section className="admin-panel">
        <h2>Environment Variables</h2>
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
        <h2>Password Hash Helper</h2>
        <p className="admin-muted">
          In production, set a strong ADMIN_JWT_SECRET first, then generate ADMIN_PASSWORD_HASH with the same secret.
          The hash below demonstrates the required format only.
        </p>
        <pre className="admin-code">{sampleHash}</pre>
      </section>
    </div>
  );
}
