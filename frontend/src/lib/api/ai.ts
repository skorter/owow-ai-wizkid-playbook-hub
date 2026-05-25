import { apiGet, apiPost } from "./client";
import { endpoints } from "./endpoints";
import { getApiErrorMessage } from "./errors";

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

export type AskPageAISource = {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  category?: string;
};

export type AskPageAIRequest = {
  question: string;
  articleId?: string;
  slug?: string;
  pageContext?: string;
};

export type AskPageAIResponse = {
  answer: string;
  source?: AskPageAISource;
  confidence: number;
  provider: AIProvider;
  fallback: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isAIStatusResponse(body: unknown): body is AIStatusResponse {
  return isRecord(body) && typeof body.configured === "boolean" && "provider" in body;
}

function isAISearchResponse(body: unknown): body is AISearchResponse {
  return isRecord(body) && typeof body.answer === "string" && Array.isArray(body.sources);
}

function isAskPageAIResponse(body: unknown): body is AskPageAIResponse {
  return isRecord(body) && typeof body.answer === "string";
}

export async function getAIStatus(): Promise<AIStatusResponse> {
  const body = await apiGet<unknown>(endpoints.ai.status);
  if (!isAIStatusResponse(body)) {
    throw new Error("Invalid AI status response");
  }
  return body;
}

export async function aiSearch(question: string): Promise<AISearchResponse> {
  const body = await apiPost<unknown>(endpoints.ai.search, {
    question: question.trim(),
  });
  if (!isAISearchResponse(body)) {
    throw new Error("Invalid AI search response");
  }
  return body;
}

export async function askPageAI(
  payload: AskPageAIRequest,
): Promise<AskPageAIResponse> {
  const body = await apiPost<unknown>(endpoints.ai.askPage, payload);
  if (!isAskPageAIResponse(body)) {
    throw new Error("Invalid ask-page AI response");
  }
  return body;
}

/** User-facing message when AI search fails (Phase 12). */
export function getAISearchErrorMessage(err: unknown): string {
  return getApiErrorMessage(
    err,
    "AI search is unavailable right now. Please try again.",
  );
}

/** User-facing message when ask-page AI fails (Phase 13). */
export function getAskPageAIErrorMessage(err: unknown): string {
  return getApiErrorMessage(
    err,
    "Could not get an answer right now. Please try again.",
  );
}
