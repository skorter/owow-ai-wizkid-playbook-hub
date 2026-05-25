"use client";

import { useEffect, useState } from "react";
import styles from "./AIInsights.module.css";
import { TrendingUp, Search, MessageCircle, Bookmark, Target } from "lucide-react";
import { fetchProfileInsights, type ProfileInsightsResponse } from "@/lib/api/profile";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";
import {
  getOnboardingProgressKey,
  getOnboardingProgressPercent,
  readOnboardingProgress,
} from "@/lib/onboardingProgress";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import { getStoredSessionUser } from "@/lib/auth/session";

type InsightCard = {
  id: string;
  label: string;
  value: string;
  Icon: typeof Search;
  color: string;
};

export default function AIInsights() {
  const [insights, setInsights] = useState<ProfileInsightsResponse | null>(null);
  const [onboardingPercent, setOnboardingPercent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const user = getStoredSessionUser();
      const progressKey = getOnboardingProgressKey(user?.id, user?.email);

      const [data, onboarding] = await Promise.all([
        fetchProfileInsights(),
        fetchPlaybookOnboarding().catch(() => ({ steps: [], fromFallback: true })),
      ]);

      const allSlugs = onboarding.steps.flatMap((s) =>
        s.articles.map((a) => a.slug.trim().toLowerCase()),
      );
      const completed = readOnboardingProgress(progressKey).completedArticleSlugs;
      const percent =
        allSlugs.length > 0
          ? getOnboardingProgressPercent(completed, allSlugs)
          : null;

      setInsights(data);
      setOnboardingPercent(percent);
    } catch (err) {
      setInsights(null);
      setError(getApiErrorMessage(err, "Could not load AI insights."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchInsights() {
      setLoading(true);
      setError("");
      try {
        const user = getStoredSessionUser();
        const progressKey = getOnboardingProgressKey(user?.id, user?.email);
        const [data, onboarding] = await Promise.all([
          fetchProfileInsights(),
          fetchPlaybookOnboarding().catch(() => ({ steps: [], fromFallback: true })),
        ]);
        if (cancelled) return;
        const allSlugs = onboarding.steps.flatMap((s) =>
          s.articles.map((a) => a.slug.trim().toLowerCase()),
        );
        const completed = readOnboardingProgress(progressKey).completedArticleSlugs;
        setInsights(data);
        setOnboardingPercent(
          allSlugs.length > 0
            ? getOnboardingProgressPercent(completed, allSlugs)
            : null,
        );
      } catch (err) {
        if (cancelled) return;
        setInsights(null);
        setError(getApiErrorMessage(err, "Could not load AI insights."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchInsights();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards: InsightCard[] = insights
    ? [
        {
          id: "searches",
          label: "AI searches",
          value: String(insights.totalSearches),
          Icon: Search,
          color: "#00d9ff",
        },
        {
          id: "ask",
          label: "Article questions",
          value: String(insights.totalAskPageQuestions),
          Icon: MessageCircle,
          color: "#a78bfa",
        },
        {
          id: "confidence",
          label: "Avg confidence",
          value:
            insights.averageConfidence > 0
              ? `${Math.round(insights.averageConfidence * 100)}%`
              : "—",
          Icon: Target,
          color: "#ffd500",
        },
        {
          id: "topic",
          label: "Top explored topic",
          value: insights.topCategory ?? "—",
          Icon: TrendingUp,
          color: "#22c55e",
        },
        {
          id: "saved",
          label: "Saved articles",
          value: String(insights.savedArticlesCount),
          Icon: Bookmark,
          color: "#ff5c5c",
        },
        {
          id: "onboarding",
          label: "Onboarding progress",
          value:
            onboardingPercent != null ? `${onboardingPercent}%` : "—",
          Icon: TrendingUp,
          color: "#f97316",
        },
      ]
    : [];

  return (
    <section className={styles.aiInsights}>
      <div className={styles.header}>
        <TrendingUp className={styles.icon} />
        <h2 className={styles.title}>AI Insights & Analytics</h2>
      </div>

      {loading ? (
        <PageStatus variant="loading" message="Loading insights…" />
      ) : null}

      {error ? (
        <PageStatus variant="error" message={error} onRetry={() => void load()} />
      ) : null}

      {!loading && !error && cards.length > 0 ? (
        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.id} className={styles.card}>
              <card.Icon className={styles.icon} style={{ color: card.color }} />
              <span className={styles.label}>{card.label}</span>
              <span className={styles.value} style={{ color: card.color }}>
                {card.value}
              </span>
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !error && !insights ? (
        <p className={styles.placeholder}>
          Start searching the playbook or asking questions on articles to see your
          personal AI insights here.
        </p>
      ) : null}
    </section>
  );
}
