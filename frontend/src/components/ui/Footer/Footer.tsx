"use client";

import { useMemo, useSyncExternalStore } from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import {
  getRoleDisplayLabel,
  getSessionSnapshot,
  isHrAdmin,
  logout,
  parseSessionUserSnapshot,
  subscribeSession,
} from "@/lib/auth/session";

export default function Footer() {
  const router = useRouter();
  const userSnapshot = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    () => null,
  );
  const sessionUser = useMemo(
    () => parseSessionUserSnapshot(userSnapshot),
    [userSnapshot],
  );
  const footerView = useMemo(() => {
    if (!sessionUser) {
      return {
        profileLink: "/login",
        displayName: "Guest",
        displayRole: "Employee",
      };
    }
    return {
      profileLink: isHrAdmin(sessionUser.role)
        ? "/admin/profile"
        : "/playbook/profile",
      displayName: sessionUser.fullName?.trim() || sessionUser.email,
      displayRole: getRoleDisplayLabel(sessionUser.role),
    };
  }, [sessionUser]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <footer className={styles.footer}>
      <Link href={footerView.profileLink} className={styles.profile}>
        <User className={styles.userIcon} aria-hidden />
        <p className={styles.name}>{footerView.displayName}</p>
        <p className={styles.role}>{footerView.displayRole}</p>
      </Link>
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={16} aria-hidden />
        Log out
      </button>
    </footer>
  );
}
