import type { CTACard } from "@/types/ctacards";
import { Search, BookOpen, GraduationCap } from "lucide-react";

export const ctaCards: CTACard[] = [
  {
    icon: Search,
    title: "Search",
    description: "Find specific information quickly.",
    href: "/playbook/search",
  },
  {
    icon: BookOpen,
    title: "Browse Topics",
    description: "Explore all available topics in the Playbook.",
    href: "/playbook/topics",
  },
  {
    icon: GraduationCap,
    title: "New here?",
    description: "Try our onboarding guide.",
    href: "/playbook/onboarding",
  },
];
