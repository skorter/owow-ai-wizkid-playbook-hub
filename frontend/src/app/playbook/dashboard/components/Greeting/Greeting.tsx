import styles from "./Greeting.module.css";

export default function Greeting() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Welcome back, <span className={styles.name}>John</span>
        <span className={styles.wave}> 👋 </span>
      </h1>
      <p className={styles.description}>What would you like to do today?</p>
    </section>
  );
}
