import styles from "./Greeting.module.css";

export default function Greeting() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Onboarding Journey</h1>
      <p className={styles.description}>
        Complete the onboarding steps below to get familiar with the OWOW Playbook.
      </p>
    </section>
  );
}
