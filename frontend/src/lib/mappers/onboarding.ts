import { apiDelete, apiGet, apiPost, apiPut, endpoints } from "@/lib/api";
import { unwrapEntityData, unwrapListData } from "@/lib/api/unwrap";
import type { OnboardingStep } from "@/data/adminMockData";

export type ApiOnboardingStep = {
  id: string;
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  articleId: string | null;
  article?: {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type OnboardingWritePayload = {
  title: string;
  content: string;
  order: number;
  isActive: boolean;
  articleId?: string | null;
};

export type AdminOnboardingStep = OnboardingStep & {
  content: string;
  articleId: string | null;
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

export function mapApiOnboardingStepToAdmin(step: ApiOnboardingStep): AdminOnboardingStep {
  return {
    id: step.id,
    title: step.title,
    order: step.order,
    status: step.isActive ? "Active" : "Inactive",
    linkedArticle: step.article?.title ?? "—",
    updatedAt: formatTimeAgo(step.updatedAt),
    content: step.content,
    articleId: step.articleId,
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
