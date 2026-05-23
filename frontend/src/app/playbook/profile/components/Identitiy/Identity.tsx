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
} from "@/lib/hooks/usePlaybookSession";
import type { SessionUser } from "@/types/auth";
import { useMemo } from "react";
import {
  getOnboardingProgressKey,
  getOnboardingProgressPercent,
  readOnboardingProgress,
} from "@/lib/onboardingProgress";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import { useEffect, useState } from "react";

type IdentityProps = {
  user: SessionUser | null;
  onEdit: () => void;
};

export default function Identity({ user, onEdit }: IdentityProps) {
  const displayUser = user;
  const [onboardingPercent, setOnboardingPercent] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      try {
        const result = await fetchPlaybookOnboarding();
        const slugs = result.steps.flatMap((s) =>
          s.articles.map((a) => a.slug.trim().toLowerCase()),
        );
        const key = getOnboardingProgressKey(displayUser?.id, displayUser?.email);
        const completed = readOnboardingProgress(key).completedArticleSlugs;
        if (!cancelled) {
          setOnboardingPercent(getOnboardingProgressPercent(completed, slugs));
        }
      } catch {
        if (!cancelled) setOnboardingPercent(null);
      }
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [displayUser?.id, displayUser?.email]);

  const onboardingLabel = useMemo(() => {
    if (onboardingPercent === null) return "Not tracked yet";
    return `${onboardingPercent}% (local)`;
  }, [onboardingPercent]);

  return (
    <section className={styles.identity}>
      <div className={styles.avatar}>
        <span className={styles.initials}>{getDisplayInitials(displayUser)}</span>
      </div>

      <div className={styles.information}>
        <h1 className={styles.name}>{getDisplayFullName(displayUser)}</h1>
        <div className={styles.tags}>
          <span className={styles.tag}>{getDisplayRole(displayUser)}</span>
        </div>
      </div>

      <button type="button" className={styles.editButton} onClick={onEdit}>
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
          <p className={styles.value}>{onboardingLabel}</p>
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
