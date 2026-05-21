/**
 * Maps backend analytics + articles API responses to admin dashboard UI models.
 *
 * Fallbacks (no backend field):
 * - KPI trend badges: omitted (overview has no period comparison).
 * - "Active Users" KPI uses totalUsers (not DAU).
 * - Article views: shown as "—" (Article model has no view count).
 * - Missing info category: derived from report `type`, not a real category.
 * - Missing info requestCount: 1 per report (no aggregated count API).
 */

import { apiGet, endpoints } from "@/lib/api";
import type { DashboardMetric } from "@/data/adminMockData";
import type {
  ContentDistributionSegment,
  DashboardMissingInfoItem,
  DashboardRecentArticle,
  SearchedTopic,
} from "@/data/adminMockData";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";
import { AlertCircle, FileText, TrendingUp, Users } from "lucide-react";

// ——— API response shapes ———

export type AnalyticsOverview = {
  totalUsers: number;
  totalCategories: number;
  totalArticles: number;
  totalPublishedArticles: number;
  totalDraftArticles: number;
  totalArchivedArticles: number;
  totalSearches: number;
  totalFeedback: number;
  totalMissingInfoReports: number;
  openMissingInfoReports: number;
  reviewedMissingInfoReports: number;
  resolvedMissingInfoReports: number;
  activeOnboardingSteps: number;
  inactiveOnboardingSteps: number;
};

export type PopularQuestion = {
  query: string;
  count: number;
};

export type MissingInfoAnalytics = {
  totalMissingInfoReports: number;
  openMissingInfoReports: number;
  missingInfoByStatus: { status: string; count: number }[];
  missingInfoByType: { type: string; count: number }[];
  recentMissingInfoReports: {
    id: string;
    type: string;
    title: string | null;
    description: string;
    status: string;
    createdAt: string;
    article?: { id: string; title: string; slug: string } | null;
  }[];
};

export type ApiArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: string;
  updatedAt: string;
  createdAt: string;
  category: { id: string; name: string; slug: string };
  author?: { id: string; fullName: string | null; email: string } | null;
};

export type DashboardViewModel = {
  metrics: DashboardMetric[];
  searchedTopics: SearchedTopic[];
  searchedTopicsYMax: number;
  searchedTopicsYTicks: number[];
  contentDistribution: ContentDistributionSegment[];
  missingInfoItems: DashboardMissingInfoItem[];
  missingInfoPendingCount: number;
  recentArticles: DashboardRecentArticle[];
};

const DONUT_COLORS = ["#22d3ee", "#f97316", "#22c55e", "#ffd500", "#a855f7", "#3b82f6"];

const CATEGORY_COLORS: Record<string, AdminBadgeColor> = {
  hr: "blue",
  tools: "orange",
  policies: "green",
  benefits: "blue",
  growth: "purple",
  culture: "yellow",
  onboarding: "blue",
};

const MISSING_TYPE_LABELS: Record<string, string> = {
  MISSING_ARTICLE: "Missing article",
  OUTDATED_INFORMATION: "Outdated info",
  INCORRECT_INFORMATION: "Incorrect info",
  OUTDATED_INFO: "Outdated info",
  WRONG_INFO: "Wrong info",
  OTHER: "Other",
};

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

function formatTimeAgo(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "Recently";

  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function categoryColorFromName(name: string): AdminBadgeColor {
  const key = name.trim().toLowerCase();
  if (CATEGORY_COLORS[key]) return CATEGORY_COLORS[key];
  const slug = key.replace(/\s+/g, "-");
  if (CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug];
  return "gray";
}

function missingTypeToCategory(type: string): { label: string; color: AdminBadgeColor } {
  const label = MISSING_TYPE_LABELS[type] ?? type.replace(/_/g, " ").toLowerCase();
  if (type.includes("ARTICLE")) return { label, color: "orange" };
  if (type.includes("INCORRECT") || type.includes("WRONG")) return { label, color: "red" };
  if (type.includes("OUTDATED")) return { label, color: "yellow" };
  return { label, color: "gray" };
}

function niceChartMax(maxValue: number): number {
  if (maxValue <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(maxValue));
  const normalized = maxValue / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function buildYTicks(yMax: number): number[] {
  const step = yMax / 4;
  return [0, step, step * 2, step * 3, yMax].map((v) => Math.round(v));
}

export function mapOverviewToMetrics(overview: AnalyticsOverview): DashboardMetric[] {
  return [
    {
      id: "total-searches",
      icon: TrendingUp,
      value: formatCount(overview.totalSearches),
      label: "Total Searches",
      iconTone: "cyan",
    },
    {
      id: "active-users",
      icon: Users,
      value: formatCount(overview.totalUsers),
      label: "Active Users",
      iconTone: "green",
    },
    {
      id: "articles",
      icon: FileText,
      value: formatCount(overview.totalArticles),
      label: "Articles",
      iconTone: "yellow",
    },
    {
      id: "missing-info",
      icon: AlertCircle,
      value: formatCount(overview.openMissingInfoReports),
      label: "Open Missing Info",
      iconTone: "red",
      showNotificationDot: overview.openMissingInfoReports > 0,
    },
  ];
}

export function mapPopularQuestionsToTopics(questions: PopularQuestion[]): {
  topics: SearchedTopic[];
  yMax: number;
  yTicks: number[];
} {
  const topics: SearchedTopic[] = questions.slice(0, 5).map((q) => ({
    label: truncateLabel(q.query, 14),
    value: q.count,
  }));

  const maxValue = topics.length ? Math.max(...topics.map((t) => t.value)) : 0;
  const yMax = niceChartMax(maxValue);
  const yTicks = buildYTicks(yMax);

  return { topics, yMax, yTicks };
}

function truncateLabel(text: string, maxLen: number): string {
  const t = text.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1)}…`;
}

export function mapArticlesToDistribution(articles: ApiArticle[]): ContentDistributionSegment[] {
  const counts = new Map<string, number>();

  for (const article of articles) {
    const name = article.category?.name ?? "Uncategorized";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  if (counts.size === 0) return [];

  const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
  const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

  return sorted.slice(0, 6).map(([label, count], index) => ({
    label,
    value: Math.round((count / total) * 100),
    color: DONUT_COLORS[index % DONUT_COLORS.length],
  }));
}

export function mapMissingInfoReports(
  analytics: MissingInfoAnalytics,
  limit = 3,
): { items: DashboardMissingInfoItem[]; pendingCount: number } {
  const pendingCount = analytics.openMissingInfoReports;

  const items = analytics.recentMissingInfoReports
    .filter((r) => r.status === "OPEN" || r.status === "REVIEWED")
    .slice(0, limit)
    .map((report) => {
      const { label, color } = missingTypeToCategory(report.type);
      return {
        id: report.id,
        title: report.title?.trim() || report.description.slice(0, 60) || "Untitled request",
        category: label,
        categoryColor: color,
        timeAgo: formatTimeAgo(report.createdAt),
        requestCount: 1,
      };
    });

  return { items, pendingCount };
}

export function mapRecentArticles(articles: ApiArticle[], limit = 3): DashboardRecentArticle[] {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return sorted.slice(0, limit).map((article) => ({
    id: article.id,
    title: article.title,
    category: article.category?.name ?? "General",
    categoryColor: categoryColorFromName(article.category?.name ?? ""),
    updatedAgo: formatTimeAgo(article.updatedAt),
    views: 0,
  }));
}

export async function fetchDashboardData(): Promise<DashboardViewModel> {
  const [overview, popularQuestions, missingInfo, articles] = await Promise.all([
    apiGet<AnalyticsOverview>(endpoints.analytics.overview),
    apiGet<PopularQuestion[]>(endpoints.analytics.popularQuestions, {
      query: { limit: 5 },
    }),
    apiGet<MissingInfoAnalytics>(endpoints.analytics.missingInfo, {
      query: { limit: 10 },
    }),
    apiGet<ApiArticle[]>(endpoints.articles.list),
  ]);

  const { topics, yMax, yTicks } = mapPopularQuestionsToTopics(
    Array.isArray(popularQuestions) ? popularQuestions : [],
  );

  const { items: missingInfoItems, pendingCount } = mapMissingInfoReports(missingInfo);

  return {
    metrics: mapOverviewToMetrics(overview),
    searchedTopics: topics,
    searchedTopicsYMax: yMax,
    searchedTopicsYTicks: yTicks,
    contentDistribution: mapArticlesToDistribution(
      Array.isArray(articles) ? articles : [],
    ),
    missingInfoItems,
    missingInfoPendingCount: pendingCount,
    recentArticles: mapRecentArticles(Array.isArray(articles) ? articles : []),
  };
}
