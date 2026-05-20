"use client";

import { useMemo } from "react";
import AdminPageContainer from "@/components/admin/AdminPageContainer/AdminPageContainer";
import { getRoleDisplayLabel, getStoredSessionUser } from "@/lib/auth/session";
import { Shield, Mail, User, Lock, Bell, FileText } from "lucide-react";
import styles from "./page.module.css";

function getInitials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name || email).slice(0, 2).toUpperCase();
}

export default function AdminProfilePage() {
  const user = useMemo(() => getStoredSessionUser(), []);
  const fullName = user?.fullName?.trim() || user?.email || "HR Admin";
  const email = user?.email ?? "—";
  const roleLabel = user ? getRoleDisplayLabel(user.role) : "HR Admin";

  return (
    <AdminPageContainer
      className={styles.profilePage}
      title="Admin Profile"
      subtitle="Your HR admin account on the OWOW Playbook Hub"
    >
      <div className={styles.grid}>
        <section className={styles.identityCard}>
          <div className={styles.avatar}>{getInitials(fullName, email)}</div>
          <div>
            <h2 className={styles.name}>{fullName}</h2>
            <p className={styles.roleTag}>
              <Shield size={14} aria-hidden />
              {roleLabel} · Account type HR Admin
            </p>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>
            <User size={16} aria-hidden />
            Account details
          </h3>
          <dl className={styles.metaList}>
            <div>
              <dt>Email</dt>
              <dd>{email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{roleLabel}</dd>
            </div>
            <div>
              <dt>User ID</dt>
              <dd className={styles.mono}>{user?.id ?? "—"}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>
            <FileText size={16} aria-hidden />
            Admin activity
          </h3>
          <p className={styles.placeholder}>
            Detailed admin activity history is not tracked yet. Use Documents and
            Analytics for live hub metrics.
          </p>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Lock size={16} aria-hidden />
            Security
          </h3>
          <p className={styles.placeholder}>
            Password changes and two-factor authentication will be available in a later
            release. Contact IT for urgent access issues.
          </p>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Bell size={16} aria-hidden />
            Notifications
          </h3>
          <p className={styles.placeholder}>
            Email digests for missing-info requests and content reviews are not
            configured yet.
          </p>
        </section>

        <section className={styles.card}>
          <h3 className={styles.cardTitle}>
            <Mail size={16} aria-hidden />
            Support
          </h3>
          <p className={styles.placeholder}>
            For platform issues, use your internal IT channel or the project team
            maintaining this playbook hub.
          </p>
        </section>
      </div>
    </AdminPageContainer>
  );
}
