"use client";
import { useState, useEffect } from "react";
import styles from "./Navigation.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Search,
  BookOpen,
  GraduationCap,
  ChartArea,
  Shield,
  FileText,
} from "lucide-react";

export default function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, []);

  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        {isAdmin ? (
          <>
            <li
              className={`${styles.item} ${pathname === "/admin/dashboard" ? styles.active : ""}`}
            >
              <Link href="/admin/dashboard" className={styles.link}>
                <Shield className={styles.shieldIcon} />
                Dashboard
              </Link>
            </li>
            <li
              className={`${styles.item} ${pathname === "/admin/analytics" ? styles.active : ""}`}
            >
              <Link href="/admin/analytics" className={styles.link}>
                <ChartArea className={styles.chartAreaIcon} />
                Analytics
              </Link>
            </li>
            <li
              className={`${styles.item} ${pathname === "/admin/documents" ? styles.active : ""}`}
            >
              <Link href="/admin/documents" className={styles.link}>
                <FileText className={styles.fileTextIcon} />
                Documents
              </Link>
            </li>
          </>
        ) : (
          <>
            <li
              className={`${styles.item} ${pathname === "/playbook/dashboard" ? styles.active : ""}`}
            >
              <Link href="/playbook/dashboard" className={styles.link}>
                <House className={styles.houseIcon} />
                Dashboard
              </Link>
            </li>
            <li
              className={`${styles.item} ${pathname === "/playbook/search" ? styles.active : ""}`}
            >
              <Link href="/playbook/search" className={styles.link}>
                <Search className={styles.searchIcon} />
                AI Search
              </Link>
            </li>
            <li
              className={`${styles.item} ${pathname === "/playbook/topics" ? styles.active : ""}`}
            >
              <Link href="/playbook/topics" className={styles.link}>
                <BookOpen className={styles.bookIcon} />
                Topics
              </Link>
            </li>
            <li
              className={`${styles.item} ${pathname === "/playbook/onboarding" ? styles.active : ""}`}
            >
              <Link href="/playbook/onboarding" className={styles.link}>
                <GraduationCap className={styles.graduationCapIcon} />
                Onboarding
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
