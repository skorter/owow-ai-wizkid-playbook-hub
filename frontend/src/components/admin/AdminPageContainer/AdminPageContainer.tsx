import "../admin-tokens.css";
import styles from "./AdminPageContainer.module.css";

type AdminPageContainerProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function AdminPageContainer({
  title,
  subtitle,
  actions,
  children,
  className,
}: AdminPageContainerProps) {
  return (
    <main className={`${styles.page} ${className ?? ""}`.trim()}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </main>
  );
}
