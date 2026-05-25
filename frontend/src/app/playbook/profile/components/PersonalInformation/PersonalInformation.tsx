"use client";

import styles from "./PersonalInformation.module.css";
import { User, Mail, Building2, Briefcase, Calendar } from "lucide-react";
import { getDisplayRole } from "@/lib/hooks/usePlaybookSession";
import type { SessionUser } from "@/types/auth";

type PersonalInformationProps = {
  user: SessionUser | null;
};

export default function PersonalInformation({ user }: PersonalInformationProps) {
  return (
    <section className={styles.personalInformation}>
      <div className={styles.header}>
        <User className={styles.icon} />
        <h2 className={styles.title}>Personal Information</h2>
      </div>
      <div className={styles.metadata}>
        <article className={styles.data}>
          <Mail className={styles.icon} />
          <p className={styles.label}>Email</p>
          <p className={styles.value}>{user?.email ?? "—"}</p>
        </article>
        <article className={styles.data}>
          <Building2 className={styles.icon} />
          <p className={styles.label}>Department</p>
          <p className={styles.value}>Not available</p>
        </article>
        <article className={styles.data}>
          <Briefcase className={styles.icon} />
          <p className={styles.label}>Role</p>
          <p className={styles.value}>{getDisplayRole(user)}</p>
        </article>
        <article className={styles.data}>
          <Calendar className={styles.icon} />
          <p className={styles.label}>Start Date</p>
          <p className={styles.value}>Not available</p>
        </article>
      </div>
    </section>
  );
}
