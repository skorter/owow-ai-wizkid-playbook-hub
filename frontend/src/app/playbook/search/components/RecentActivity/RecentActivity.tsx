"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./RecentActivity.module.css";
import { fetchRecentSearches, type RecentSearchItem } from "@/lib/api/profile";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";
import { formatTimeAgo } from "@/lib/formatTimeAgo";

const SEARCH_PREVIEW_LIMIT = 4;
const SEARCH_FETCH_LIMIT = 5;

type RecentActivityProps = {
  onSelectQuestion: (question: string) => void;
};

export default function RecentActivity({
  onSelectQuestion,
}: RecentActivityProps) {
  const [items, setItems] = useState<RecentSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRecentSearches(SEARCH_FETCH_LIMIT);
      const list = data.items ?? [];
      setHasMore(list.length > SEARCH_PREVIEW_LIMIT);
      setItems(list.slice(0, SEARCH_PREVIEW_LIMIT));
    } catch (err) {
      setItems([]);
      setHasMore(false);
      setError(getApiErrorMessage(err, "Could not load recent searches."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchRecent() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchRecentSearches(SEARCH_FETCH_LIMIT);
        if (cancelled) return;
        const list = data.items ?? [];
        setHasMore(list.length > SEARCH_PREVIEW_LIMIT);
        setItems(list.slice(0, SEARCH_PREVIEW_LIMIT));
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setHasMore(false);
        setError(getApiErrorMessage(err, "Could not load recent searches."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchRecent();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={styles.activity}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Searches</h2>
        {hasMore && !loading && !error ? (
          <Link
            href="/playbook/profile/activity"
            className={styles.viewHistory}
          >
            View full history
          </Link>
        ) : null}
      </div>

      {loading ? (
        <PageStatus variant="loading" message="Loading recent searches…" />
      ) : null}

      {error ? (
        <PageStatus
          variant="error"
          message={error}
          onRetry={() => void load()}
        />
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className={styles.empty}>
          Your recent AI searches will appear here after you ask the playbook a
          question.
        </p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={styles.card}
                onClick={() => onSelectQuestion(item.question)}
              >
                <span className={styles.question}>{item.question}</span>
                <span className={styles.previewBody}>
                  {item.answerPreview ? (
                    <span className={styles.preview}>{item.answerPreview}</span>
                  ) : (
                    <span className={styles.previewPlaceholder} aria-hidden>
                      —
                    </span>
                  )}
                </span>
                <span className={styles.meta}>
                  <span>{formatTimeAgo(item.createdAt)}</span>
                  {item.confidence > 0 ? (
                    <span>{Math.round(item.confidence * 100)}% match</span>
                  ) : null}
                  {item.sourceCount > 0 ? (
                    <span>
                      {item.sourceCount} source
                      {item.sourceCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
