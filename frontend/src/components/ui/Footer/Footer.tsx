"use client";
import { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import { User } from "lucide-react";

export default function Footer() {
  const [profileLink, setProfileLink] = useState("/login");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setProfileLink("/admin/profile");
      setIsAdmin(true);
    } else if (role === "user") {
      setProfileLink("/playbook/profile");
    } else {
      setProfileLink("/login");
    }
  }, []);
  return (
    <footer className={styles.footer}>
      <Link href={profileLink} className={styles.profile}>
        <User className={styles.userIcon} />
        <p className={styles.name}>John Doe</p>
        {isAdmin ? (
          <p className={styles.role}>Admin</p>
        ) : (
          <p className={styles.role}>Employee</p>
        )}
      </Link>
    </footer>
  );
}
