"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./SavedArticles.module.css";
import { Bookmark } from "lucide-react";
import {
  fetchSavedArticles,
  type SavedArticleItem,
} from "@/lib/api/savedArticles";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";
import SavedArticlesList from "@/components/playbook/SavedArticlesList";

const PROFILE_PREVIEW_LIMIT = 5;
const PROFILE_FETCH_LIMIT = 6;

export default function SavedArticles() {
  const [items, setItems] = useState<SavedArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSavedArticles(PROFILE_FETCH_LIMIT);
      const list = data.items ?? [];
      setHasMore(list.length > PROFILE_PREVIEW_LIMIT);
      setItems(list.slice(0, PROFILE_PREVIEW_LIMIT));
    } catch (err) {
      setItems([]);
      setHasMore(false);
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
        const data = await fetchSavedArticles(PROFILE_FETCH_LIMIT);
        if (cancelled) return;
        const list = data.items ?? [];
        setHasMore(list.length > PROFILE_PREVIEW_LIMIT);
        setItems(list.slice(0, PROFILE_PREVIEW_LIMIT));
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setHasMore(false);
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
        <div className={styles.headerTitle}>
          <Bookmark className={styles.icon} />
          <h2 className={styles.title}>Saved Articles</h2>
        </div>
        {hasMore && !loading && !error ? (
          <Link href="/playbook/profile/saved-articles" className={styles.viewMore}>
            View all
          </Link>
        ) : null}
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
        <SavedArticlesList items={items} />
      ) : null}
    </section>
  );
}
