import type { LucideIcon } from "lucide-react";
import {
  TrendingUp,
  Users,
  FileText,
  AlertCircle,
  Timer,
  AlertTriangle,
  FileCheck,
  FilePenLine,
  FolderOpen,
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

// ——— Documents / Content Management hub ———

export type DocumentStatus = "Published" | "Draft" | "Archived";

export type ManagementTabId =
  | "articles"
  | "categories"
  | "onboarding"
  | "missing"
  | "drafts"
  | "archived";

export type AdminDocument = {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryId?: string;
  categoryColor: AdminBadgeColor;
  status: DocumentStatus;
  statusColor: AdminBadgeColor;
  updatedAt: string;
  views: number;
  author: string;
  summary: string;
  content: string;
  feedbackCount: number;
  linkedOnboardingStep?: string;
  relatedMissingRequests?: string[];
};

export type ContentCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
  color: AdminBadgeColor;
  accentHex: string;
  status: "Active" | "Inactive";
};

export type OnboardingStep = {
  id: string;
  title: string;
  order: number;
  status: "Active" | "Inactive";
  linkedArticle: string;
  updatedAt: string;
};

export type MissingRequestStatus = "Open" | "Reviewed" | "Resolved";

export type MissingInfoRequest = {
  id: string;
  title: string;
  type: string;
  status: MissingRequestStatus;
  requestCount: number;
  lastRequested: string;
  linkedArticle?: string;
};

export const managementTabs: { id: ManagementTabId; label: string }[] = [
  { id: "articles", label: "Articles" },
  { id: "categories", label: "Categories" },
  { id: "onboarding", label: "Onboarding" },
  { id: "missing", label: "Missing Requests" },
  { id: "drafts", label: "Drafts" },
  { id: "archived", label: "Archived" },
];

export const categoryColorOptions: { value: AdminBadgeColor; hex: string; label: string }[] = [
  { value: "yellow", hex: "#ffd500", label: "Yellow" },
  { value: "blue", hex: "#22d3ee", label: "Cyan" },
  { value: "green", hex: "#22c55e", label: "Green" },
  { value: "orange", hex: "#f97316", label: "Orange" },
  { value: "purple", hex: "#a855f7", label: "Purple" },
  { value: "blue", hex: "#3b82f6", label: "Blue" },
];

export type DocumentInsightItem = {
  id: string;
  label: string;
  value: string;
  meta?: string;
  accent: "yellow" | "cyan" | "green" | "orange" | "purple";
};

export type DocumentRecentEdit = {
  id: string;
  title: string;
  editor: string;
  timeAgo: string;
};

export const documentStats: DashboardMetric[] = [
  {
    id: "doc-total",
    icon: FileText,
    value: "124",
    label: "Total Articles",
    trend: { value: "+6", direction: "up" },
    iconTone: "yellow",
  },
  {
    id: "doc-published",
    icon: FileCheck,
    value: "98",
    label: "Published",
    trend: { value: "+4", direction: "up" },
    iconTone: "green",
  },
  {
    id: "doc-drafts",
    icon: FilePenLine,
    value: "18",
    label: "Drafts",
    trend: { value: "+2", direction: "up" },
    iconTone: "orange",
  },
  {
    id: "doc-categories",
    icon: FolderOpen,
    value: "12",
    label: "Categories",
    trend: { value: "+1", direction: "up" },
    iconTone: "cyan",
  },
];

export const documentFilterCategories = [
  "All categories",
  "HR",
  "Tools",
  "Policies",
  "Benefits",
  "Growth",
];

export const documentFilterStatuses = ["All statuses", "Published", "Draft", "Archived"];

export const documentSortOptions = ["Recently updated", "Most viewed", "Title A–Z", "Newest first"];

export const documentsList: AdminDocument[] = [
  {
    id: "doc-1",
    title: "Time Off Policy",
    slug: "time-off-policy",
    category: "HR",
    categoryColor: "blue",
    status: "Published",
    statusColor: "green",
    updatedAt: "2 days ago",
    views: 245,
    author: "Sarah van Berg",
    summary: "Company-wide time off, vacation, and sick leave guidelines for all employees.",
    content:
      "Employees are entitled to 25 vacation days per year. Sick leave must be reported before 9:00 AM. Carry-over rules apply for unused days above 5.",
    feedbackCount: 12,
    linkedOnboardingStep: "Read company policies",
    relatedMissingRequests: ["Parental leave duration"],
  },
  {
    id: "doc-2",
    title: "Remote Work Policy",
    slug: "remote-work-policy",
    category: "Policies",
    categoryColor: "green",
    status: "Published",
    statusColor: "green",
    updatedAt: "2 weeks ago",
    views: 156,
    author: "Mark de Vries",
    summary: "Guidelines for hybrid and remote work arrangements at OWOW.",
    content:
      "Remote work is available up to 3 days per week with manager approval. Core hours are 10:00–16:00 CET. Equipment requests go through IT.",
    feedbackCount: 8,
    relatedMissingRequests: ["Remote work equipment"],
  },
  {
    id: "doc-3",
    title: "Simplicate Guide",
    slug: "simplicate-guide",
    category: "Tools",
    categoryColor: "orange",
    status: "Published",
    statusColor: "green",
    updatedAt: "1 week ago",
    views: 189,
    author: "Lisa Jansen",
    summary: "Step-by-step setup for Simplicate CRM and time tracking.",
    content:
      "Log in via SSO. Connect your calendar. Log hours daily under Projects. Contact IT for license issues.",
    feedbackCount: 15,
    linkedOnboardingStep: "Complete Simplicate setup",
  },
  {
    id: "doc-4",
    title: "VPN Access Setup",
    slug: "vpn-access-setup",
    category: "Tools",
    categoryColor: "orange",
    status: "Draft",
    statusColor: "orange",
    updatedAt: "3 days ago",
    views: 42,
    author: "Tom Bakker",
    summary: "How to install and connect to the OWOW VPN for secure remote access.",
    content:
      "Download the OWOW VPN client. Import the configuration file from IT. Connect before accessing internal tools.",
    feedbackCount: 3,
    linkedOnboardingStep: "Setup your tools",
    relatedMissingRequests: ["VPN setup guide"],
  },
  {
    id: "doc-5",
    title: "Conference Attendance",
    slug: "conference-attendance",
    category: "Growth",
    categoryColor: "purple",
    status: "Draft",
    statusColor: "orange",
    updatedAt: "5 days ago",
    views: 28,
    author: "Emma Visser",
    summary: "Policy for conference budgets, approval, and expense reporting.",
    content:
      "Submit conference requests 6 weeks in advance. Budget cap is €1,500 per event. Share learnings within 2 weeks after return.",
    feedbackCount: 2,
    relatedMissingRequests: ["Conference attendance policy"],
  },
  {
    id: "doc-6",
    title: "Parental Leave Overview",
    slug: "parental-leave-overview",
    category: "HR",
    categoryColor: "blue",
    status: "Archived",
    statusColor: "gray",
    updatedAt: "1 month ago",
    views: 312,
    author: "Sarah van Berg",
    summary: "Legacy overview of parental leave — superseded by Time Off Policy.",
    content: "This article has been archived. Refer to Time Off Policy for current guidelines.",
    feedbackCount: 6,
  },
];

export const contentCategories: ContentCategory[] = [
  {
    id: "cat-hr",
    name: "HR",
    slug: "hr",
    description: "People operations, leave, and employee policies",
    articleCount: 24,
    color: "blue",
    accentHex: "#3b82f6",
    status: "Active",
  },
  {
    id: "cat-policies",
    name: "Policies",
    slug: "policies",
    description: "Company-wide rules and compliance documents",
    articleCount: 18,
    color: "green",
    accentHex: "#22c55e",
    status: "Active",
  },
  {
    id: "cat-tools",
    name: "Tools",
    slug: "tools",
    description: "Software guides and IT setup instructions",
    articleCount: 31,
    color: "orange",
    accentHex: "#f97316",
    status: "Active",
  },
  {
    id: "cat-growth",
    name: "Growth",
    slug: "growth",
    description: "Learning, conferences, and career development",
    articleCount: 12,
    color: "purple",
    accentHex: "#a855f7",
    status: "Active",
  },
  {
    id: "cat-culture",
    name: "Culture",
    slug: "culture",
    description: "Values, rituals, and team culture content",
    articleCount: 9,
    color: "yellow",
    accentHex: "#ffd500",
    status: "Active",
  },
  {
    id: "cat-onboarding",
    name: "Onboarding",
    slug: "onboarding",
    description: "New hire journeys and first-week resources",
    articleCount: 14,
    color: "blue",
    accentHex: "#22d3ee",
    status: "Active",
  },
];

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "ob-1",
    title: "Welcome to OWOW",
    order: 1,
    status: "Active",
    linkedArticle: "Welcome to OWOW",
    updatedAt: "1 week ago",
  },
  {
    id: "ob-2",
    title: "Setup your tools",
    order: 2,
    status: "Active",
    linkedArticle: "VPN Access Setup",
    updatedAt: "3 days ago",
  },
  {
    id: "ob-3",
    title: "Read company policies",
    order: 3,
    status: "Active",
    linkedArticle: "Time Off Policy",
    updatedAt: "2 days ago",
  },
  {
    id: "ob-4",
    title: "Complete Simplicate setup",
    order: 4,
    status: "Active",
    linkedArticle: "Simplicate Guide",
    updatedAt: "1 week ago",
  },
  {
    id: "ob-5",
    title: "First week checklist",
    order: 5,
    status: "Inactive",
    linkedArticle: "—",
    updatedAt: "2 weeks ago",
  },
];

export const missingInfoRequests: MissingInfoRequest[] = [
  {
    id: "mr-1",
    title: "Parental leave duration",
    type: "Policy gap",
    status: "Open",
    requestCount: 8,
    lastRequested: "2 hours ago",
  },
  {
    id: "mr-2",
    title: "Remote work equipment",
    type: "Benefits",
    status: "Open",
    requestCount: 6,
    lastRequested: "1 day ago",
  },
  {
    id: "mr-3",
    title: "Annual bonus structure",
    type: "Compensation",
    status: "Reviewed",
    requestCount: 5,
    lastRequested: "3 days ago",
  },
  {
    id: "mr-4",
    title: "Conference attendance policy",
    type: "Policy gap",
    status: "Reviewed",
    requestCount: 4,
    lastRequested: "4 days ago",
    linkedArticle: "Conference Attendance",
  },
  {
    id: "mr-5",
    title: "VPN setup guide",
    type: "Tools",
    status: "Resolved",
    requestCount: 12,
    lastRequested: "1 week ago",
    linkedArticle: "VPN Access Setup",
  },
];

export const documentInsights = {
  contentHealth: { score: 82, label: "Content Health" },
  mostViewed: {
    title: "Time Off Policy",
    meta: "245 views · HR",
    accent: "yellow" as const,
  },
  mostRequestedMissing: {
    title: "Parental leave duration",
    meta: "8 requests · Open",
    accent: "orange" as const,
  },
  recentEdits: [
    { id: "edit-1", title: "VPN Access Setup", editor: "Tom Bakker", timeAgo: "2 hours ago" },
    { id: "edit-2", title: "Time Off Policy", editor: "Sarah van Berg", timeAgo: "2 days ago" },
    { id: "edit-3", title: "Simplicate Guide", editor: "Lisa Jansen", timeAgo: "4 days ago" },
  ] satisfies DocumentRecentEdit[],
  aiSuggestions: [
    {
      id: "ai-1",
      label: "Expand VPN onboarding steps",
      value: "High impact",
      meta: "Based on 6 failed searches",
      accent: "purple" as const,
    },
    {
      id: "ai-2",
      label: "Add conference policy FAQ",
      value: "Recommended",
      meta: "Draft exists",
      accent: "green" as const,
    },
  ] satisfies DocumentInsightItem[],
  missingContentQueue: [
    {
      id: "miss-1",
      label: "Parental leave duration",
      value: "8 open",
      meta: "Needs article",
      accent: "orange" as const,
    },
    {
      id: "miss-2",
      label: "Remote work equipment",
      value: "6 open",
      meta: "In review",
      accent: "orange" as const,
    },
    {
      id: "miss-3",
      label: "Annual bonus structure",
      value: "5 open",
      meta: "High priority",
      accent: "orange" as const,
    },
  ] satisfies DocumentInsightItem[],
};
