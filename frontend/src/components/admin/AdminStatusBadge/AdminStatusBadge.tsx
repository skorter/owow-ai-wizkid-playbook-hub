import "../admin-tokens.css";
import styles from "./AdminStatusBadge.module.css";

export type AdminBadgeColor =
  | "yellow"
  | "green"
  | "blue"
  | "orange"
  | "red"
  | "purple"
  | "gray";

type AdminStatusBadgeProps = {
  color?: AdminBadgeColor;
  children: React.ReactNode;
  className?: string;
};

const colorClass: Record<AdminBadgeColor, string> = {
  yellow: styles.yellow,
  green: styles.green,
  blue: styles.blue,
  orange: styles.orange,
  red: styles.red,
  purple: styles.purple,
  gray: styles.gray,
};

export default function AdminStatusBadge({
  color = "gray",
  children,
  className,
}: AdminStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${colorClass[color]} ${className ?? ""}`.trim()}>
      {children}
    </span>
  );
}
