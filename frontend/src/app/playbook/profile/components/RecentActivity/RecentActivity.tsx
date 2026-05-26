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
import ProfileActivityList from "@/components/playbook/ProfileActivityList";

const PROFILE_PREVIEW_LIMIT = 3;
const PROFILE_FETCH_LIMIT = 4;

export default function RecentActivity() {
  const [items, setItems] = useState<ProfileActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProfileActivity(PROFILE_FETCH_LIMIT);
      const list = data.items ?? [];
      setHasMore(list.length > PROFILE_PREVIEW_LIMIT);
      setItems(list.slice(0, PROFILE_PREVIEW_LIMIT));
    } catch (err) {
      setItems([]);
      setHasMore(false);
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
        const data = await fetchProfileActivity(PROFILE_FETCH_LIMIT);
        if (cancelled) return;
        const list = data.items ?? [];
        setHasMore(list.length > PROFILE_PREVIEW_LIMIT);
        setItems(list.slice(0, PROFILE_PREVIEW_LIMIT));
      } catch (err) {
        if (cancelled) return;
        setItems([]);
        setHasMore(false);
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
        <div className={styles.headerTitle}>
          <History className={styles.icon} />
          <h2 className={styles.title}>Recent Activity</h2>
        </div>
        {hasMore && !loading && !error ? (
          <Link href="/playbook/profile/activity" className={styles.viewMore}>
            View more
          </Link>
        ) : null}
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
        <ProfileActivityList items={items} />
      ) : null}
    </section>
  );
}
