"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./RecentActivity.module.css";
import { History } from "lucide-react";
import {
  fetchProfileActivity,
  type ProfileActivityItem,
} from "@/lib/api/profile";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";

function formatTimeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Recently";
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RecentActivity() {
  const [items, setItems] = useState<ProfileActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProfileActivity();
      setItems(data.items ?? []);
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, "Could not load activity."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchActivity() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProfileActivity();
        if (cancelled) return;
        setItems(data.items ?? []);
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setError(getApiErrorMessage(err, "Could not load activity."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className={styles.recentActivity}>
      <div className={styles.header}>
        <History className={styles.icon} />
        <h2 className={styles.title}>Recent Activity</h2>
      </div>

      {loading ? (
        <PageStatus variant="loading" message="Loading activity…" />
      ) : null}

      {error ? (
        <PageStatus variant="error" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className={styles.empty}>
          Your activity will appear here once you search the playbook, ask AI about
          an article, or complete onboarding content.
        </p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemHeader}>
                <span className={styles.badge}>{item.title}</span>
                <span className={styles.time}>{formatTimeAgo(item.createdAt)}</span>
              </div>
              <p className={styles.question}>{item.question}</p>
              {item.answerPreview ? (
                <p className={styles.preview}>{item.answerPreview}</p>
              ) : null}
              <div className={styles.meta}>
                {item.confidence != null && item.confidence > 0 ? (
                  <span>{Math.round(item.confidence * 100)}% match</span>
                ) : null}
                {item.sourceCount > 0 ? (
                  <span>
                    {item.sourceCount} source{item.sourceCount === 1 ? "" : "s"}
                  </span>
                ) : null}
                {item.articleSlug ? (
                  <Link href={`/playbook/${item.articleSlug}`} className={styles.link}>
                    {item.articleTitle ?? "View article"}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
