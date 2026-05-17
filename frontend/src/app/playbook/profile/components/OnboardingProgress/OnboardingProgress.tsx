import styles from "./OnboardingProgress.module.css";
import Link from "next/link";
import { CircleDashed, CircleCheckBig, Circle } from "lucide-react";

const steps = [
  { label: "Company & Culture", completed: true },
  { label: "Practical Setup", completed: true },
  { label: "Growth & Conduct", completed: false },
];

const completedCount = steps.filter((s) => s.completed).length;
const progress = Math.round((completedCount / steps.length) * 100);

export default function OnboardingProgress() {
  return (
    <section className={styles.onboardingProgress}>
      <div className={styles.header}>
        <CircleDashed className={styles.circleDashedIcon} />
        <h2 className={styles.title}>Onboarding Progress</h2>
      </div>

      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progress} style={{ width: `${progress}%` }} />
        </div>
        <p className={styles.progressLabel}>{progress}% complete</p>
      </div>

      <div className={styles.steps}>
        {steps.map((step) => (
          <article key={step.label} className={styles.step}>
            {step.completed ? (
              <CircleCheckBig className={styles.checkIcon} />
            ) : (
              <Circle className={styles.circleIcon} />
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
