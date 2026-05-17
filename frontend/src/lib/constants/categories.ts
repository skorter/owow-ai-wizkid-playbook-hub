import type { Category } from "@/types/playbook";
import {
  Building2,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Building2,
  Briefcase,
  TrendingUp,
  ShieldCheck,
};

export const categories: Category[] = [
  {
    label: "OWOW General",
    slug: "owow-general",
    description: "Information gap closing in 3... 2... 1...",
    icon: "Building2",
    pages: [
      {
        label: "Welcome to OWOW",
        slug: "welcome-to-owow",
        description:
          "Your first stop — everything you need to know before day one.",
        subpages: [],
      },
      {
        label: "Mission, vision & our promise",
        slug: "mission-vision-our-promise",
        description: "Why we exist, where we're going, and what we stand for.",
        subpages: [
          { label: "Mission", slug: "mission" },
          { label: "Vision", slug: "vision" },
          { label: "Our promise", slug: "our-promise" },
        ],
      },
      {
        label: "Core values",
        slug: "core-values",
        description:
          "The principles that guide how we work and treat each other.",
        subpages: [],
      },
      {
        label: "Our work culture & Way of working",
        slug: "our-work-culture-way-of-working",
        description: "How we collaborate, communicate, and get things done.",
        subpages: [
          { label: "Work culture", slug: "work-culture" },
          { label: "Way of working", slug: "way-of-working" },
        ],
      },
      {
        label: "Team structure & roles",
        slug: "team-structure-roles",
        description: "Who does what and how the team is organized.",
        subpages: [
          { label: "Team structure", slug: "team-structure" },
          { label: "Roles", slug: "roles" },
        ],
      },
      {
        label: "Our office",
        slug: "our-office",
        description: "Everything about our physical workspace and facilities.",
        subpages: [],
      },
      {
        label: "Definitions",
        slug: "definitions",
        description: "A glossary of terms and acronyms used at OWOW.",
        subpages: [],
      },
    ],
  },
  {
    label: "Practical Information",
    slug: "practical-information",
    description: "How does it work to work for OWOW?",
    icon: "Briefcase",
    pages: [
      {
        label: "Simplicate",
        slug: "simplicate",
        description:
          "Our main platform for time tracking, HR, and project management.",
        subpages: [],
      },
      {
        label: "Sickness and absence",
        slug: "sickness-and-absence",
        description: "What to do when you're sick and how absence is handled.",
        subpages: [
          { label: "Sickness", slug: "sickness" },
          { label: "Absence", slug: "absence" },
        ],
      },
      {
        label: "Holidays and leave",
        slug: "holidays-and-leave",
        description: "Your holiday entitlement and how to request time off.",
        subpages: [
          { label: "Holidays", slug: "holidays" },
          { label: "Leave", slug: "leave" },
        ],
      },
      {
        label: "Expenses and reimbursements",
        slug: "expenses-and-reimbursements",
        description: "How to submit expenses and get reimbursed.",
        subpages: [
          { label: "Expenses", slug: "expenses" },
          { label: "Reimbursements", slug: "reimbursements" },
        ],
      },
      {
        label: "Pension scheme",
        slug: "pension-scheme",
        description:
          "Everything about your pension and retirement plan at OWOW.",
        subpages: [],
      },
      {
        label: "Parenthood",
        slug: "parenthood",
        description: "Maternity, paternity, and parental leave policies.",
        subpages: [],
      },
    ],
  },
  {
    label: "Growth and Development",
    slug: "growth-and-development",
    description:
      "At OWOW, you're given clear frameworks but also the freedom to shape your role yourself.",
    icon: "TrendingUp",
    pages: [
      {
        label: "Role description",
        slug: "role-description",
        description:
          "A clear overview of your role, responsibilities, and expectations.",
        subpages: [],
      },
      {
        label: "Salary structure",
        slug: "salary-structure",
        description: "How salaries are structured and reviewed at OWOW.",
        subpages: [],
      },
      {
        label: "Personal growth",
        slug: "personal-growth",
        description: "How we support your development and career progression.",
        subpages: [],
      },
      {
        label: "Dealing with clients",
        slug: "dealing-with-clients",
        description:
          "Best practices for client communication and relationships.",
        subpages: [],
      },
      {
        label: "OWOW's online library",
        slug: "owows-online-library",
        description:
          "A curated collection of books and resources to help you grow.",
        subpages: [],
      },
    ],
  },
  {
    label: "Policy and Conduct",
    slug: "policy-and-conduct",
    description:
      "At OWOW, we start from a place of trust. We work with people who respect and support each other.",
    icon: "ShieldCheck",
    pages: [
      {
        label: "Inclusion, non-discrimination and equal treatment",
        slug: "inclusion-non-discrimination-equal-treatment",
        description:
          "Our commitment to a fair and inclusive workplace for everyone.",
        subpages: [
          { label: "Inclusion", slug: "inclusion" },
          { label: "Non-discrimination", slug: "non-discrimination" },
          { label: "Equal treatment", slug: "equal-treatment" },
        ],
      },
      {
        label: "Anti-harassment & reporting procedure",
        slug: "anti-harassment-reporting-procedure",
        description: "How we handle harassment and how to report it safely.",
        subpages: [],
      },
      {
        label: "Wellbeing in the workplace",
        slug: "wellbeing-in-the-workplace",
        description: "How OWOW supports your mental and physical wellbeing.",
        subpages: [],
      },
      {
        label: "Complaint process & conflict mediation",
        slug: "complaint-process-conflict-mediation",
        description: "How to raise a complaint and how conflicts are resolved.",
        subpages: [
          { label: "Complaint process", slug: "complaint-process" },
          { label: "Conflict mediation", slug: "conflict-mediation" },
        ],
      },
      {
        label: "Confident advisor",
        slug: "confident-advisor",
        description: "Who to talk to when you need confidential support.",
        subpages: [],
      },
      {
        label: "Disciplinary policy / Exit",
        slug: "disciplinary-policy-exit",
        description:
          "How disciplinary matters are handled and the offboarding process.",
        subpages: [
          { label: "Disciplinary policy", slug: "disciplinary-policy" },
          { label: "Exit", slug: "exit" },
        ],
      },
    ],
  },
];
