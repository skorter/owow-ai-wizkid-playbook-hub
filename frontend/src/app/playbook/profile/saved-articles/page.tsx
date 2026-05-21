"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "../activity/page.module.css";
import {
  fetchSavedArticles,
  type SavedArticleItem,
} from "@/lib/api/savedArticles";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";
import SavedArticlesList from "@/components/playbook/SavedArticlesList";

const FULL_SAVED_LIMIT = 50;

export default function SavedArticlesPage() {
  const [items, setItems] = useState<SavedArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSavedArticles(FULL_SAVED_LIMIT);
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

    async function fetchAll() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSavedArticles(FULL_SAVED_LIMIT);
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

    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <Link href="/playbook/profile" className={styles.backLink}>
        <ArrowLeft size={16} aria-hidden />
        Back to profile
      </Link>

      <header className={styles.hero}>
        <h1 className={styles.title}>Saved Articles</h1>
        <p className={styles.subtitle}>
          Your bookmarked playbook articles in one place.
        </p>
      </header>

      <section className={styles.card}>
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
          <SavedArticlesList items={items} />
        ) : null}
      </section>
    </div>
  );
}
