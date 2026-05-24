import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Your AI-powered
        <span className={styles.accent}> OWOW operating system</span>
      </h1>
      <p className={styles.description}>
        Access company knowledge, get AI-powered answers, and accelerate your
        onboarding journey — all in one intelligent platform.
      </p>
    </section>
  );
}
