import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  Timer,
  AlertTriangle,
} from "lucide-react";
import type { MetricIconTone, MetricTrend } from "@/components/admin/AdminMetricCard/AdminMetricCard";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";

export type DashboardMetric = {
  id: string;
  icon: LucideIcon;
  value: string | number;
  label: string;
  trend?: MetricTrend;
  iconTone?: MetricIconTone;
  showNotificationDot?: boolean;
};

export type SearchedTopic = {
  label: string;
  value: number;
};

export type ContentDistributionSegment = {
  label: string;
  value: number;
  color: string;
};

export type DashboardMissingInfoItem = {
  id: string;
  title: string;
  category: string;
  categoryColor: AdminBadgeColor;
  timeAgo: string;
  requestCount: number;
};

export type DashboardRecentArticle = {
  id: string;
  title: string;
  category: string;
  categoryColor: AdminBadgeColor;
  updatedAgo: string;
  views: number;
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "total-searches",
    icon: TrendingUp,
    value: "1,247",
    label: "Total Searches",
    trend: { value: "+12%", direction: "up" },
    iconTone: "cyan",
  },
  {
    id: "active-users",
    icon: Users,
    value: "89",
    label: "Active Users",
    trend: { value: "+5%", direction: "up" },
    iconTone: "green",
  },
  {
    id: "articles",
    icon: FileText,
    value: "124",
    label: "Articles",
    trend: { value: "+3", direction: "up" },
    iconTone: "yellow",
  },
  {
    id: "missing-info",
    icon: AlertCircle,
    value: "26",
    label: "Missing Info",
    iconTone: "red",
    showNotificationDot: true,
  },
];

export const searchedTopics: SearchedTopic[] = [
  { label: "Time Off", value: 124 },
  { label: "Tools", value: 98 },
  { label: "Benefits", value: 76 },
  { label: "Onboarding", value: 65 },
  { label: "Policies", value: 54 },
];

export const SEARCHED_TOPICS_Y_MAX = 140;
export const SEARCHED_TOPICS_Y_TICKS = [0, 35, 70, 105, 140];

export const contentDistributionSegments: ContentDistributionSegment[] = [
  { label: "HR", value: 35, color: "#22d3ee" },
  { label: "Tools", value: 25, color: "#f97316" },
  { label: "Policies", value: 20, color: "#22c55e" },
  { label: "Culture", value: 20, color: "#ffd500" },
];

export const dashboardMissingInfo: DashboardMissingInfoItem[] = [
  {
    id: "mi-1",
    title: "Parental leave policy",
    category: "HR",
    categoryColor: "blue",
    timeAgo: "2 days ago",
    requestCount: 12,
  },
  {
    id: "mi-2",
    title: "Remote work equipment",
    category: "Tools",
    categoryColor: "orange",
    timeAgo: "3 days ago",
    requestCount: 8,
  },
  {
    id: "mi-3",
    title: "Professional development budget",
    category: "Growth",
    categoryColor: "purple",
    timeAgo: "1 week ago",
    requestCount: 6,
  },
];

export const dashboardRecentArticles: DashboardRecentArticle[] = [
  {
    id: "ra-1",
    title: "Time Off Policy",
    category: "HR",
    categoryColor: "blue",
    updatedAgo: "2 days ago",
    views: 245,
  },
  {
    id: "ra-2",
    title: "Simplicate Guide",
    category: "Tools",
    categoryColor: "orange",
    updatedAgo: "1 week ago",
    views: 189,
  },
  {
    id: "ra-3",
    title: "Remote Work Policy",
    category: "Policies",
    categoryColor: "green",
    updatedAgo: "2 weeks ago",
    views: 156,
  },
];

export const missingInfoPendingCount = 3;

// ——— Analytics page ———

export type AnalyticsMetric = DashboardMetric;

export type UsageTrendPoint = {
  label: string;
  searches: number;
  activeUsers: number;
};

export type PeakHourPoint = {
  label: string;
  value: number;
  showLabel?: boolean;
};

export type AnalyticsUnansweredQuestion = {
  id: string;
  question: string;
  category: string;
  categoryColor: AdminBadgeColor;
  failedAttempts: number;
};

export type PerformanceCard = {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  accent: "green" | "cyan" | "purple";
};

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    id: "search-success",
    icon: TrendingUp,
    value: "87%",
    label: "Avg Search Success",
    iconTone: "green",
  },
  {
    id: "response-time",
    icon: Timer,
    value: "1.2s",
    label: "Avg Response Time",
    iconTone: "cyan",
  },
  {
    id: "daily-users",
    icon: Users,
    value: "42",
    label: "Daily Active Users",
    iconTone: "yellow",
  },
  {
    id: "unanswered",
    icon: AlertTriangle,
    value: "18",
    label: "Unanswered",
    iconTone: "orange",
  },
];

export const usageTrendsData: UsageTrendPoint[] = [
  { label: "Apr 29", searches: 45, activeUsers: 28 },
  { label: "Apr 30", searches: 52, activeUsers: 31 },
  { label: "May 1", searches: 48, activeUsers: 29 },
  { label: "May 2", searches: 61, activeUsers: 35 },
  { label: "May 3", searches: 55, activeUsers: 33 },
  { label: "May 4", searches: 68, activeUsers: 38 },
  { label: "May 5", searches: 72, activeUsers: 42 },
];

export const USAGE_TRENDS_Y_MAX = 80;
export const USAGE_TRENDS_Y_TICKS = [0, 20, 40, 60, 80];

export const peakHoursChartData: PeakHourPoint[] = [
  { label: "10 AM", value: 45, showLabel: true },
  { label: "11 AM", value: 62, showLabel: false },
  { label: "12 PM", value: 78, showLabel: true },
  { label: "1 PM", value: 35, showLabel: false },
  { label: "2 PM", value: 28, showLabel: true },
  { label: "3 PM", value: 72, showLabel: false },
  { label: "4 PM", value: 58, showLabel: true },
];

export const PEAK_HOURS_Y_MAX = 80;
export const PEAK_HOURS_Y_TICKS = [0, 20, 40, 60, 80];

export const analyticsUnansweredQuestions: AnalyticsUnansweredQuestion[] = [
  {
    id: "auq-1",
    question: "What's the parental leave duration?",
    category: "HR",
    categoryColor: "blue",
    failedAttempts: 8,
  },
  {
    id: "auq-2",
    question: "How to set up VPN access?",
    category: "Tools",
    categoryColor: "orange",
    failedAttempts: 6,
  },
  {
    id: "auq-3",
    question: "Annual bonus structure?",
    category: "Benefits",
    categoryColor: "green",
    failedAttempts: 5,
  },
  {
    id: "auq-4",
    question: "Conference attendance policy?",
    category: "Growth",
    categoryColor: "purple",
    failedAttempts: 4,
  },
];

export const performanceCards: PerformanceCard[] = [
  {
    id: "perf-top",
    title: "Top Performing",
    subtitle: "HR & People category",
    value: "+24%",
    accent: "green",
  },
  {
    id: "perf-growing",
    title: "Fastest Growing",
    subtitle: "Onboarding completion",
    value: "76%",
    accent: "cyan",
  },
  {
    id: "perf-satisfaction",
    title: "User Satisfaction",
    subtitle: "Positive feedback rate",
    value: "91%",
    accent: "purple",
  },
];
