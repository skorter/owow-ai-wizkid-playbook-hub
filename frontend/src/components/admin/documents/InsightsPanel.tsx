"use client";

import {
  TrendingUp,
  Search,
  Clock,
  Sparkles,
  AlertCircle,
  Activity,
  RefreshCw,
} from "lucide-react";
import type { DocumentInsightsViewModel } from "@/lib/mappers/documentHub";
import styles from "@/app/admin/documents/page.module.css";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type InsightsPanelProps = {
  insights: DocumentInsightsViewModel | null;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};

export default function InsightsPanel({
  insights,
  loading = false,
  error = "",
  onRetry,
}: InsightsPanelProps) {
  if (loading) {
    return (
      <aside className={styles.insightsPanel}>
        <h2 className={styles.insightsTitle}>Hub insights</h2>
        <p className={styles.insightLoading}>Loading insights…</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={styles.insightsPanel}>
        <h2 className={styles.insightsTitle}>Hub insights</h2>
        <p className={styles.insightError}>{error}</p>
        {onRetry ? (
          <button type="button" className={styles.insightRetry} onClick={onRetry}>
            <RefreshCw size={14} aria-hidden />
            Retry
          </button>
        ) : null}
      </aside>
    );
  }

  if (!insights) {
    return (
      <aside className={styles.insightsPanel}>
        <h2 className={styles.insightsTitle}>Hub insights</h2>
        <p className={styles.insightLoading}>No insight data yet.</p>
      </aside>
    );
  }

  const health = insights.contentHealth;

  return (
    <aside className={styles.insightsPanel}>
      <h2 className={styles.insightsTitle}>Hub insights</h2>

      <div className={`${styles.healthCard} ${styles.accentGreen}`}>
        <div className={styles.healthHeader}>
          <Activity className={styles.insightHighlightIcon} aria-hidden />
          <span className={styles.insightHighlightLabel}>{health.label}</span>
        </div>
        <p className={styles.healthScore}>{health.score}%</p>
        <div className={styles.healthBar}>
          <div className={styles.healthBarFill} style={{ width: `${health.score}%` }} />
        </div>
        <p className={styles.healthMeta}>Coverage, freshness & request resolution</p>
      </div>

      <InsightHighlight
        icon={TrendingUp}
        label="Most viewed article"
        title={insights.mostViewed.title}
        meta={insights.mostViewed.meta}
        accent={insights.mostViewed.accent}
      />
      <InsightHighlight
        icon={Search}
        label="Most requested missing topic"
        title={insights.mostRequestedMissing.title}
        meta={insights.mostRequestedMissing.meta}
        accent={insights.mostRequestedMissing.accent}
      />

      <div className={styles.insightSection}>
        <h3 className={styles.insightSectionTitle}>
          <Clock size={14} aria-hidden />
          Recent edits
        </h3>
        {insights.recentEdits.length > 0 ? (
          <ul className={styles.insightList}>
            {insights.recentEdits.map((edit) => (
              <li key={edit.id} className={styles.insightListItem}>
                <span className={styles.insightListTitle}>{edit.title}</span>
                <span className={styles.insightListMeta}>
                  {edit.editor} · {edit.timeAgo}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.insightEmpty}>No recent article updates yet.</p>
        )}
      </div>

      <AiSection suggestions={insights.aiSuggestions} />
      <MissingQueue items={insights.missingContentQueue} />
    </aside>
  );
}

function AiSection({ suggestions }: { suggestions: DocumentInsightsViewModel["aiSuggestions"] }) {
  return (
    <div className={styles.insightSection}>
      <h3 className={styles.insightSectionTitle}>
        <Sparkles size={14} aria-hidden />
        AI suggestions
      </h3>
      <ul className={styles.miniInsightCards}>
        {suggestions.map((item) => (
          <li
            key={item.id}
            className={`${styles.miniInsightCard} ${styles[`accent${capitalize(item.accent)}`]}`}
          >
            <span className={styles.miniInsightLabel}>{item.label}</span>
            <span className={styles.miniInsightValue}>{item.value}</span>
            {item.meta ? <span className={styles.miniInsightMeta}>{item.meta}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MissingQueue({ items }: { items: DocumentInsightsViewModel["missingContentQueue"] }) {
  return (
    <div className={styles.insightSection}>
      <h3 className={styles.insightSectionTitle}>
        <AlertCircle size={14} aria-hidden />
        Missing content queue
      </h3>
      {items.length > 0 ? (
        <ul className={styles.miniInsightCards}>
          {items.map((item) => (
            <li
              key={item.id}
              className={`${styles.miniInsightCard} ${styles[`accent${capitalize(item.accent)}`]}`}
            >
              <span className={styles.miniInsightLabel}>{item.label}</span>
              <span className={styles.miniInsightValue}>{item.value}</span>
              {item.meta ? <span className={styles.miniInsightMeta}>{item.meta}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.insightEmpty}>No open missing content requests.</p>
      )}
    </div>
  );
}

function InsightHighlight({
  icon: Icon,
  label,
  title,
  meta,
  accent,
}: {
  icon: typeof TrendingUp;
  label: string;
  title: string;
  meta: string;
  accent: "yellow" | "cyan" | "green" | "orange" | "purple";
}) {
  return (
    <div className={`${styles.insightHighlight} ${styles[`accent${capitalize(accent)}`]}`}>
      <div className={styles.insightHighlightTop}>
        <Icon className={styles.insightHighlightIcon} aria-hidden />
        <span className={styles.insightHighlightLabel}>{label}</span>
      </div>
      <p className={styles.insightHighlightTitle}>{title}</p>
      <p className={styles.insightHighlightMeta}>{meta}</p>
    </div>
  );
}
