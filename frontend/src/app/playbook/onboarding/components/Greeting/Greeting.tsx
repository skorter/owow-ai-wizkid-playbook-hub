import styles from "./Greeting.module.css";

type OnboardingGreetingProps = {
  stepCount: number;
};

export default function Greeting({ stepCount }: OnboardingGreetingProps) {
  const label =
    stepCount === 1 ? "1 step" : `${stepCount} steps`;

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Onboarding Journey</h1>
      <p className={styles.description}>
        Complete all {label} below. Progress is tracked locally in your browser until
        backend completion tracking is added.
      </p>
    </section>
  );
}
