import styles from "./RecentActivity.module.css";

export default function RecentActivity() {
  return (
    <section className={styles.activity}>
      <h2 className={styles.title}>Recent Activity</h2>
      <p className={styles.empty}>
        No recent activity yet. Search history will appear here after AI search is
        connected.
      </p>
    </section>
  );
}
