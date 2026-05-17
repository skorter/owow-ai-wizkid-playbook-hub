import type { OnboardingStep } from "@/types/onboarding";
import { Building2, Briefcase, TrendingUp } from "lucide-react";

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    label: "Company & Culture",
    slug: "company-culture",
    icon: Building2,
    description: "Get to know OWOW — who we are and how we work.",
    articles: [
      { label: "Welcome to OWOW", slug: "welcome-to-owow" },
      {
        label: "Mission, vision & our promise",
        slug: "mission-vision-our-promise",
      },
      { label: "Core values", slug: "core-values" },
      {
        label: "Our work culture & Way of working",
        slug: "our-work-culture-way-of-working",
      },
    ],
  },
  {
    id: 2,
    label: "Practical Setup",
    slug: "practical-setup",
    icon: Briefcase,
    description: "Everything you need to get up and running from day one.",
    articles: [
      { label: "Simplicate", slug: "simplicate" },
      { label: "Team structure & roles", slug: "team-structure-roles" },
      { label: "Our office", slug: "our-office" },
      { label: "Holidays and leave", slug: "holidays-and-leave" },
      {
        label: "Expenses and reimbursements",
        slug: "expenses-and-reimbursements",
      },
    ],
  },
  {
    id: 3,
    label: "Growth & Conduct",
    slug: "growth-conduct",
    icon: TrendingUp,
    description: "Understand how you grow at OWOW and what's expected.",
    articles: [
      { label: "Role description", slug: "role-description" },
      { label: "Personal growth", slug: "personal-growth" },
      {
        label: "Inclusion, non-discrimination and equal treatment",
        slug: "inclusion-non-discrimination-equal-treatment",
      },
      {
        label: "Wellbeing in the workplace",
        slug: "wellbeing-in-the-workplace",
      },
      {
        label: "Anti-harassment & reporting procedure",
        slug: "anti-harassment-reporting-procedure",
      },
    ],
  },
];
