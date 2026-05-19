"use client";

import {
  TrendingUp,
  Search,
  Clock,
  Sparkles,
  AlertCircle,
  Activity,
} from "lucide-react";
import { documentInsights } from "@/data/adminMockData";
import styles from "@/app/admin/documents/page.module.css";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function InsightsPanel() {
  const health = documentInsights.contentHealth;

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
        title={documentInsights.mostViewed.title}
        meta={documentInsights.mostViewed.meta}
        accent={documentInsights.mostViewed.accent}
      />
      <InsightHighlight
        icon={Search}
        label="Most requested missing topic"
        title={documentInsights.mostRequestedMissing.title}
        meta={documentInsights.mostRequestedMissing.meta}
        accent={documentInsights.mostRequestedMissing.accent}
      />

      <div className={styles.insightSection}>
        <h3 className={styles.insightSectionTitle}>
          <Clock size={14} aria-hidden />
          Recent edits
        </h3>
        <ul className={styles.insightList}>
          {documentInsights.recentEdits.map((edit) => (
            <li key={edit.id} className={styles.insightListItem}>
              <span className={styles.insightListTitle}>{edit.title}</span>
              <span className={styles.insightListMeta}>
                {edit.editor} · {edit.timeAgo}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <AiSection />
      <MissingQueue />
    </aside>
  );
}

function AiSection() {
  return (
    <div className={styles.insightSection}>
      <h3 className={styles.insightSectionTitle}>
        <Sparkles size={14} aria-hidden />
        AI suggestions
      </h3>
      <ul className={styles.miniInsightCards}>
        {documentInsights.aiSuggestions.map((item) => (
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

function MissingQueue() {
  return (
    <div className={styles.insightSection}>
      <h3 className={styles.insightSectionTitle}>
        <AlertCircle size={14} aria-hidden />
        Missing content queue
      </h3>
      <ul className={styles.miniInsightCards}>
        {documentInsights.missingContentQueue.map((item) => (
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
