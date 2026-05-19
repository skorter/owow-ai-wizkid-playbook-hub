import {
  AdminPageContainer,
  AdminMetricCard,
  AdminPanelCard,
  AdminStatusBadge,
  AdminButton,
} from "@/components/admin";
import TopicsBarChart from "@/components/admin/charts/TopicsBarChart";
import ContentDonutChart from "@/components/admin/charts/ContentDonutChart";
import {
  dashboardMetrics,
  dashboardMissingInfo,
  dashboardRecentArticles,
  missingInfoPendingCount,
} from "@/data/adminMockData";
import type { DashboardMissingInfoItem } from "@/data/adminMockData";
import { Plus, Trash2, TrendingUp, Eye } from "lucide-react";
import styles from "./page.module.css";

export default function DashboardPage() {
  return (
    <AdminPageContainer
      title="HR Admin Dashboard"
      subtitle="Content management and analytics overview"
    >
      <section className={styles.metricsGrid}>
        {dashboardMetrics.map((metric) => (
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
            <TopicsBarChart />
          </div>
        </AdminPanelCard>

        <AdminPanelCard title="Content Distribution" className={styles.chartPanel}>
          <div className={`${styles.chartPanelBody} ${styles.donutPanelBody}`}>
            <ContentDonutChart />
          </div>
        </AdminPanelCard>
      </section>

      <section className={styles.lowerGrid}>
        <AdminPanelCard
          title="Missing Information Requests"
          badge={<span className={styles.pendingBadge}>{missingInfoPendingCount} pending</span>}
        >
          <ul className={styles.miniCardList}>
            {dashboardMissingInfo.map((item) => (
              <li key={item.id} className={styles.miniCard}>
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
                <AdminButton variant="primary" size="sm" className={styles.fullWidthButton}>
                  Create Article
                </AdminButton>
              </li>
            ))}
          </ul>
        </AdminPanelCard>

        <AdminPanelCard
          title="Recent Articles"
          action={
            <AdminButton variant="primary" size="sm" icon={Plus}>
              New Article
            </AdminButton>
          }
        >
          <ul className={styles.miniCardList}>
            {dashboardRecentArticles.map((article) => (
              <li key={article.id} className={styles.miniCard}>
                <div className={styles.miniCardTop}>
                  <h3 className={styles.miniCardTitle}>{article.title}</h3>
                  <span className={styles.viewsStat}>
                    <Eye className={styles.viewsIcon} aria-hidden />
                    {article.views}
                  </span>
                </div>
                <ItemMeta
                  category={article.category}
                  categoryColor={article.categoryColor}
                  secondary={`Updated ${article.updatedAgo}`}
                />
                <div className={styles.articleActionRow}>
                  <button type="button" className={styles.editButton}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                    aria-label={`Delete ${article.title}`}
                  >
                    <Trash2 />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </AdminPanelCard>
      </section>
    </AdminPageContainer>
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
