import styles from "./RecentActivity.module.css";
import Link from "next/link";
import { History, Search, BookOpen, Bookmark } from "lucide-react";

const activities = [
  {
    type: "search",
    label: "How do I request time off?",
    time: "2h ago",
    slug: null,
  },
  {
    type: "view",
    label: "Time Off Policy",
    time: "2h ago",
    slug: "time-off-policy",
  },
  {
    type: "search",
    label: "Simplicate login guide",
    time: "Yesterday",
    slug: null,
  },
  {
    type: "save",
    label: "Remote Work Guidelines",
    time: "2 days ago",
    slug: "remote-work-guidelines",
  },
];

const iconMap = {
  search: Search,
  view: BookOpen,
  save: Bookmark,
};

export default function RecentActivity() {
  return (
    <section className={styles.recentActivity}>
      <div className={styles.header}>
        <History className={styles.historyIcon} />
        <h2 className={styles.title}>Recent Activity</h2>
      </div>

      <ul className={styles.list}>
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type as keyof typeof iconMap];
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
