"use client";

import styles from "./Identity.module.css";
import {
  Brain,
  SquarePen,
  Calendar,
  TrendingUp,
  Sparkles,
  Award,
} from "lucide-react";
import {
  getDisplayFullName,
  getDisplayInitials,
  getDisplayRole,
  usePlaybookSession,
} from "@/lib/hooks/usePlaybookSession";

type IdentityProps = {
  onEdit: () => void;
};

export default function Identity({ onEdit }: IdentityProps) {
  const user = usePlaybookSession();
  const image = null;

  return (
    <section className={styles.identity}>
      <div className={styles.avatar}>
        {image ? (
          <img className={styles.image} src={image} alt="User Avatar" />
        ) : (
          <span className={styles.initials}>{getDisplayInitials(user)}</span>
        )}
      </div>

      <div className={styles.information}>
        <h1 className={styles.name}>{getDisplayFullName(user)}</h1>
        <div className={styles.tags}>
          <span className={styles.tag}>{getDisplayRole(user)}</span>
        </div>
      </div>

      <button className={styles.editButton} onClick={onEdit}>
        <SquarePen className={styles.icon} /> Edit Profile
      </button>

      <div className={styles.aiSummary}>
        <Brain className={styles.icon} />
        <h2 className={styles.label}>AI Profile Summary</h2>
        <p className={styles.description}>
          AI profile insights will be available after AI search integration.
        </p>
      </div>

      <div className={styles.metadata}>
        <article className={styles.data}>
          <Calendar className={`${styles.icon} ${styles.calendarIcon}`} />
          <p className={styles.label}>Joined</p>
          <p className={styles.value}>Not available</p>
        </article>
        <article className={styles.data}>
          <TrendingUp className={`${styles.icon} ${styles.trendingUpIcon}`} />
          <p className={styles.label}>Onboarding</p>
          <p className={styles.value}>Not tracked yet</p>
        </article>
        <article className={styles.data}>
          <Sparkles className={`${styles.icon} ${styles.sparklesIcon}`} />
          <p className={styles.label}>AI Searches</p>
          <p className={styles.value}>Not tracked yet</p>
        </article>
        <article className={styles.data}>
          <Award className={`${styles.icon} ${styles.awardIcon}`} />
          <p className={styles.label}>Level</p>
          <p className={styles.value}>—</p>
        </article>
      </div>
    </section>
  );
}
