import styles from "./RecentActivity.module.css";
import { History } from "lucide-react";

export default function RecentActivity() {
  return (
    <section className={styles.recentActivity}>
      <div className={styles.header}>
        <History className={styles.icon} />
        <h2 className={styles.title}>Recent Activity</h2>
      </div>
      <p className={styles.empty}>
        No recent activity yet. Activity will appear here after AI search is
        connected.
      </p>
    </section>
  );
}
