import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  endpoints,
  unwrapListData,
} from "@/lib/api";
import { ApiError } from "@/lib/api";

export type FeedbackRating = "Helpful" | "Not helpful" | "Incorrect" | "Confusing";

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

function buildFeedbackMessage(
  rating: FeedbackRating,
  message: string,
  articleSlug?: string | null,
): string {
  const parts = [`[${rating}]`];
  const trimmed = message.trim();
  if (trimmed) parts.push(trimmed);
  if (articleSlug?.trim()) parts.push(`(article: ${articleSlug.trim()})`);
  return parts.join(" ");
}

export async function submitPlaybookFeedback(input: {
  rating: FeedbackRating;
  message?: string;
  articleId?: string | null;
  articleSlug?: string | null;
}): Promise<void> {
  const body = {
    type: input.articleId ? "ARTICLE" : "GENERAL",
    message: buildFeedbackMessage(
      input.rating,
      input.message ?? "",
      input.articleSlug,
    ),
    articleId: input.articleId ?? null,
  };

  try {
    await apiPost<unknown>(endpoints.feedback.list, body);
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(err.message);
    }
    throw err;
  }
}
