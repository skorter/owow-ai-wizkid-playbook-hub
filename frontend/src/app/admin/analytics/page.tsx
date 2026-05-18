import {
  AdminPageContainer,
  AdminMetricCard,
  AdminPanelCard,
  AdminStatusBadge,
  AdminButton,
} from "@/components/admin";
import UsageTrendsChart from "@/components/admin/charts/UsageTrendsChart";
import PeakHoursChart from "@/components/admin/charts/PeakHoursChart";
import {
  analyticsMetrics,
  analyticsUnansweredQuestions,
  performanceCards,
} from "@/data/adminMockData";
import type { PerformanceCard } from "@/data/adminMockData";
import { AlertTriangle, Lightbulb } from "lucide-react";
import styles from "./page.module.css";

const accentClass: Record<PerformanceCard["accent"], string> = {
  green: styles.accentGreen,
  cyan: styles.accentCyan,
  purple: styles.accentPurple,
};

export default function AnalyticsPage() {
  return (
    <AdminPageContainer
      className={styles.analyticsPage}
      title="Analytics & Insights"
      subtitle="Platform usage and content performance"
    >
      <div className={styles.pageStack}>
        <section className={styles.metricsGrid}>
          {analyticsMetrics.map((metric) => (
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
            <UsageTrendsChart />
          </div>
        </AdminPanelCard>

        <section className={styles.twoColGrid}>
          <AdminPanelCard title="Peak Usage Hours" className={styles.lowerPanel}>
            <div className={styles.peakChartBody}>
              <PeakHoursChart />
            </div>
            <div className={styles.insightBox}>
              <Lightbulb className={styles.insightIcon} aria-hidden />
              <p className={styles.insightText}>
                <strong>Insight:</strong> Most activity occurs between 10–11 AM and 3–4 PM.
              </p>
            </div>
          </AdminPanelCard>

          <AdminPanelCard
            title="Unanswered Questions"
            className={styles.lowerPanel}
            badge={<span className={styles.attentionBadge}>Needs attention</span>}
          >
            <ul className={styles.warningList}>
              {analyticsUnansweredQuestions.map((item) => (
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
            <AdminButton variant="primary" className={styles.fullWidthCta}>
              Create Content for These Topics
            </AdminButton>
          </AdminPanelCard>
        </section>

        <section className={styles.performanceGrid}>
          {performanceCards.map((card) => (
            <article
              key={card.id}
              className={`${styles.performanceCard} ${accentClass[card.accent]}`}
            >
              <span className={styles.performanceTitle}>{card.title}</span>
              <span className={styles.performanceSubtitle}>{card.subtitle}</span>
              <span className={styles.performanceValue}>{card.value}</span>
            </article>
          ))}
        </section>
      </div>
    </AdminPageContainer>
  );
}
