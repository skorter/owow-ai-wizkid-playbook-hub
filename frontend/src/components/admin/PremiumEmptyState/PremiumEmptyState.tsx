import type { LucideIcon } from "lucide-react";
import styles from "./PremiumEmptyState.module.css";

type PremiumEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  hint?: string;
  compact?: boolean;
};

export default function PremiumEmptyState({
  icon: Icon,
  title,
  description,
  hint,
  compact = false,
}: PremiumEmptyStateProps) {
  return (
    <div
      className={`${styles.empty} ${compact ? styles.compact : ""}`}
      role="status"
    >
      <div className={styles.glow} aria-hidden />
      <div className={styles.iconWrap}>
        <Icon className={styles.icon} aria-hidden />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </div>
  );
}
