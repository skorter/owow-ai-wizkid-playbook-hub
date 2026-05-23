"use client";

import { useEffect, useState } from "react";
import styles from "./RecentActivity.module.css";
import { fetchRecentSearches, type RecentSearchItem } from "@/lib/api/profile";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";

type RecentActivityProps = {
  onSelectQuestion: (question: string) => void;
};

function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Recently";
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentActivity({ onSelectQuestion }: RecentActivityProps) {
  const [items, setItems] = useState<RecentSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRecentSearches();
      setItems(data.items ?? []);
    } catch (err) {
      setItems([]);
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
        const data = await fetchRecentSearches();
        if (cancelled) return;
        setItems(data.items ?? []);
      } catch (err) {
        if (cancelled) return;
        setItems([]);
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
      <h2 className={styles.title}>Recent Searches</h2>

      {loading ? (
        <PageStatus variant="loading" message="Loading recent searches…" />
      ) : null}

      {error ? (
        <PageStatus variant="error" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className={styles.empty}>
          Your recent AI searches will appear here after you ask the playbook a
          question.
        </p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={styles.itemButton}
                onClick={() => onSelectQuestion(item.question)}
              >
                <span className={styles.question}>{item.question}</span>
                {item.answerPreview ? (
                  <span className={styles.preview}>{item.answerPreview}</span>
                ) : null}
                <span className={styles.meta}>
                  <span>{formatTimeAgo(item.createdAt)}</span>
                  {item.confidence > 0 ? (
                    <span>{Math.round(item.confidence * 100)}% match</span>
                  ) : null}
                  {item.sourceCount > 0 ? (
                    <span>
                      {item.sourceCount} source{item.sourceCount === 1 ? "" : "s"}
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
