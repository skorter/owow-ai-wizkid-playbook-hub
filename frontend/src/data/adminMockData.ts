import type { LucideIcon } from "lucide-react";
import { TrendingUp, Users, FileText, AlertCircle } from "lucide-react";
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
