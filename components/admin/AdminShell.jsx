"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/analytics", label: "Traffic" },
  { href: "/admin/search-console", label: "Search Console" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/journeys", label: "Journeys" },
  { href: "/admin/settings", label: "Settings" }
];

export default function AdminShell({ children, email }) {
  const pathname = usePathname();

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link className="admin-logo" href="/admin">
          <span>CY</span>
          <strong>Cowin Analytics</strong>
        </Link>
        <nav>
          {links.map((link) => (
            <Link
              className={pathname === link.href ? "is-active" : ""}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <small>Signed in as</small>
          <span>{email}</span>
          <form action="/api/admin/logout" method="post">
            <button type="submit">Log out</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
