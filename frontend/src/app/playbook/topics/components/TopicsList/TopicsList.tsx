import styles from "./TopicsList.module.css";
import Link from "next/link";
import { FileText, LucideIcon } from "lucide-react";
import { Category } from "@/types/playbook";
import { categories, iconMap } from "@/lib/constants/categories";

type TopicsListProps = {
  category: Category;
};

export default function TopicsList({ category }: TopicsListProps) {
  const Icon = iconMap[category.icon];

  return (
    <li className={styles.section}>
      <div className={styles.header}>
        <div className={styles.title}>
          {Icon && <Icon className={styles.icon} />}
          <p className={styles.label}>{category.label}</p>
        </div>
        <p className={styles.description}>{category.description}</p>
      </div>
      <ul className={styles.articles}>
        {category.pages.map((page) => (
          <li key={page.slug} className={styles.article}>
            <Link href={`/playbook/${page.slug}`} className={styles.card}>
              <div className={styles.title}>
                <FileText className={styles.fileTextIcon} />
                <p className={styles.label}>{page.label}</p>
              </div>
              <p className={styles.description}>{page.description}</p>
              <p className={styles.subtopicCount}>
                {page.subpages.length > 0
                  ? `${page.subpages.length} subtopics`
                  : "Article"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
