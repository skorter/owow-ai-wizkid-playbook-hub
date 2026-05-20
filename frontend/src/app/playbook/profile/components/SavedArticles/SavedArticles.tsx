"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./SavedArticles.module.css";
import { Bookmark, ChevronRight } from "lucide-react";
import { fetchSavedArticles, type SavedArticleItem } from "@/lib/api/savedArticles";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";

export default function SavedArticles() {
  const [items, setItems] = useState<SavedArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSavedArticles();
      setItems(data.items ?? []);
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, "Could not load saved articles."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchSaved() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSavedArticles();
        if (cancelled) return;
        setItems(data.items ?? []);
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setError(getApiErrorMessage(err, "Could not load saved articles."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchSaved();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={styles.savedArticles}>
      <div className={styles.header}>
        <Bookmark className={styles.icon} />
        <h2 className={styles.title}>Saved Articles</h2>
      </div>

      {loading ? (
        <PageStatus variant="loading" message="Loading saved articles…" />
      ) : null}

      {error ? (
        <PageStatus variant="error" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className={styles.empty}>
          Saved articles will appear here when you bookmark important playbook
          content.
        </p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/playbook/${item.slug}`} className={styles.item}>
                <div className={styles.info}>
                  <span className={styles.label}>{item.title}</span>
                  {item.category ? (
                    <span className={styles.category}>{item.category}</span>
                  ) : null}
                </div>
                <ChevronRight className={styles.icon} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
