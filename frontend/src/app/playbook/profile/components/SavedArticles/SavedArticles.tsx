import styles from "./SavedArticles.module.css";
import { Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";

const saved = [
  {
    label: "Holiday Calendar 2026",
    category: "HR",
    slug: "holiday-calendar-2026",
  },
  {
    label: "Performance Review Process",
    category: "Growth",
    slug: "performance-review-process",
  },
  {
    label: "Team Communication Guide",
    category: "Culture",
    slug: "team-communication-guide",
  },
  {
    label: "Expenses & Reimbursements",
    category: "Practical",
    slug: "expenses-and-reimbursements",
  },
];

export default function SavedArticles() {
  return (
    <section className={styles.savedArticles}>
      <div className={styles.header}>
        <Bookmark className={styles.bookmarkIcon} />
        <h2 className={styles.title}>Saved Articles</h2>
      </div>

      <ul className={styles.list}>
        {saved.map((article) => (
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
