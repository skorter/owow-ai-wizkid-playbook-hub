import { apiGet, apiPost } from "./client";

export type AIProvider = "openai" | "fallback";

export type AIStatusResponse = {
  configured: boolean;
  provider: AIProvider;
  model: string;
  embeddingModel?: string;
  maxSources?: number;
  minScore?: number;
};

export type AISource = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  category?: string;
  score?: number;
};

export type AISearchResponse = {
  answer: string;
  sources: AISource[];
  confidence: number;
  provider: AIProvider;
  fallback: boolean;
};

export type AskPageAIRequest = {
  question: string;
  articleId?: string;
  slug?: string;
};

export type AskPageAIResponse = {
  answer: string;
  provider: AIProvider;
  fallback: boolean;
};

const AI_STATUS_PATH = "/api/ai/status";
const AI_SEARCH_PATH = "/api/ai/search";
const AI_ASK_PAGE_PATH = "/api/ai/ask-page";

function unwrapStatus(body: unknown): AIStatusResponse {
  if (body && typeof body === "object" && "configured" in body) {
    return body as AIStatusResponse;
  }
  throw new Error("Invalid AI status response");
}

function unwrapSearch(body: unknown): AISearchResponse {
  if (body && typeof body === "object" && "answer" in body) {
    return body as AISearchResponse;
  }
  throw new Error("Invalid AI search response");
}

export async function getAIStatus(): Promise<AIStatusResponse> {
  const body = await apiGet<unknown>(AI_STATUS_PATH);
  return unwrapStatus(body);
}

export async function aiSearch(question: string): Promise<AISearchResponse> {
  const body = await apiPost<unknown>(AI_SEARCH_PATH, { question: question.trim() });
  return unwrapSearch(body);
}

export async function askPageAI(
  payload: AskPageAIRequest,
): Promise<AskPageAIResponse> {
  const body = await apiPost<unknown>(AI_ASK_PAGE_PATH, payload);
  if (body && typeof body === "object" && "answer" in body) {
    return body as AskPageAIResponse;
  }
  throw new Error("Invalid ask-page AI response");
}
