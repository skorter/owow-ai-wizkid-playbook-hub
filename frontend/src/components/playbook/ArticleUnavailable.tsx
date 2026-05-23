import Link from "next/link";
import { FileQuestion } from "lucide-react";
import styles from "./article-unavailable.module.css";

type ArticleUnavailableProps = {
  title?: string;
  backHref: string;
  backLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export default function ArticleUnavailable({
  title = "Article not available yet",
  backHref,
  backLabel,
  secondaryHref,
  secondaryLabel,
}: ArticleUnavailableProps) {
  return (
    <section className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.glow} aria-hidden />
        <div className={styles.iconWrap}>
          <FileQuestion className={styles.icon} aria-hidden />
        </div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>
          This article is currently being prepared by HR. It will appear in the
          playbook once it is published.
        </p>
        <div className={styles.actions}>
          <Link href={backHref} className={styles.primaryBtn}>
            {backLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className={styles.secondaryBtn}>
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
