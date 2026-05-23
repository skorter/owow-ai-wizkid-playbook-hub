const STORAGE_PREFIX = "owow-onboarding-progress:";

export type OnboardingProgressStore = {
  completedArticleSlugs: string[];
  updatedAt: string;
};

function safeParse(raw: string | null): OnboardingProgressStore | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as OnboardingProgressStore;
    if (!parsed || !Array.isArray(parsed.completedArticleSlugs)) return null;
    return {
      completedArticleSlugs: parsed.completedArticleSlugs.filter(
        (s) => typeof s === "string" && s.trim().length > 0,
      ),
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function getOnboardingProgressKey(
  userId: string | null | undefined,
  email: string | null | undefined,
): string {
  const id = userId?.trim() || email?.trim() || "anonymous";
  return `${STORAGE_PREFIX}${id}`;
}

export function readOnboardingProgress(key: string): OnboardingProgressStore {
  if (typeof window === "undefined") {
    return { completedArticleSlugs: [], updatedAt: new Date().toISOString() };
  }
  return (
    safeParse(localStorage.getItem(key)) ?? {
      completedArticleSlugs: [],
      updatedAt: new Date().toISOString(),
    }
  );
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function writeOnboardingProgress(
  key: string,
  completedArticleSlugs: string[],
): OnboardingProgressStore {
  const store: OnboardingProgressStore = {
    completedArticleSlugs: [
      ...new Set(completedArticleSlugs.map(normalizeSlug)),
    ],
    updatedAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(store));
  }
  return store;
}

/** Clears onboarding progress for one user key only (current account). */
export function clearOnboardingProgress(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function markArticleComplete(key: string, slug: string): OnboardingProgressStore {
  const normalized = normalizeSlug(slug);
  const current = readOnboardingProgress(key);
  if (current.completedArticleSlugs.includes(normalized)) {
    return current;
  }
  return writeOnboardingProgress(key, [...current.completedArticleSlugs, normalized]);
}

export function isArticleComplete(key: string, slug: string): boolean {
  const normalized = normalizeSlug(slug);
  return readOnboardingProgress(key).completedArticleSlugs.includes(normalized);
}

export function getOnboardingProgressPercent(
  completedSlugs: string[],
  allArticleSlugs: string[],
): number {
  if (allArticleSlugs.length === 0) return 0;
  const done = allArticleSlugs.filter((slug) =>
    completedSlugs.includes(slug.trim().toLowerCase()),
  ).length;
  return Math.round((done / allArticleSlugs.length) * 100);
}

export function findFirstIncompleteStepIndex(
  steps: { articles: { slug: string }[] }[],
  completedSlugs: string[],
): number {
  const index = steps.findIndex(
    (step) =>
      !step.articles.every((article) =>
        completedSlugs.includes(article.slug.trim().toLowerCase()),
      ),
  );
  return index === -1 ? Math.max(0, steps.length - 1) : index;
}
