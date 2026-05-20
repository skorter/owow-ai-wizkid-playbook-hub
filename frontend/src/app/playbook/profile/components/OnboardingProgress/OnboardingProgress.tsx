"use client";

import { useEffect, useState } from "react";
import styles from "./OnboardingProgress.module.css";
import Link from "next/link";
import { CircleDashed, Circle } from "lucide-react";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import type { OnboardingStep } from "@/types/onboarding";

export default function OnboardingProgress() {
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await fetchPlaybookOnboarding();
        if (!cancelled) setSteps(result.steps);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <section className={styles.onboardingProgress}>
      <div className={styles.header}>
        <CircleDashed className={styles.icon} />
        <h2 className={styles.title}>Onboarding Progress</h2>
      </div>

      <p className={styles.trackingNote}>
        Completion is not tracked on the server yet. Use the onboarding page to
        work through {steps.length} step{steps.length === 1 ? "" : "s"}.
      </p>

      <div className={styles.steps}>
        {steps.map((step) => (
          <article key={step.slug} className={styles.step}>
            <Circle className={`${styles.icon} ${styles.circleIcon}`} />
            <span className={`${styles.label} ${styles.incomplete}`}>{step.label}</span>
          </article>
        ))}
      </div>

      <Link href="/playbook/onboarding" className={styles.continueButton}>
        Continue Onboarding →
      </Link>
    </section>
  );
}
