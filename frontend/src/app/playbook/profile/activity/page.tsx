"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./page.module.css";
import {
  fetchProfileActivity,
  type ProfileActivityItem,
} from "@/lib/api/profile";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";
import ProfileActivityList from "@/components/playbook/ProfileActivityList";

const FULL_ACTIVITY_LIMIT = 50;

export default function ActivityHistoryPage() {
  const [items, setItems] = useState<ProfileActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProfileActivity(FULL_ACTIVITY_LIMIT);
      setItems(data.items ?? []);
    } catch (err) {
      setItems([]);
      setError(getApiErrorMessage(err, "Could not load activity history."));
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
        const data = await fetchProfileActivity(FULL_ACTIVITY_LIMIT);
        if (cancelled) return;
        setItems(data.items ?? []);
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setError(getApiErrorMessage(err, "Could not load activity history."));
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
        <h1 className={styles.title}>Activity History</h1>
        <p className={styles.subtitle}>
          Review your recent AI searches, article questions, and playbook activity.
        </p>
      </header>

      <section className={styles.card}>
        {loading ? (
          <PageStatus variant="loading" message="Loading activity history…" />
        ) : null}

        {error ? (
          <PageStatus variant="error" message={error} onRetry={() => void load()} />
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <p className={styles.empty}>
            Your activity history will appear here once you search the playbook or ask
            AI about an article.
          </p>
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <ProfileActivityList items={items} />
        ) : null}
      </section>
    </div>
  );
}
