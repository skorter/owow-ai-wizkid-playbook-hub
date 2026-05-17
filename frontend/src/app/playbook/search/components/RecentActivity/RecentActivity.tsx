import styles from "./RecentActivity.module.css";

export default function RecentActivity() {
  return (
    <section className={styles.activity}>
      <h2 className={styles.title}>Recent Activity</h2>
      <ul className={styles.list}>
        <li className={styles.item}>
          <p className={styles.label}>Time Off Policy</p>
          <p className={styles.meta}>Viewed 2 hours ago</p>
        </li>
        <li className={styles.item}>
          <p className={styles.label}>Simplicate Login Guide</p>
          <p className={styles.meta}>Viewed yesterday</p>
        </li>
        <li className={styles.item}>
          <p className={styles.label}>🎯 Continue Onboarding</p>
          <p className={styles.meta}>2 of 5 steps completed</p>
        </li>
      </ul>
    </section>
  );
}
