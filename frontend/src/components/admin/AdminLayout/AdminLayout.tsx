"use client";

import { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ChartArea,
  FileText,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import {
  getRoleDisplayLabel,
  getSessionSnapshot,
  logout,
  parseSessionUserSnapshot,
  subscribeSession,
} from "@/lib/auth/session";
import type { LucideIcon } from "lucide-react";
import "../admin-tokens.css";
import styles from "./AdminLayout.module.css";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  matchPaths?: string[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    matchPaths: ["/admin/dashboard"],
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: ChartArea,
    matchPaths: ["/admin/analytics"],
  },
  {
    label: "Documents",
    href: "/admin/documents",
    icon: FileText,
    matchPaths: ["/admin/documents"],
  },
];

function isNavActive(pathname: string, item: NavItem): boolean {
  if (item.matchPaths?.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userSnapshot = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    () => null,
  );
  const sessionUser = useMemo(
    () => parseSessionUserSnapshot(userSnapshot),
    [userSnapshot],
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayName = sessionUser?.fullName?.trim() || sessionUser?.email || "User";
  const displayRole = sessionUser
    ? getRoleDisplayLabel(sessionUser.role)
    : "HR Admin";

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className={styles.shell}>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        aria-label="Admin navigation"
      >
        <div className={styles.sidebarInner}>
          <div className={styles.brand}>
            <h1 className={styles.brandTitle}>
              <span className={styles.brandAccent}>OWOW</span> Playbook AI
            </h1>
            <p className={styles.brandSubtitle}>HR &amp; Admin workspace</p>
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(pathname, item);
                return (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={styles.navIcon} aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={styles.profile}>
            <Link
              href="/admin/profile"
              className={styles.profileLink}
              onClick={() => setSidebarOpen(false)}
            >
              <User className={styles.profileIcon} aria-hidden />
              <span className={styles.profileName}>{displayName}</span>
              <span className={styles.profileRole}>{displayRole}</span>
            </Link>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <LogOut size={16} aria-hidden />
              Log out
            </button>
          </div>
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.brandTitle}>
            <span className={styles.brandAccent}>OWOW</span> Playbook AI
          </h1>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
