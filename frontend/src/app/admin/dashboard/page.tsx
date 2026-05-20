"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AdminPageContainer,
  AdminMetricCard,
  AdminPanelCard,
  AdminStatusBadge,
  AdminButton,
} from "@/components/admin";
import TopicsBarChart from "@/components/admin/charts/TopicsBarChart";
import ContentDonutChart from "@/components/admin/charts/ContentDonutChart";
import type { DashboardMissingInfoItem } from "@/data/adminMockData";
import {
  fetchDashboardData,
  type DashboardViewModel,
} from "@/lib/mappers/adminDashboard";
import { deleteArticle } from "@/lib/mappers/articles";
import { ApiError } from "@/lib/api";
import { Plus, Trash2, TrendingUp, Eye, RefreshCw, Pencil } from "lucide-react";
import styles from "./page.module.css";

type LoadState = "loading" | "error" | "ready";

export default function DashboardPage() {
  const router = useRouter();
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [data, setData] = useState<DashboardViewModel | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    const dashboard = await fetchDashboardData();
    setData(dashboard);
    setLoadState("ready");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialDashboard() {
      try {
        await loadDashboard();
        if (cancelled) return;
      } catch (err) {
        if (cancelled) return;
        setData(null);
        setLoadState("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load dashboard data. Please try again.",
        );
      }
    }

    void loadInitialDashboard();

    return () => {
      cancelled = true;
    };
  }, [loadDashboard]);

  const handleRetry = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      await loadDashboard();
    } catch (err) {
      setData(null);
      setLoadState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Could not load dashboard data. Please try again.",
      );
    }
  };

  const handleDeleteArticle = async (articleId: string, title: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteArticle(articleId);
      setActionMessage(`"${title}" was deleted.`);
      await loadDashboard();
    } catch (err) {
      setActionMessage(
        err instanceof ApiError
          ? err.message
          : "Could not delete the article. Please try again.",
      );
    }
  };

  if (loadState === "loading") {
    return (
      <AdminPageContainer
        title="HR Admin Dashboard"
        subtitle="Content management and analytics overview"
      >
        <p className={styles.stateMessage}>Loading dashboard…</p>
      </AdminPageContainer>
    );
  }

  if (loadState === "error") {
    return (
      <AdminPageContainer
        title="HR Admin Dashboard"
        subtitle="Content management and analytics overview"
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

  return (
    <AdminPageContainer
      title="HR Admin Dashboard"
      subtitle="Content management and analytics overview"
    >
      {actionMessage ? (
        <p className={styles.actionMessage} role="status">
          {actionMessage}
        </p>
      ) : null}

      <section className={styles.metricsGrid}>
        {data.metrics.map((metric) => (
          <AdminMetricCard
            key={metric.id}
            icon={metric.icon}
            value={metric.value}
            label={metric.label}
            trend={metric.trend}
            iconTone={metric.iconTone}
            showNotificationDot={metric.showNotificationDot}
          />
        ))}
      </section>

      <section className={styles.chartsGrid}>
        <AdminPanelCard
          title="Most Searched Topics (Last 30 Days)"
          className={styles.chartPanel}
        >
          <div className={styles.chartPanelBody}>
            <TopicsBarChart
              topics={data.searchedTopics}
              yMax={data.searchedTopicsYMax}
              yTicks={data.searchedTopicsYTicks}
            />
          </div>
        </AdminPanelCard>

        <AdminPanelCard title="Content Distribution" className={styles.chartPanel}>
          <div className={`${styles.chartPanelBody} ${styles.donutPanelBody}`}>
            <ContentDonutChart segments={data.contentDistribution} />
          </div>
        </AdminPanelCard>
      </section>

      <section className={styles.lowerGrid}>
        <AdminPanelCard
          title="Missing Information Requests"
          badge={
            data.missingInfoPendingCount > 0 ? (
              <span className={styles.pendingBadge}>
                {data.missingInfoPendingCount} pending
              </span>
            ) : undefined
          }
        >
          {data.missingInfoItems.length === 0 ? (
            <p className={styles.panelEmpty}>No open missing information requests.</p>
          ) : (
            <ul className={styles.miniCardList}>
              {data.missingInfoItems.map((item) => (
                <MissingInfoCard key={item.id} item={item} />
              ))}
            </ul>
          )}
        </AdminPanelCard>

        <AdminPanelCard
          title="Recent Articles"
          action={
            <Link href="/admin/documents?action=create">
              <AdminButton variant="primary" size="sm" icon={Plus}>
                New Document
              </AdminButton>
            </Link>
          }
        >
          {data.recentArticles.length === 0 ? (
            <p className={styles.panelEmpty}>No published articles yet.</p>
          ) : (
            <ul className={styles.miniCardList}>
              {data.recentArticles.map((article) => (
                <li key={article.id} className={styles.miniCard}>
                  <div className={styles.miniCardTop}>
                    <h3 className={styles.miniCardTitle}>{article.title}</h3>
                    <span className={styles.viewsStat}>
                      <Eye className={styles.viewsIcon} aria-hidden />
                      {article.views > 0 ? article.views : "—"}
                    </span>
                  </div>
                  <ItemMeta
                    category={article.category}
                    categoryColor={article.categoryColor}
                    secondary={`Updated ${article.updatedAgo}`}
                  />
                  <div className={styles.articleActionRow}>
                    <button
                      type="button"
                      className={styles.editButton}
                      onClick={() =>
                        router.push(`/admin/documents?edit=${article.id}`)
                      }
                    >
                      <Pencil size={14} aria-hidden />
                      Edit
                    </button>
                    {article.status === "PUBLISHED" && article.slug ? (
                      <Link
                        href={`/playbook/${article.slug}`}
                        className={styles.viewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye size={14} aria-hidden />
                        View
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={styles.viewLink}
                        disabled
                        title="Publish the article to preview in the playbook"
                      >
                        <Eye size={14} aria-hidden />
                        View
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                      aria-label={`Delete ${article.title}`}
                      onClick={() => void handleDeleteArticle(article.id, article.title)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminPanelCard>
      </section>
    </AdminPageContainer>
  );
}

function MissingInfoCard({ item }: { item: DashboardMissingInfoItem }) {
  return (
    <li className={styles.miniCard}>
      <div className={styles.miniCardTop}>
        <h3 className={styles.miniCardTitle}>{item.title}</h3>
        <span className={styles.requestStat}>
          <TrendingUp className={styles.requestTrendIcon} aria-hidden />
          {item.requestCount}
        </span>
      </div>
      <ItemMeta
        category={item.category}
        categoryColor={item.categoryColor}
        secondary={item.timeAgo}
      />
      <Link href="/admin/documents">
        <AdminButton variant="primary" size="sm" className={styles.fullWidthButton}>
          Create Article
        </AdminButton>
      </Link>
    </li>
  );
}

function ItemMeta({
  category,
  categoryColor,
  secondary,
}: {
  category: string;
  categoryColor: DashboardMissingInfoItem["categoryColor"];
  secondary: string;
}) {
  return (
    <div className={styles.itemMeta}>
      <AdminStatusBadge color={categoryColor}>{category}</AdminStatusBadge>
      <span className={styles.itemMetaDot}>·</span>
      <span>{secondary}</span>
    </div>
  );
}
