import type { OnboardingStep } from "@/types/onboarding";

export function normalizeArticleSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function collectPublishedArticleSlugs(steps: OnboardingStep[]): string[] {
  return steps.flatMap((step) =>
    step.articles.map((article) => normalizeArticleSlug(article.slug)),
  );
}

export function countCompletedPublishedArticles(
  steps: OnboardingStep[],
  completedSlugs: string[],
): number {
  const published = collectPublishedArticleSlugs(steps);
  return published.filter((slug) => completedSlugs.includes(slug)).length;
}

export function getPublishedOnboardingProgressPercent(
  steps: OnboardingStep[],
  completedSlugs: string[],
): number {
  const published = collectPublishedArticleSlugs(steps);
  if (published.length === 0) return 0;
  const done = countCompletedPublishedArticles(steps, completedSlugs);
  return Math.round((done / published.length) * 100);
}

export function findFirstIncompleteArticleInStep(
  step: OnboardingStep,
  completedSlugs: string[],
): string | null {
  const next = step.articles.find(
    (article) => !completedSlugs.includes(normalizeArticleSlug(article.slug)),
  );
  return next?.slug ?? null;
}

export function estimateReadingMinutes(articleCount: number): number {
  if (articleCount <= 0) return 0;
  return Math.max(3, articleCount * 4);
}
