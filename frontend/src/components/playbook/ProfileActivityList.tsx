import Link from "next/link";
import type { ProfileActivityItem } from "@/lib/api/profile";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import styles from "./profile-lists.module.css";

type ProfileActivityListProps = {
  items: ProfileActivityItem[];
};

export default function ProfileActivityList({ items }: ProfileActivityListProps) {
  return (
    <ul className={styles.activityList}>
      {items.map((item) => (
        <li key={item.id} className={styles.activityItem}>
          <div className={styles.activityHeader}>
            <span className={styles.activityBadge}>{item.title}</span>
            <span className={styles.activityTime}>{formatTimeAgo(item.createdAt)}</span>
          </div>
          <p className={styles.activityQuestion}>{item.question}</p>
          {item.answerPreview ? (
            <p className={styles.activityPreview}>{item.answerPreview}</p>
          ) : null}
          <div className={styles.activityMeta}>
            {item.confidence != null && item.confidence > 0 ? (
              <span>{Math.round(item.confidence * 100)}% match</span>
            ) : null}
            {item.sourceCount > 0 ? (
              <span>
                {item.sourceCount} source{item.sourceCount === 1 ? "" : "s"}
              </span>
            ) : null}
            {item.articleSlug ? (
              <Link href={`/playbook/${item.articleSlug}`} className={styles.activityLink}>
                {item.articleTitle ?? "View article"}
              </Link>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
