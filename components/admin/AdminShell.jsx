"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Activity, Box, FileText, LayoutDashboard, Mail, Menu, MessageCircle, Newspaper, Search, Settings2, Users, Waypoints, X } from "lucide-react";
import AdminLiveStatus from "@/components/admin/AdminLiveStatus";

const links = [
  { href: "/admin", label: "数据总览", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "流量分析", icon: Activity },
  { href: "/admin/search-console", label: "SEO 数据", icon: Search },
  { href: "/admin/products", label: "产品管理", icon: Box },
  { href: "/admin/news", label: "新闻管理", icon: Newspaper },
  { href: "/admin/inquiries", label: "客户表单", icon: Mail },
  { href: "/admin/whatsapp", label: "WhatsApp 分析", icon: MessageCircle },
  { href: "/admin/visitors", label: "访客记录", icon: Users },
  { href: "/admin/pages", label: "页面表现", icon: FileText },
  { href: "/admin/journeys", label: "客户路径", icon: Waypoints },
  { href: "/admin/settings", label: "系统设置", icon: Settings2 }
];

export default function AdminShell({ children, email }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rangeQuery = searchParams.toString();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  return (
    <div className="admin-dashboard">
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label="打开后台导航"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
      >
        <Menu size={22} /> <span>COWIN MAGNET</span>
      </button>
      {menuOpen ? <button type="button" className="admin-sidebar-backdrop" aria-label="关闭后台导航" onClick={() => setMenuOpen(false)} /> : null}
      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <Link className="admin-logo" href="/admin">
          <Image src="/images/cowin-logo.png" alt="COWIN MAGNET" width={50} height={50} priority />
          <span><strong>COWIN MAGNET</strong><small>管理后台</small></span>
        </Link>
        <button className="admin-sidebar-close" type="button" aria-label="关闭后台导航" onClick={() => setMenuOpen(false)}><X size={20} /></button>
        <nav aria-label="后台主导航">
          {links.slice(0, -1).map((link) => (
            <Link
              className={pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`)) ? "is-active" : ""}
              href={rangeQuery ? `${link.href}?${rangeQuery}` : link.href}
              key={link.href}
              onClick={() => setMenuOpen(false)}
            >
              <link.icon size={20} strokeWidth={1.8} aria-hidden="true" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link className={pathname === "/admin/settings" ? "is-active" : ""} href="/admin/settings" onClick={() => setMenuOpen(false)}>
            <Settings2 size={20} strokeWidth={1.8} aria-hidden="true" /><span>系统设置</span>
          </Link>
          <details className="admin-account-menu">
            <summary>账户与数据状态</summary>
            <AdminLiveStatus />
            <small>当前账号</small>
            <span>{email}</span>
            <form action="/api/admin/logout" method="post">
              <button type="submit">退出登录</button>
            </form>
          </details>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
