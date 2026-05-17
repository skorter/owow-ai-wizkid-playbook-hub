import styles from "./AIInsights.module.css";
import { TrendingUp, Clock, CheckCircle, BookOpen } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    label: "Most Searched",
    value: "HR Policies",
    color: "#ffd500",
  },
  { icon: Clock, label: "Avg Response Time", value: "1.2s", color: "#4ecdc4" },
  {
    icon: CheckCircle,
    label: "Questions Solved",
    value: "94%",
    color: "#00ff85",
  },
  { icon: BookOpen, label: "Articles Read", value: "47", color: "#09b9f9" },
];

export default function AIInsights() {
  return (
    <section className={styles.aiInsights}>
      <div className={styles.header}>
        <TrendingUp className={styles.trendingIcon} />
        <h2 className={styles.title}>AI Insights & Analytics</h2>
      </div>
      <div className={styles.grid}>
        {insights.map((insight) => (
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
