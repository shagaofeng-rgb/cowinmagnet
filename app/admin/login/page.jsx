import Link from "next/link";
import { isAdminAuthConfigured } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Login | Cowinmagnet"
};

const errorMessages = {
  invalid: "Email or password is incorrect.",
  "not-configured": "Admin password is not configured yet. Add ADMIN_PASSWORD_HASH or ADMIN_PASSWORD in Vercel."
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
        <p className="eyebrow">Website Analytics</p>
        <h1>Admin Login</h1>
        <p className="admin-login-copy">
          View website traffic, visitor behavior, inquiry events and Search Console-ready SEO reports.
        </p>

        {!configured ? (
          <div className="admin-alert">
            Admin login is disabled until the password environment variable is configured.
          </div>
        ) : null}

        {error ? <div className="admin-alert">{errorMessages[error] || "Login failed."}</div> : null}

        <form className="admin-login-form" action="/api/admin/login" method="post">
          <label>
            Email
            <input name="email" type="email" defaultValue="davidsha@cowinmagnet.com" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Admin password" required />
          </label>
          <button type="submit" disabled={!configured}>
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
