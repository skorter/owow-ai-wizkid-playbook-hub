import "../admin-tokens.css";
import styles from "./AdminPanelCard.module.css";

type AdminPanelCardProps = {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  flushBody?: boolean;
  className?: string;
};

export default function AdminPanelCard({
  title,
  subtitle,
  badge,
  action,
  children,
  flushBody = false,
  className,
}: AdminPanelCardProps) {
  return (
    <section className={`${styles.card} ${className ?? ""}`.trim()}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{title}</h2>
            {badge ? <div className={styles.badge}>{badge}</div> : null}
          </div>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
        {action ? <div className={styles.action}>{action}</div> : null}
      </header>
      <div className={`${styles.body} ${flushBody ? styles.bodyFlush : ""}`.trim()}>
        {children}
      </div>
    </section>
  );
}
