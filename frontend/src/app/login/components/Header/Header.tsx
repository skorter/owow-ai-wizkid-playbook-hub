import styles from "./Header.module.css";
import { Brain } from "lucide-react";

export default function Header() {
  return (
    <section className={styles.header}>
      <div className={styles.iconWrapper}>
        <Brain className={styles.icon} />
      </div>
      <h2 className={styles.title}>
        <span className={styles.accent}>OWOW&apos;s</span> Playbook Hub
      </h2>
      <p className={styles.description}>Knowledge Platform</p>
    </section>
  );
}
