import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SavedArticleItem } from "@/lib/api/savedArticles";
import styles from "./profile-lists.module.css";

type SavedArticlesListProps = {
  items: SavedArticleItem[];
};

export default function SavedArticlesList({ items }: SavedArticlesListProps) {
  return (
    <ul className={styles.savedList}>
      {items.map((item) => (
        <li key={item.id}>
          <Link href={`/playbook/${item.slug}`} className={styles.savedItem}>
            <div className={styles.savedInfo}>
              <span className={styles.savedTitle}>{item.title}</span>
              {item.category ? (
                <span className={styles.savedCategory}>{item.category}</span>
              ) : null}
            </div>
            <ChevronRight className={styles.savedIcon} aria-hidden />
          </Link>
        </li>
      ))}
    </ul>
  );
}
