import type { DashboardMetric } from "@/data/adminMockData";
import type {
  DocumentInsightItem,
  DocumentRecentEdit,
} from "@/data/adminMockData";
import type { AdminDocument } from "@/data/adminMockData";
import type { AdminMissingInfoRequest } from "@/lib/mappers/missingInfo";
import type { ApiArticle } from "@/lib/mappers/articles";
import { FileCheck, FilePenLine, FileText, FolderOpen } from "lucide-react";

export type DocumentInsightsViewModel = {
  contentHealth: { score: number; label: string };
  mostViewed: {
    title: string;
    meta: string;
    accent: "yellow" | "cyan" | "green" | "orange" | "purple";
  };
  mostRequestedMissing: {
    title: string;
    meta: string;
    accent: "yellow" | "cyan" | "green" | "orange" | "purple";
  };
  recentEdits: DocumentRecentEdit[];
  aiSuggestions: DocumentInsightItem[];
  missingContentQueue: DocumentInsightItem[];
};

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
  if (weeks < 8) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function buildDocumentStatsMetrics(
  articles: AdminDocument[],
  categoryCount: number,
): DashboardMetric[] {
  const total = articles.length;
  const published = articles.filter((a) => a.status === "Published").length;
  const drafts = articles.filter((a) => a.status === "Draft").length;
  const archived = articles.filter((a) => a.status === "Archived").length;

  void archived;

  return [
    {
      id: "doc-total",
      icon: FileText,
      value: String(total),
      label: "Total Articles",
      iconTone: "yellow",
    },
    {
      id: "doc-published",
      icon: FileCheck,
      value: String(published),
      label: "Published",
      iconTone: "green",
    },
    {
      id: "doc-drafts",
      icon: FilePenLine,
      value: String(drafts),
      label: "Drafts",
      iconTone: "orange",
    },
    {
      id: "doc-categories",
      icon: FolderOpen,
      value: String(categoryCount),
      label: "Categories",
      iconTone: "cyan",
    },
  ];
}

function computeContentHealthScore(
  articles: AdminDocument[],
  missingRequests: AdminMissingInfoRequest[],
): number {
  if (articles.length === 0) return 0;

  const published = articles.filter((a) => a.status === "Published").length;
  const publishedRatio = published / articles.length;

  const thinContent = articles.filter(
    (a) =>
      a.status === "Published" &&
      (!a.summary?.trim() || !a.content?.trim() || a.content.trim().length < 40),
  ).length;

  const openMissing = missingRequests.filter((r) => r.status === "Open").length;

  const publishedScore = publishedRatio * 55;
  const freshnessScore = Math.max(0, 25 - thinContent * 5);
  const requestsScore = Math.max(0, 20 - openMissing * 4);

  return Math.max(0, Math.min(100, Math.round(publishedScore + freshnessScore + requestsScore)));
}

export function buildDocumentInsights(
  articles: AdminDocument[],
  missingRequests: AdminMissingInfoRequest[],
  apiArticles?: ApiArticle[],
): DocumentInsightsViewModel {
  const score = computeContentHealthScore(articles, missingRequests);

  const withViews = articles.filter((a) => a.views > 0);
  const topViewed = withViews.length
    ? [...withViews].sort((a, b) => b.views - a.views)[0]
    : null;

  const topMissing = [...missingRequests].sort(
    (a, b) => b.requestCount - a.requestCount,
  )[0];

  const recentSource = apiArticles?.length
    ? [...apiArticles].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    : [];

  const recentEdits: DocumentRecentEdit[] = recentSource.slice(0, 3).map((article) => ({
    id: article.id,
    title: article.title,
    editor:
      article.author?.fullName?.trim() ||
      article.author?.email ||
      "Unknown author",
    timeAgo: formatTimeAgo(article.updatedAt),
  }));

  const openMissing = missingRequests
    .filter((r) => r.status === "Open")
    .sort((a, b) => b.requestCount - a.requestCount);

  const missingContentQueue: DocumentInsightItem[] = openMissing.slice(0, 3).map((r) => ({
    id: r.id,
    label: r.title,
    value: `${r.requestCount} open`,
    meta: r.type,
    accent: "orange" as const,
  }));

  const aiSuggestions: DocumentInsightItem[] =
    openMissing.length > 0
      ? openMissing.slice(0, 2).map((r) => ({
          id: `suggest-${r.id}`,
          label: `Review missing topic: ${r.title}`,
          value: `${r.requestCount} requests`,
          meta: "From employee reports",
          accent: "purple" as const,
        }))
      : [
          {
            id: "ai-placeholder",
            label: "AI suggestions",
            value: "Coming in Phase 12",
            meta: "After AI search integration",
            accent: "purple" as const,
          },
        ];

  return {
    contentHealth: { score, label: "Content Health" },
    mostViewed: topViewed
      ? {
          title: topViewed.title,
          meta: `${topViewed.views} views · ${topViewed.category}`,
          accent: "yellow",
        }
      : {
          title: "Not enough view data yet",
          meta: "View tracking is not available",
          accent: "yellow",
        },
    mostRequestedMissing: topMissing
      ? {
          title: topMissing.title,
          meta: `${topMissing.requestCount} requests · ${topMissing.status}`,
          accent: "orange",
        }
      : {
          title: "No missing topics reported",
          meta: "All clear for now",
          accent: "green",
        },
    recentEdits,
    aiSuggestions,
    missingContentQueue,
  };
}
