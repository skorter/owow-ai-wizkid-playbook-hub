import { apiGet, ApiError, endpoints } from "@/lib/api";
import { unwrapListData } from "@/lib/api/unwrap";
import type { ApiArticle, ApiCategory } from "@/lib/mappers/articles";
import type { ApiOnboardingStep } from "@/lib/mappers/onboarding";
import { categories as staticCategories } from "@/lib/data/categories";
import { onboardingSteps as staticOnboardingSteps } from "@/lib/data/onboarding";
import type { Category, Page } from "@/types/playbook";
import type { OnboardingStep } from "@/types/onboarding";
import {
  Building2,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Wrench,
  Heart,
  Users,
  MessageCircle,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "owow-general": Building2,
  "practical-information": Briefcase,
  "growth-and-development": TrendingUp,
  "policy-and-conduct": ShieldCheck,
  tools: Wrench,
  hr: Users,
  benefits: Heart,
  "company-culture": BookOpen,
  communication: MessageCircle,
  onboarding: Building2,
};

const ONBOARDING_STEP_ICONS: LucideIcon[] = [Building2, Briefcase, TrendingUp];

const staticCategoryMeta = new Map(
  staticCategories.map((c) => [
    c.slug,
    { description: c.description, icon: c.icon },
  ]),
);

export type PlaybookTopicsResult = {
  categories: Category[];
  fromFallback: boolean;
};

export type PlaybookArticleDetail = {
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  categoryName: string;
  categorySlug: string;
  fromFallback: boolean;
};

export type PlaybookOnboardingResult = {
  steps: OnboardingStep[];
  fromFallback: boolean;
};

function iconForCategorySlug(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug.trim().toLowerCase()] ?? BookOpen;
}

function descriptionForCategory(slug: string, name: string): string {
  const meta = staticCategoryMeta.get(slug.trim().toLowerCase());
  if (meta?.description) return meta.description;
  return `Articles and guidance for ${name}.`;
}

function mapArticleToPage(article: ApiArticle): Page {
  return {
    label: article.title,
    slug: article.slug,
    description: article.summary?.trim() || "Read this article in the playbook.",
    subpages: [],
  };
}

export function mapApiToPlaybookCategories(
  apiCategories: ApiCategory[],
  articles: ApiArticle[],
): Category[] {
  const pagesByCategoryId = new Map<string, Page[]>();

  for (const article of articles) {
    const categoryId = article.category?.id ?? article.categoryId;
    if (!categoryId) continue;
    const list = pagesByCategoryId.get(categoryId) ?? [];
    list.push(mapArticleToPage(article));
    pagesByCategoryId.set(categoryId, list);
  }

  return apiCategories
    .map((category) => {
      const pages = (pagesByCategoryId.get(category.id) ?? []).sort((a, b) =>
        a.label.localeCompare(b.label),
      );
      const slug = category.slug;
      const staticMeta = staticCategoryMeta.get(slug);
      return {
        label: category.name,
        slug,
        description: descriptionForCategory(slug, category.name),
        icon: staticMeta?.icon ?? iconForCategorySlug(slug),
        pages,
      };
    })
    .filter((category) => category.pages.length > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function fetchPlaybookTopics(): Promise<PlaybookTopicsResult> {
  try {
    const [apiCategories, articles] = await Promise.all([
      apiGet<ApiCategory[]>(endpoints.categories.list),
      apiGet<ApiArticle[]>(endpoints.articles.list),
    ]);

    const categories = mapApiToPlaybookCategories(apiCategories, articles);
    return { categories, fromFallback: false };
  } catch {
    return { categories: staticCategories, fromFallback: true };
  }
}

export function findStaticPageBySlug(slug: string): {
  label: string;
  description: string;
  subpages: Page["subpages"];
} | null {
  const normalized = slug.trim().toLowerCase();

  for (const category of staticCategories) {
    for (const page of category.pages) {
      if (page.slug === normalized) {
        return {
          label: page.label,
          description: page.description,
          subpages: page.subpages,
        };
      }
      for (const sub of page.subpages) {
        if (sub.slug === normalized) {
          return { label: sub.label, description: "", subpages: [] };
        }
      }
    }
  }

  return null;
}

export async function fetchPlaybookArticleBySlug(
  slug: string,
): Promise<PlaybookArticleDetail | null> {
  try {
    const article = await apiGet<ApiArticle>(endpoints.articles.bySlug(slug));
    return {
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      content: article.content,
      categoryName: article.category?.name ?? "Playbook",
      categorySlug: article.category?.slug ?? "",
      fromFallback: false,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export function buildStaticArticleFallback(slug: string): PlaybookArticleDetail | null {
  const staticPage = findStaticPageBySlug(slug);
  if (!staticPage) return null;

  return {
    slug,
    title: staticPage.label,
    summary: staticPage.description || null,
    content:
      "This article is not yet published from the backend. Content will appear here once HR publishes it in the admin hub.",
    categoryName: "Playbook",
    categorySlug: "",
    fromFallback: true,
  };
}

export function mapApiOnboardingToEmployeeSteps(
  apiSteps: ApiOnboardingStep[],
): OnboardingStep[] {
  return apiSteps
    .filter((step) => step.isActive)
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({
      id: step.order,
      label: step.title,
      slug: `onboarding-step-${step.order}`,
      icon: ONBOARDING_STEP_ICONS[index % ONBOARDING_STEP_ICONS.length],
      description: step.content,
      articles: step.article
        ? [{ label: step.article.title, slug: step.article.slug }]
        : [],
    }));
}

export async function fetchPlaybookOnboarding(): Promise<PlaybookOnboardingResult> {
  try {
    const raw = await apiGet<unknown>(endpoints.onboarding.list);
    const apiSteps = unwrapListData<ApiOnboardingStep>(raw);
    const steps = mapApiOnboardingToEmployeeSteps(apiSteps);
    return { steps, fromFallback: false };
  } catch {
    return { steps: staticOnboardingSteps, fromFallback: true };
  }
}
