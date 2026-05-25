"use client";

import { useState } from "react";
import styles from "./TopicsList.module.css";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Category } from "@/types/playbook";

const INITIAL_VISIBLE = 8;

type TopicsListProps = {
  category: Category;
};

export default function TopicsList({ category }: TopicsListProps) {
  const Icon = category.icon;
  const [expanded, setExpanded] = useState(false);
  const hasMore = category.pages.length > INITIAL_VISIBLE;
  const visiblePages = expanded
    ? category.pages
    : category.pages.slice(0, INITIAL_VISIBLE);

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
        {visiblePages.map((page) => (
          <li key={page.slug} className={styles.article}>
            <Link
              href={`/playbook/${page.slug}?from=topics`}
              className={styles.card}
            >
              <div className={styles.title}>
                <FileText className={styles.icon} />
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
      {hasMore ? (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded
            ? "Show fewer articles"
            : `Show ${category.pages.length - INITIAL_VISIBLE} more articles`}
        </button>
      ) : null}
    </li>
  );
}
