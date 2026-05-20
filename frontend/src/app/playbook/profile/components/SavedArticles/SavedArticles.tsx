import styles from "./SavedArticles.module.css";
import { Bookmark } from "lucide-react";

export default function SavedArticles() {
  return (
    <section className={styles.savedArticles}>
      <div className={styles.header}>
        <Bookmark className={styles.icon} />
        <h2 className={styles.title}>Saved Articles</h2>
      </div>
      <p className={styles.empty}>
        Saved articles are not available yet. Bookmarking will be added in a future
        release.
      </p>
    </section>
  );
}
