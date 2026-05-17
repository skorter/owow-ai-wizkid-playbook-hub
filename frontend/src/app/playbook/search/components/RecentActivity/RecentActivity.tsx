import styles from "./RecentActivity.module.css";
import { recentActivity } from "@/lib/data/search";

export default function RecentActivity() {
  return (
    <section className={styles.activity}>
      <h2 className={styles.title}>Recent Activity</h2>
      <ul className={styles.list}>
        {recentActivity.map((item) => (
          <li key={item.label} className={styles.item}>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.meta}>{item.meta}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
