"use client";

import { useEffect, useState } from "react";
import styles from "./OnboardingProgress.module.css";
import Link from "next/link";
import { CircleDashed, CircleCheckBig, Circle } from "lucide-react";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import {
  getOnboardingProgressKey,
  getOnboardingProgressPercent,
  isArticleComplete,
  readOnboardingProgress,
} from "@/lib/onboardingProgress";
import { getStoredSessionUser } from "@/lib/auth/session";
import type { OnboardingStep } from "@/types/onboarding";

export default function OnboardingProgress() {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const progressKey = getOnboardingProgressKey(
    getStoredSessionUser()?.id,
    getStoredSessionUser()?.email,
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchPlaybookOnboarding();
        if (!cancelled) {
          setSteps(result.steps);
          setCompletedSlugs(readOnboardingProgress(progressKey).completedArticleSlugs);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    const onFocus = () => {
      setCompletedSlugs(readOnboardingProgress(progressKey).completedArticleSlugs);
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [progressKey]);

  if (loading) {
    return (
      <section className={styles.onboardingProgress}>
        <p className={styles.empty}>Loading onboarding progress…</p>
      </section>
    );
  }

  if (steps.length === 0) {
    return (
      <section className={styles.onboardingProgress}>
        <p className={styles.empty}>No onboarding steps configured yet.</p>
      </section>
    );
  }

  const allSlugs = steps.flatMap((s) => s.articles.map((a) => a.slug.trim().toLowerCase()));
  const progress = getOnboardingProgressPercent(completedSlugs, allSlugs);

  return (
    <section className={styles.onboardingProgress}>
      <div className={styles.header}>
        <CircleDashed className={styles.icon} />
        <h2 className={styles.title}>Onboarding Progress</h2>
      </div>

      <p className={styles.trackingNote}>
        Stored locally per account until backend progress tracking is added.
      </p>

      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.label}>{progress}% complete</p>
      </div>

      <div className={styles.steps}>
        {steps.map((step) => {
          const stepDone = step.articles.every((a) =>
            isArticleComplete(progressKey, a.slug),
          );
          return (
            <article key={step.slug} className={styles.step}>
              {stepDone ? (
                <CircleCheckBig className={`${styles.icon} ${styles.checkIcon}`} />
              ) : (
                <Circle className={`${styles.icon} ${styles.circleIcon}`} />
              )}
              <span className={`${styles.stepLabel} ${stepDone ? "" : styles.incomplete}`}>
                {step.label}
              </span>
            </article>
          );
        })}
      </div>

      <Link href="/playbook/onboarding" className={styles.continueButton}>
        Continue Onboarding →
      </Link>
    </section>
  );
}
