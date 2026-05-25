import { apiDelete, apiGet, apiPost, apiPut, endpoints } from "@/lib/api";
import type { AdminDocument, DocumentStatus } from "@/data/adminMockData";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";

export type BackendArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type ApiArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  status: BackendArticleStatus;
  tags?: string[];
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string };
  author?: { id: string; fullName: string | null; email: string } | null;
};

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ArticleCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminArticlesQuery = {
  status?: BackendArticleStatus;
  category?: string;
  search?: string;
};

export type ArticleWritePayload = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  categoryId: string;
  status: BackendArticleStatus;
};

const CATEGORY_COLORS: Record<string, AdminBadgeColor> = {
  hr: "blue",
  tools: "orange",
  policies: "green",
  benefits: "blue",
  growth: "purple",
  culture: "yellow",
  onboarding: "blue",
};

function categoryBadgeColor(slug: string, name: string): AdminBadgeColor {
  const key = slug.toLowerCase() || name.toLowerCase();
  return CATEGORY_COLORS[key] ?? "blue";
}

function formatTimeAgo(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 14) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  const diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 8) return `${diffWeek} week${diffWeek === 1 ? "" : "s"} ago`;
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function apiStatusToDocumentStatus(status: BackendArticleStatus): DocumentStatus {
  if (status === "PUBLISHED") return "Published";
  if (status === "ARCHIVED") return "Archived";
  return "Draft";
}

export function documentStatusToApiStatus(status: DocumentStatus): BackendArticleStatus {
  if (status === "Published") return "PUBLISHED";
  if (status === "Archived") return "ARCHIVED";
  return "DRAFT";
}

function documentStatusColor(status: DocumentStatus): AdminBadgeColor {
  if (status === "Published") return "green";
  if (status === "Draft") return "orange";
  return "gray";
}

export function mapApiArticleToAdminDocument(article: ApiArticle): AdminDocument {
  const status = apiStatusToDocumentStatus(article.status);
  const categoryName = article.category?.name ?? "Uncategorized";

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    category: categoryName,
    categoryId: article.category?.id ?? article.categoryId ?? "",
    categoryColor: categoryBadgeColor(
      article.category?.slug ?? "",
      categoryName,
    ),
    status,
    statusColor: documentStatusColor(status),
    updatedAt: formatTimeAgo(article.updatedAt),
    views: 0,
    author:
      article.author?.fullName?.trim() ||
      article.author?.email ||
      "Unknown author",
    summary: article.summary ?? "",
    content: article.content,
    feedbackCount: 0,
  };
}

export async function fetchAdminArticles(
  query: AdminArticlesQuery = {},
): Promise<AdminDocument[]> {
  const params: Record<string, string> = {};
  if (query.status) params.status = query.status;
  if (query.category?.trim()) params.category = query.category.trim();
  if (query.search?.trim()) params.search = query.search.trim();

  const articles = await apiGet<ApiArticle[]>(endpoints.articles.adminAll, {
    query: params,
  });

  return articles.map(mapApiArticleToAdminDocument);
}

export async function fetchArticleCategories(): Promise<ArticleCategoryOption[]> {
  const categories = await apiGet<ApiCategory[]>(endpoints.categories.list);
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export async function createArticle(payload: ArticleWritePayload): Promise<AdminDocument> {
  const article = await apiPost<ApiArticle>(endpoints.articles.list, payload);
  return mapApiArticleToAdminDocument(article);
}

export async function updateArticle(
  id: string,
  payload: Partial<ArticleWritePayload>,
): Promise<AdminDocument> {
  const article = await apiPut<ApiArticle>(endpoints.articles.byId(id), payload);
  return mapApiArticleToAdminDocument(article);
}

export async function deleteArticle(id: string): Promise<void> {
  await apiDelete<{ message?: string }>(endpoints.articles.byId(id));
}

export function buildCategoryFilterOptions(
  categories: ArticleCategoryOption[],
): string[] {
  return ["All categories", ...categories.map((c) => c.name)];
}

export function resolveCategoryFilterParam(
  filterLabel: string,
  categories: ArticleCategoryOption[],
): string | undefined {
  if (filterLabel === "All categories") return undefined;
  const match = categories.find((c) => c.name === filterLabel);
  return match?.slug ?? filterLabel;
}
