import styles from "./Progress.module.css";

type ProgressProps = {
  progress: number;
};

export default function Progress({ progress }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <section className={styles.progressBar}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Overall onboarding progress"
      >
        <div className={styles.progress} style={{ width: `${clamped}%` }} />
      </div>
      <span className={styles.label}>{clamped}% of published articles completed</span>
    </section>
  );
}
