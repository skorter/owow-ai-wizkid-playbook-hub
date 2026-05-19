"use client";

import { useEffect, useState } from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import {
  getRoleDisplayLabel,
  getStoredSessionUser,
  isHrAdmin,
  logout,
} from "@/lib/auth/session";

export default function Footer() {
  const router = useRouter();
  const [profileLink, setProfileLink] = useState("/login");
  const [displayName, setDisplayName] = useState("Guest");
  const [displayRole, setDisplayRole] = useState("Employee");

  useEffect(() => {
    const user = getStoredSessionUser();
    if (!user) {
      setProfileLink("/login");
      setDisplayName("Guest");
      setDisplayRole("Employee");
      return;
    }

    setProfileLink(isHrAdmin(user.role) ? "/admin/profile" : "/playbook/profile");
    setDisplayName(user.fullName?.trim() || user.email);
    setDisplayRole(getRoleDisplayLabel(user.role));
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <footer className={styles.footer}>
      <Link href={profileLink} className={styles.profile}>
        <User className={styles.userIcon} aria-hidden />
        <p className={styles.name}>{displayName}</p>
        <p className={styles.role}>{displayRole}</p>
      </Link>
      <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
        <LogOut size={16} aria-hidden />
        Log out
      </button>
    </footer>
  );
}
