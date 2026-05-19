import styles from "./Header.module.css";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <section className={styles.header}>
      <Sparkles className={styles.icon} />
      <h2 className={styles.title}>
        <span className={styles.accent}>OWOW's</span> Playbook
      </h2>
      <p className={styles.description}>
        Your intelligent knowledge companion.
      </p>
    </section>
  );
}
