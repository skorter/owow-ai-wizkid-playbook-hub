import type { LucideIcon } from "lucide-react";

export type AIInsight = {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
};

export type ActivityItem = {
  type: "search" | "view" | "save";
  icon: LucideIcon;
  label: string;
  time: string;
  slug: string | null;
};

export type SavedArticle = {
  label: string;
  category: string;
  slug: string;
};

export type OnboardingProgressStep = {
  label: string;
  completed: boolean;
};

export type ToggleOption = {
  slug: string;
  label: string;
  description: string;
};
