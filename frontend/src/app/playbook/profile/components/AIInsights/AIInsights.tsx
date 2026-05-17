import styles from "./AIInsights.module.css";
import { TrendingUp } from "lucide-react";
import { aiInsights } from "@/lib/data/profile";

export default function AIInsights() {
  return (
    <section className={styles.aiInsights}>
      <div className={styles.header}>
        <TrendingUp className={styles.trendingIcon} />
        <h2 className={styles.title}>AI Insights & Analytics</h2>
      </div>
      <div className={styles.grid}>
        {aiInsights.map((insight) => (
          <article key={insight.label} className={styles.card}>
            <insight.icon
              className={styles.icon}
              style={{ color: insight.color }}
            />
            <p className={styles.label}>{insight.label}</p>
            <p className={styles.value} style={{ color: insight.color }}>
              {insight.value}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
