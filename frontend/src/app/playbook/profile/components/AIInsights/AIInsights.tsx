import styles from "./AIInsights.module.css";
import { TrendingUp } from "lucide-react";

export default function AIInsights() {
  return (
    <section className={styles.aiInsights}>
      <div className={styles.header}>
        <TrendingUp className={styles.icon} />
        <h2 className={styles.title}>AI Insights & Analytics</h2>
      </div>
      <p className={styles.placeholder}>
        AI profile insights will be available after AI search integration.
      </p>
    </section>
  );
}
