import type { LucideIcon } from "lucide-react";

export type OnboardingArticle = {
  label: string;
  slug: string;
  summary?: string | null;
};

export type OnboardingStep = {
  id: number;
  label: string;
  slug: string;
  icon: LucideIcon;
  description: string;
  articles: OnboardingArticle[];
};
