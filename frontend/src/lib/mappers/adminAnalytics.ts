import { apiGet, endpoints } from "@/lib/api";
import type {
  AnalyticsMetric,
  AnalyticsUnansweredQuestion,
  PerformanceCard,
  PeakHourPoint,
  UsageTrendPoint,
} from "@/data/adminMockData";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";
import { AlertTriangle, Timer, TrendingUp, Users } from "lucide-react";
export type UsageTrendsAnalytics = {
  points: UsageTrendPoint[];
  yMax: number;
  yTicks: number[];
  days: number;
};

export type PeakHoursAnalytics = {
  points: PeakHourPoint[];
  yMax: number;
  yTicks: number[];
  insight: string;
};

export type PerformanceAnalytics = {
  successRatePercent: number;
  avgResponseTimeLabel: string | null;
  dailyActiveUsers: number;
  unansweredCount: number;
  cards: PerformanceCard[];
};

export type AnalyticsViewModel = {
  metrics: AnalyticsMetric[];
  usageTrends: UsageTrendPoint[];
  usageTrendsYMax: number;
  usageTrendsYTicks: number[];
  peakHours: PeakHourPoint[];
  peakHoursYMax: number;
  peakHoursYTicks: number[];
  peakInsight: string;
  unanswered: AnalyticsUnansweredQuestion[];
  performanceCards: PerformanceCard[];
};

const CATEGORY_COLORS: Record<string, AdminBadgeColor> = {
  search: "gray",
  hr: "blue",
  tools: "orange",
  policies: "green",
  benefits: "blue",
  growth: "purple",
};

function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function mapUnanswered(items: {
  id: string;
  question: string;
  category: string;
  failedAttempts: number;
}[]): AnalyticsUnansweredQuestion[] {
  return items.map((item) => {
    const categoryKey = item.category.trim().toLowerCase();
    return {
      id: item.id,
      question: item.question,
      category: item.category,
      categoryColor: CATEGORY_COLORS[categoryKey] ?? "gray",
      failedAttempts: item.failedAttempts,
    };
  });
}

function buildTopMetrics(performance: PerformanceAnalytics): AnalyticsMetric[] {
  const responseTime =
    performance.avgResponseTimeLabel && performance.avgResponseTimeLabel.trim().length > 0
      ? performance.avgResponseTimeLabel
      : "—";

  return [
    {
      id: "search-success",
      icon: TrendingUp,
      value: formatPercent(performance.successRatePercent),
      label: "Avg Search Success",
      iconTone: "green",
    },
    {
      id: "response-time",
      icon: Timer,
      value: responseTime,
      label: "Avg Response Time",
      iconTone: "cyan",
    },
    {
      id: "daily-users",
      icon: Users,
      value: String(performance.dailyActiveUsers),
      label: "Daily Active Users",
      iconTone: "yellow",
    },
    {
      id: "unanswered",
      icon: AlertTriangle,
      value: String(performance.unansweredCount),
      label: "Unanswered",
      iconTone: "orange",
    },
  ];
}

type UnansweredQuestionsResponse = {
  items: {
    id: string;
    question: string;
    category: string;
    failedAttempts: number;
  }[];
  count: number;
};

export async function fetchAnalyticsPageData(): Promise<AnalyticsViewModel> {
  const [usageTrends, peakHours, unanswered, performance] = await Promise.all([
    apiGet<UsageTrendsAnalytics>(endpoints.analytics.usageTrends, {
      query: { days: 7 },
    }),
    apiGet<PeakHoursAnalytics>(endpoints.analytics.peakHours),
    apiGet<UnansweredQuestionsResponse>(endpoints.analytics.unansweredQuestions, {
      query: { limit: 10 },
    }),
    apiGet<PerformanceAnalytics>(endpoints.analytics.performance),
  ]);

  return {
    metrics: buildTopMetrics(performance),
    usageTrends: usageTrends.points,
    usageTrendsYMax: usageTrends.yMax,
    usageTrendsYTicks: usageTrends.yTicks,
    peakHours: peakHours.points,
    peakHoursYMax: peakHours.yMax,
    peakHoursYTicks: peakHours.yTicks,
    peakInsight: peakHours.insight,
    unanswered: mapUnanswered(unanswered.items ?? []),
    performanceCards: performance.cards,
  };
}
