import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import "../admin-tokens.css";
import styles from "./AdminMetricCard.module.css";

export type MetricIconTone = "yellow" | "cyan" | "green" | "orange" | "purple" | "red";

export type MetricTrend = {
  value: string;
  direction: "up" | "down" | "neutral";
};

type AdminMetricCardProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: MetricTrend;
  iconTone?: MetricIconTone;
  showNotificationDot?: boolean;
  className?: string;
};

const iconToneClass: Record<MetricIconTone, string> = {
  yellow: styles.iconWrap,
  cyan: `${styles.iconWrap} ${styles.iconWrapCyan}`,
  green: `${styles.iconWrap} ${styles.iconWrapGreen}`,
  orange: `${styles.iconWrap} ${styles.iconWrapOrange}`,
  purple: `${styles.iconWrap} ${styles.iconWrapPurple}`,
  red: `${styles.iconWrap} ${styles.iconWrapRed}`,
};

const trendClass: Record<MetricTrend["direction"], string> = {
  up: styles.trendUp,
  down: styles.trendDown,
  neutral: styles.trendNeutral,
};

export default function AdminMetricCard({
  icon: Icon,
  value,
  label,
  trend,
  iconTone = "yellow",
  showNotificationDot = false,
  className,
}: AdminMetricCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? TrendingUp
      : trend?.direction === "down"
        ? TrendingDown
        : Minus;

  return (
    <article className={`${styles.card} ${className ?? ""}`.trim()}>
      {showNotificationDot ? (
        <span className={styles.notificationDot} aria-label="Has notifications" />
      ) : null}
      <div className={iconToneClass[iconTone]}>
        <Icon className={styles.icon} aria-hidden />
      </div>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {trend ? (
          <span className={`${styles.trend} ${trendClass[trend.direction]}`}>
            <TrendIcon className={styles.trendIcon} aria-hidden />
            {trend.value}
          </span>
        ) : null}
      </div>
      <p className={styles.label}>{label}</p>
    </article>
  );
}
