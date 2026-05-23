"use client";

import styles from "./Greeting.module.css";
import { getDisplayFirstName, usePlaybookSession } from "@/lib/hooks/usePlaybookSession";

export default function Greeting() {
  const user = usePlaybookSession();
  const firstName = getDisplayFirstName(user);

  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>
        Welcome back, <span className={styles.name}>{firstName}</span>
        <span className={styles.wave}> 👋 </span>
      </h1>
      <p className={styles.description}>What would you like to do today?</p>
    </section>
  );
}
