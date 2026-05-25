import {
  DetailedAnswer,
  QuickAnswer,
  RecentActivityItem,
  SourceDocument,
} from "@/types/search";

export const suggestedQuestions: string[] = [
  "How do I request time off?",
  "What tools do I need access to?",
  "How does the performance review process work?",
  "What are the working hours?",
];

export const recentActivity: RecentActivityItem[] = [
  { label: "Time Off Policy", meta: "Viewed 2 hours ago" },
  { label: "Simplicate Login Guide", meta: "Viewed yesterday" },
  { label: "Continue Onboarding", meta: "2 of 5 steps completed" },
];

export const quickAnswer: QuickAnswer = {
  answer:
    'To request time off at OWOW, use the Simplicate platform. Navigate to the "Time Off" section, select your dates, and submit your request. Your manager will be notified automatically and typically responds within 24-48 hours.',
};

export const relatedQuestions: string[] = [
  "How do I request time off?",
  "What tools do I need access to?",
  "How does the performance review process work?",
  "What are the working hours?",
];

export const sourceDocuments: SourceDocument[] = [
  {
    badge: "HR",
    title: "Time Off Policy",
    section: "Request Process",
    slug: "time-off-policy",
  },
  {
    badge: "Tools",
    title: "Simplicate Time Off Guide",
    section: "Time Management",
    slug: "simplicate-time-off-guide",
  },
];

export const detailedAnswer: DetailedAnswer = {
  title: "Time Off Request Process",
  description:
    "OWOW uses Simplicate for all time off management. Here's the complete process:",
  steps: [
    "Log into Simplicate with your OWOW credentials",
    "Navigate to HR → Time Off Requests",
    'Click "New Request" and select your dates',
    "Choose the type: Vacation, Sick Leave, or Personal Day",
    "Add optional notes for your manager",
    "Submit and wait for approval",
  ],
  note: "Note: Time off requests should be submitted at least 2 weeks in advance for planned vacations. Emergency or sick leave can be submitted retroactively.",
};
