import { apiGet } from "./client";
import { endpoints } from "./endpoints";

export type ProfileActivityType = "AI_SEARCH" | "AI_CHAT";

export type ProfileActivityItem = {
  id: string;
  type: ProfileActivityType;
  title: string;
  question: string;
  answerPreview: string | null;
  articleTitle: string | null;
  articleSlug: string | null;
  confidence: number | null;
  sourceCount: number;
  createdAt: string;
};

export type ProfileActivityResponse = {
  items: ProfileActivityItem[];
};

export type ProfileInsightsResponse = {
  totalSearches: number;
  totalAskPageQuestions: number;
  averageConfidence: number;
  topCategory: string | null;
  savedArticlesCount: number;
  onboardingProgress: number | null;
};

export type RecentSearchItem = {
  id: string;
  question: string;
  answerPreview: string | null;
  confidence: number;
  sourceCount: number;
  createdAt: string;
};

export type RecentSearchesResponse = {
  items: RecentSearchItem[];
};

export async function fetchProfileActivity(
  limit?: number,
): Promise<ProfileActivityResponse> {
  return apiGet<ProfileActivityResponse>(endpoints.profile.activity, {
    query: limit != null ? { limit } : undefined,
  });
}

export async function fetchProfileInsights(): Promise<ProfileInsightsResponse> {
  return apiGet<ProfileInsightsResponse>(endpoints.profile.insights);
}

export async function fetchRecentSearches(
  limit?: number,
): Promise<RecentSearchesResponse> {
  return apiGet<RecentSearchesResponse>(endpoints.ai.recentSearches, {
    query: limit != null ? { limit } : undefined,
  });
}
