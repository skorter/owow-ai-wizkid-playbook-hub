import styles from "./SavedArticles.module.css";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";
import { savedArticles } from "@/lib/data/profile";

export default function SavedArticles() {
  return (
    <section className={styles.savedArticles}>
      <div className={styles.header}>
        <Bookmark className={styles.bookmarkIcon} />
        <h2 className={styles.title}>Saved Articles</h2>
      </div>

      <ul className={styles.list}>
        {savedArticles.map((article) => (
          <li key={article.slug}>
            <Link href={`/playbook/${article.slug}`} className={styles.item}>
              <div className={styles.info}>
                <p className={styles.label}>{article.label}</p>
                <span className={styles.category}>{article.category}</span>
              </div>
              <ArrowRight className={styles.arrowIcon} />
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/playbook/saved" className={styles.viewAllButton}>
        View all →
      </Link>
    </section>
  );
}
