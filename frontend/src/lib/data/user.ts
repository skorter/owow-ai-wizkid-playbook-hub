import type { User } from "@/types/user";

export const user: User = {
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  initials: "JD",
  role: "Employee",
  department: "Design Team",
  position: "Senior Designer",
  email: "john.doe@eowow.io",
  startDate: "January 2022",
  startDateRaw: new Date("2022-01-15"),
  level: "Advanced",
  aiSearches: 127,
  onboardingProgress: 80,
  aiSummary:
    "Senior Designer with 2+ years at OWOW. Highly engaged with onboarding completion at 80%. Frequent AI user, particularly for HR policies and design resources. Active team collaborator.",
};
