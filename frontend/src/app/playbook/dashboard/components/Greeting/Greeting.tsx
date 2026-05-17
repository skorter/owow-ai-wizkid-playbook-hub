import styles from "./Greeting.module.css";
import { user } from "@/lib/data/user";

export default function Greeting() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Welcome back, <span className={styles.name}>{user.firstName}</span>
        <span className={styles.wave}> 👋 </span>
      </h1>
      <p className={styles.description}>What would you like to do today?</p>
    </section>
  );
}
