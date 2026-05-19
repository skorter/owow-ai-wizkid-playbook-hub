import { apiDelete, apiGet, apiPost, apiPut, endpoints } from "@/lib/api";
import type { ContentCategory } from "@/data/adminMockData";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";
import type { ApiCategory } from "@/lib/mappers/articles";
import { fetchAdminArticles } from "@/lib/mappers/articles";
import type { ArticleCategoryOption } from "@/lib/mappers/articles";

export type CategoryWritePayload = {
  name: string;
  slug: string;
};

const SLUG_COLOR_MAP: Record<string, { color: AdminBadgeColor; accentHex: string }> = {
  hr: { color: "blue", accentHex: "#22d3ee" },
  tools: { color: "orange", accentHex: "#f97316" },
  policies: { color: "green", accentHex: "#22c55e" },
  benefits: { color: "blue", accentHex: "#3b82f6" },
  growth: { color: "purple", accentHex: "#a855f7" },
  culture: { color: "yellow", accentHex: "#ffd500" },
  onboarding: { color: "blue", accentHex: "#22d3ee" },
};

const DEFAULT_ACCENT = { color: "yellow" as AdminBadgeColor, accentHex: "#ffd500" };

function uiAccentForSlug(slug: string): { color: AdminBadgeColor; accentHex: string } {
  const key = slug.trim().toLowerCase();
  return SLUG_COLOR_MAP[key] ?? DEFAULT_ACCENT;
}

export function mapApiCategoryToContentCategory(
  category: ApiCategory,
  articleCount = 0,
  uiOverrides?: Partial<Pick<ContentCategory, "description" | "color" | "accentHex" | "status">>,
): ContentCategory {
  const accent = uiAccentForSlug(category.slug);

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: uiOverrides?.description ?? "",
    articleCount,
    color: uiOverrides?.color ?? accent.color,
    accentHex: uiOverrides?.accentHex ?? accent.accentHex,
    status: uiOverrides?.status ?? "Active",
  };
}

export function toArticleCategoryOptions(
  categories: ContentCategory[],
): ArticleCategoryOption[] {
  return categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export async function fetchContentCategories(): Promise<ContentCategory[]> {
  const apiCategories = await apiGet<ApiCategory[]>(endpoints.categories.list);
  return apiCategories.map((c) => mapApiCategoryToContentCategory(c, 0));
}

export async function fetchContentCategoriesWithCounts(): Promise<ContentCategory[]> {
  const [apiCategories, articles] = await Promise.all([
    apiGet<ApiCategory[]>(endpoints.categories.list),
    fetchAdminArticles({}),
  ]);

  const countByCategoryId = new Map<string, number>();
  for (const article of articles) {
    const categoryId = article.categoryId;
    if (!categoryId) continue;
    countByCategoryId.set(categoryId, (countByCategoryId.get(categoryId) ?? 0) + 1);
  }

  return apiCategories.map((c) =>
    mapApiCategoryToContentCategory(c, countByCategoryId.get(c.id) ?? 0),
  );
}

export async function createCategory(payload: CategoryWritePayload): Promise<ContentCategory> {
  const category = await apiPost<ApiCategory>(endpoints.categories.list, payload);
  return mapApiCategoryToContentCategory(category, 0);
}

export async function updateCategory(
  id: string,
  payload: CategoryWritePayload,
): Promise<ContentCategory> {
  const category = await apiPut<ApiCategory>(endpoints.categories.byId(id), payload);
  return mapApiCategoryToContentCategory(category, 0);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiDelete<{ message?: string }>(endpoints.categories.byId(id));
}
