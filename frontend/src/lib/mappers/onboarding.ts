import { apiDelete, apiGet, apiPost, apiPut, endpoints } from "@/lib/api";
import { unwrapEntityData, unwrapListData } from "@/lib/api/unwrap";
import type { OnboardingStep } from "@/data/adminMockData";

export type ApiArticleSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type ApiOnboardingStep = {
  id: string;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  articleId: string | null;
  article?: ApiArticleSummary | null;
  articles?: ApiArticleSummary[];
  createdAt: string;
  updatedAt: string;
};

export type OnboardingWritePayload = {
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  articleId?: string | null;
  articleIds?: string[];
};

export type AdminOnboardingStep = OnboardingStep & {
  content: string;
  articleId: string | null;
  articleIds: string[];
  linkedArticleCount: number;
  unpublishedLinkedCount: number;
};

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

function collectArticles(step: ApiOnboardingStep): ApiArticleSummary[] {
  const seen = new Set<string>();
  const list: ApiArticleSummary[] = [];

  for (const article of step.articles ?? []) {
    if (!seen.has(article.id)) {
      seen.add(article.id);
      list.push(article);
    }
  }

  if (step.article && !seen.has(step.article.id)) {
    list.unshift(step.article);
  }

  return list;
}

function formatLinkedArticlesLabel(articles: ApiArticleSummary[]): string {
  if (articles.length === 0) return "—";
  if (articles.length === 1) return articles[0].title;
  return `${articles[0].title} +${articles.length - 1} more`;
}

export function mapApiOnboardingStepToAdmin(step: ApiOnboardingStep): AdminOnboardingStep {
  const articles = collectArticles(step);
  const articleIds = articles.map((a) => a.id);

  return {
    id: step.id,
    title: step.title,
    order: step.order,
    status: step.isActive ? "Active" : "Inactive",
    linkedArticle: formatLinkedArticlesLabel(articles),
    updatedAt: formatTimeAgo(step.updatedAt),
    content: step.content,
    articleId: step.articleId ?? articleIds[0] ?? null,
    articleIds,
    linkedArticleCount: articles.length,
    unpublishedLinkedCount: articles.filter((a) => a.status !== "PUBLISHED").length,
  };
}

export function statusToIsActive(status: "Active" | "Inactive"): boolean {
  return status === "Active";
}

export async function fetchAdminOnboardingSteps(): Promise<AdminOnboardingStep[]> {
  const raw = await apiGet<unknown>(endpoints.onboarding.list, {
    query: { includeInactive: true },
  });
  const steps = unwrapListData<ApiOnboardingStep>(raw);
  return steps.map(mapApiOnboardingStepToAdmin);
}

export async function createOnboardingStep(
  payload: OnboardingWritePayload,
): Promise<AdminOnboardingStep> {
  const raw = await apiPost<unknown>(endpoints.onboarding.list, payload);
  const step = unwrapEntityData<ApiOnboardingStep>(raw);
  return mapApiOnboardingStepToAdmin(step);
}

export async function updateOnboardingStep(
  id: string,
  payload: Partial<OnboardingWritePayload>,
): Promise<AdminOnboardingStep> {
  const raw = await apiPut<unknown>(endpoints.onboarding.byId(id), payload);
  const step = unwrapEntityData<ApiOnboardingStep>(raw);
  return mapApiOnboardingStepToAdmin(step);
}

export async function deleteOnboardingStep(id: string): Promise<void> {
  await apiDelete<{ message?: string }>(endpoints.onboarding.byId(id));
}
