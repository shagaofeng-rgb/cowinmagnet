"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import AdminLiveStatus from "@/components/admin/AdminLiveStatus";

const links = [
  { href: "/admin", label: "数据总览" },
  { href: "/admin/analytics", label: "流量分析" },
  { href: "/admin/search-console", label: "SEO 数据" },
  { href: "/admin/products", label: "产品管理" },
  { href: "/admin/news", label: "新闻管理" },
  { href: "/admin/inquiries", label: "客户表单" },
  { href: "/admin/link-audit", label: "内外链审计" },
  { href: "/admin/visitors", label: "访客记录" },
  { href: "/admin/pages", label: "页面表现" },
  { href: "/admin/journeys", label: "访问路径" },
  { href: "/admin/settings", label: "系统设置" }
];

export default function AdminShell({ children, email }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rangeQuery = searchParams.toString();

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link className="admin-logo" href="/admin">
          <img src="/images/cowin-logo.png" alt="COWIN MAGNET" />
          <strong>COWIN 后台</strong>
        </Link>
        <nav>
          {links.map((link) => (
            <Link
              className={pathname === link.href ? "is-active" : ""}
              href={rangeQuery ? `${link.href}?${rangeQuery}` : link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <AdminLiveStatus />
          <small>当前账号</small>
          <span>{email}</span>
          <form action="/api/admin/logout" method="post">
            <button type="submit">退出登录</button>
          </form>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
