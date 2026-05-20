import { apiDelete, apiGet, apiPost } from "./client";
import { endpoints } from "./endpoints";

export type SavedArticleItem = {
  id: string;
  articleId: string;
  title: string;
  slug: string;
  summary?: string;
  category?: string;
  savedAt: string;
};

export type SavedArticlesResponse = {
  items: SavedArticleItem[];
};

export async function fetchSavedArticles(): Promise<SavedArticlesResponse> {
  return apiGet<SavedArticlesResponse>(endpoints.savedArticles.list);
}

export async function saveArticle(articleId: string): Promise<{
  item: SavedArticleItem;
  alreadySaved?: boolean;
}> {
  return apiPost(endpoints.savedArticles.byArticleId(articleId), {});
}

export async function unsaveArticle(articleId: string): Promise<{ deleted: boolean }> {
  return apiDelete(endpoints.savedArticles.byArticleId(articleId));
}
