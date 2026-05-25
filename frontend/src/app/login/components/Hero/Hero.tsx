import styles from "./Hero.module.css";

const ORB_COUNT = 5;

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.orbLayer} aria-hidden>
        {Array.from({ length: ORB_COUNT }, (_, i) => (
          <div
            key={i}
            className={`${styles.floatingOrb} ${styles[`orb${i + 1}`]}`}
          />
        ))}
      </div>
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
