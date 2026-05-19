import styles from "./OnboardingProgress.module.css";
import Link from "next/link";
import { CircleDashed, CircleCheckBig, Circle } from "lucide-react";
import { onboardingProgressSteps } from "@/lib/data/profile";

const completedCount = onboardingProgressSteps.filter(
  (s) => s.completed,
).length;
const progress = Math.round(
  (completedCount / onboardingProgressSteps.length) * 100,
);

export default function OnboardingProgress() {
  return (
    <section className={styles.onboardingProgress}>
      <div className={styles.header}>
        <CircleDashed className={styles.icon} />
        <h2 className={styles.title}>Onboarding Progress</h2>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.label}>{progress}% complete</p>
      </div>

      <div className={styles.steps}>
        {onboardingProgressSteps.map((step) => (
          <article key={step.label} className={styles.step}>
            {step.completed ? (
              <CircleCheckBig className={`${styles.icon} ${styles.checkIcon}`} />
            ) : (
              <Circle className={`${styles.icon} ${styles.circleIcon}`} />
            )}
            <span
              className={`${styles.label} ${!step.completed ? styles.incomplete : ""}`}
            >
              {step.label}
            </span>
          </article>
        ))}
      </div>

      <Link href="/playbook/onboarding" className={styles.continueButton}>
        Continue Onboarding →
      </Link>
    </section>
  );
}
