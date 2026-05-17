import styles from "./Greeting.module.css";

export default function Greeting() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Onboarding Journey</h1>
      <p className={styles.description}>
        Let's get you up to speed. Complete all 3 steps to finish your
        onboarding.
      </p>
    </section>
  );
}
