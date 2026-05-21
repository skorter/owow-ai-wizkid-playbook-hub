"use client";

import { useEffect, useState } from "react";
import {
  AdminPageContainer,
  AdminMetricCard,
  AdminPanelCard,
  AdminStatusBadge,
  AdminButton,
} from "@/components/admin";
import UsageTrendsChart from "@/components/admin/charts/UsageTrendsChart";
import PeakHoursChart from "@/components/admin/charts/PeakHoursChart";
import type { PerformanceCard } from "@/data/adminMockData";
import {
  fetchAnalyticsPageData,
  type AnalyticsViewModel,
} from "@/lib/mappers/adminAnalytics";
import { ApiError } from "@/lib/api";
import { AlertTriangle, Lightbulb, RefreshCw } from "lucide-react";
import styles from "./page.module.css";

type LoadState = "loading" | "error" | "ready";

const accentClass: Record<PerformanceCard["accent"], string> = {
  green: styles.accentGreen,
  cyan: styles.accentCyan,
  purple: styles.accentPurple,
};

export default function AnalyticsPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<AnalyticsViewModel | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const analytics = await fetchAnalyticsPageData();
        if (cancelled) return;
        setData(analytics);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        setData(null);
        setLoadState("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load analytics. Please try again.",
        );
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const analytics = await fetchAnalyticsPageData();
      setData(analytics);
      setLoadState("ready");
    } catch (err) {
      setData(null);
      setLoadState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Could not load analytics. Please try again.",
      );
    }
  };

  if (loadState === "loading") {
    return (
      <AdminPageContainer
        className={styles.analyticsPage}
        title="Analytics & Insights"
        subtitle="Platform usage and content performance"
      >
        <p className={styles.stateMessage}>Loading analytics…</p>
      </AdminPageContainer>
    );
  }

  if (loadState === "error") {
    return (
      <AdminPageContainer
        className={styles.analyticsPage}
        title="Analytics & Insights"
        subtitle="Platform usage and content performance"
      >
        <div className={styles.stateBlock}>
          <p className={styles.stateError}>{errorMessage}</p>
          <AdminButton variant="primary" icon={RefreshCw} onClick={handleRetry}>
            Retry
          </AdminButton>
        </div>
      </AdminPageContainer>
    );
  }

  if (!data) {
    return null;
  }

  const hasUnanswered = data.unanswered.length > 0;

  return (
    <AdminPageContainer
      className={styles.analyticsPage}
      title="Analytics & Insights"
      subtitle="Platform usage and content performance"
    >
      <div className={styles.pageStack}>
        <section className={styles.metricsGrid}>
          {data.metrics.map((metric) => (
            <AdminMetricCard
              key={metric.id}
              icon={metric.icon}
              value={metric.value}
              label={metric.label}
              iconTone={metric.iconTone}
            />
          ))}
        </section>

        <AdminPanelCard
          title="Usage Trends (Last 7 Days)"
          className={styles.trendsPanel}
        >
          <div className={styles.trendsChartBody}>
            <UsageTrendsChart
              data={data.usageTrends}
              yMax={data.usageTrendsYMax}
              yTicks={data.usageTrendsYTicks}
            />
          </div>
        </AdminPanelCard>

        <section className={styles.twoColGrid}>
          <AdminPanelCard title="Peak Usage Hours" className={styles.lowerPanel}>
            <div className={styles.peakChartBody}>
              <PeakHoursChart
                data={data.peakHours}
                yMax={data.peakHoursYMax}
                yTicks={data.peakHoursYTicks}
              />
            </div>
            <div className={styles.insightBox}>
              <Lightbulb className={styles.insightIcon} aria-hidden />
              <p className={styles.insightText}>
                <strong>Insight:</strong> {data.peakInsight}
              </p>
            </div>
          </AdminPanelCard>

          <AdminPanelCard
            title="Unanswered Questions"
            className={styles.lowerPanel}
            badge={
              hasUnanswered ? (
                <span className={styles.attentionBadge}>Needs attention</span>
              ) : undefined
            }
          >
            {hasUnanswered ? (
              <ul className={styles.warningList}>
                {data.unanswered.map((item) => (
                  <li key={item.id} className={styles.warningCard}>
                    <div className={styles.warningRow}>
                      <div className={styles.warningContent}>
                        <p className={styles.warningQuestion}>{item.question}</p>
                        <div className={styles.warningMeta}>
                          <AdminStatusBadge color={item.categoryColor}>
                            {item.category}
                          </AdminStatusBadge>
                          <span className={styles.failedAttempts}>
                            {item.failedAttempts} failed attempts
                          </span>
                        </div>
                      </div>
                      <AlertTriangle className={styles.warningIcon} aria-hidden />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.panelEmpty}>
                No unanswered searches in the log. Great coverage.
              </p>
            )}
            <AdminButton variant="primary" className={styles.fullWidthCta}>
              Create Content for These Topics
            </AdminButton>
          </AdminPanelCard>
        </section>

        <section className={styles.performanceGrid}>
          {data.performanceCards.length > 0 ? (
            data.performanceCards.map((card) => (
              <article
                key={card.id}
                className={`${styles.performanceCard} ${accentClass[card.accent]}`}
              >
                <span className={styles.performanceTitle}>{card.title}</span>
                <span className={styles.performanceSubtitle}>{card.subtitle}</span>
                <span className={styles.performanceValue}>{card.value}</span>
              </article>
            ))
          ) : (
            <p className={styles.panelEmpty}>Performance metrics are not available yet.</p>
          )}
        </section>
      </div>
    </AdminPageContainer>
  );
}
