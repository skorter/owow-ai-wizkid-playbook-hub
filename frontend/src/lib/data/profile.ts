import type {
  AIInsight,
  ActivityItem,
  SavedArticle,
  OnboardingProgressStep,
  ToggleOption,
} from "@/types/profile";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  Search,
  Bookmark,
} from "lucide-react";

export const aiInsights: AIInsight[] = [
  {
    icon: TrendingUp,
    label: "Most Searched",
    value: "HR Policies",
    color: "#ffd500",
  },
  { icon: Clock, label: "Avg Response Time", value: "1.2s", color: "#4ecdc4" },
  {
    icon: CheckCircle,
    label: "Questions Solved",
    value: "94%",
    color: "#00ff85",
  },
  { icon: BookOpen, label: "Articles Read", value: "47", color: "#09b9f9" },
];

export const activities: ActivityItem[] = [
  {
    type: "search",
    icon: Search,
    label: "How do I request time off?",
    time: "2h ago",
    slug: null,
  },
  {
    type: "view",
    icon: BookOpen,
    label: "Time Off Policy",
    time: "2h ago",
    slug: "time-off-policy",
  },
  {
    type: "search",
    icon: Search,
    label: "Simplicate login guide",
    time: "Yesterday",
    slug: null,
  },
  {
    type: "save",
    icon: Bookmark,
    label: "Remote Work Guidelines",
    time: "2 days ago",
    slug: "remote-work-guidelines",
  },
];

export const savedArticles: SavedArticle[] = [
  {
    label: "Holiday Calendar 2026",
    category: "HR",
    slug: "holiday-calendar-2026",
  },
  {
    label: "Performance Review Process",
    category: "Growth",
    slug: "performance-review-process",
  },
  {
    label: "Team Communication Guide",
    category: "Culture",
    slug: "team-communication-guide",
  },
  {
    label: "Expenses & Reimbursements",
    category: "Practical",
    slug: "expenses-and-reimbursements",
  },
];

export const onboardingProgressSteps: OnboardingProgressStep[] = [
  { label: "Company & Culture", completed: true },
  { label: "Practical Setup", completed: true },
  { label: "Growth & Conduct", completed: false },
];

export const toggleOptions: ToggleOption[] = [
  {
    slug: "smart-recommendations",
    label: "Smart Recommendations",
    description: "Get AI-suggested articles",
  },
  {
    slug: "auto-save",
    label: "Auto-save Searches",
    description: "Automatically save your search history",
  },
  {
    slug: "show-sources",
    label: "Show Source Documents",
    description: "Display source references in AI answers",
  },
];
