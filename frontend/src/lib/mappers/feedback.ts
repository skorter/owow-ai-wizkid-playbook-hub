import { apiDelete, apiGet, apiPut, endpoints } from "@/lib/api";

export type ApiFeedback = {
  id: string;
  type: string;
  message: string;
  articleId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  article?: { id: string; title: string; slug: string } | null;
  user?: { id: string; name: string | null; email: string; role: string } | null;
};

const FEEDBACK_TYPE_LABELS: Record<string, string> = {
  GENERAL: "General",
  ARTICLE: "Article",
  AI_RESPONSE: "AI response",
};

function unwrapListData<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body;
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    Array.isArray((body as { data: unknown }).data)
  ) {
    return (body as { data: T[] }).data;
  }
  return [];
}

export function formatFeedbackType(type: string): string {
  return FEEDBACK_TYPE_LABELS[type] ?? type.replace(/_/g, " ").toLowerCase();
}

export async function fetchFeedbackItems(): Promise<ApiFeedback[]> {
  const body = await apiGet<unknown>(endpoints.feedback.list);
  return unwrapListData<ApiFeedback>(body);
}

export async function updateFeedback(
  id: string,
  payload: Partial<Pick<ApiFeedback, "type" | "message" | "articleId">>,
): Promise<ApiFeedback> {
  const body = await apiPut<unknown>(endpoints.feedback.byId(id), payload);
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: ApiFeedback }).data;
  }
  return body as ApiFeedback;
}

export async function deleteFeedback(id: string): Promise<void> {
  await apiDelete<unknown>(endpoints.feedback.byId(id));
}
