import type { LucideIcon } from "lucide-react";
import styles from "./ChartEmptyPlaceholder.module.css";

type ChartEmptyPlaceholderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function ChartEmptyPlaceholder({
  icon: Icon,
  title,
  description,
}: ChartEmptyPlaceholderProps) {
  return (
    <div className={styles.wrap} role="status">
      <div className={styles.placeholderChart} aria-hidden>
        <div className={styles.gridLine} style={{ top: "22%" }} />
        <div className={styles.gridLine} style={{ top: "48%" }} />
        <div className={styles.gridLine} style={{ top: "74%" }} />
        <div className={styles.placeholderLine} />
        <div className={styles.placeholderArea} />
      </div>
      <div className={styles.copy}>
        <Icon className={styles.icon} aria-hidden />
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
