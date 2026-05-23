import styles from "./Greeting.module.css";

type OnboardingGreetingProps = {
  stepCount: number;
  progressPercent: number;
};

export default function Greeting({ stepCount, progressPercent }: OnboardingGreetingProps) {
  const label = stepCount === 1 ? "1 step" : `${stepCount} steps`;

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Onboarding Journey</h1>
      <p className={styles.description}>
        Complete all {label} below. Your progress is {progressPercent}% — tracked locally in
        this browser until server-side completion is added.
      </p>
    </section>
  );
}
