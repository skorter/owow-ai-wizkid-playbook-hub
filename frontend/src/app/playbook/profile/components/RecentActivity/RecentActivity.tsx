import styles from "./RecentActivity.module.css";
import Link from "next/link";
import { History } from "lucide-react";
import { activities } from "@/lib/data/profile";

export default function RecentActivity() {
  return (
    <section className={styles.recentActivity}>
      <div className={styles.header}>
        <History className={styles.historyIcon} />
        <h2 className={styles.title}>Recent Activity</h2>
      </div>

      <ul className={styles.list}>
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const content = (
            <>
              <Icon className={styles.typeIcon} />
              <div className={styles.info}>
                <p className={styles.label}>{activity.label}</p>
                <p className={styles.time}>{activity.time}</p>
              </div>
            </>
          );

          return (
            <li key={index} className={styles.item}>
              {activity.slug ? (
                <Link
                  href={`/playbook/${activity.slug}`}
                  className={styles.itemLink}
                >
                  {content}
                </Link>
              ) : (
                <div className={styles.itemLink}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      <Link href="/playbook/activity" className={styles.viewAllButton}>
        View All →
      </Link>
    </section>
  );
}
