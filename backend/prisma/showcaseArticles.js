/** Showcase demo articles — not official OWOW policy. */

const DISCLAIMER =
  "Showcase demo content for the OWOW Playbook Hub. This is illustrative guidance only and is not official company policy.\n\n";

function buildContent(title, points) {
  const intro = `${title} helps new and existing colleagues find practical answers in one place. Use this article as a starting point and ask HR if anything is unclear.`;
  const bullets = points.map((p) => `• ${p}`).join("\n");
  const close =
    "If details change, HR will update the playbook. Always confirm time-sensitive topics (leave, expenses, contracts) with your manager or HR.";
  return `${DISCLAIMER}${intro}\n\n${bullets}\n\n${close}`;
}

function article(title, slug, categorySlug, summaryPoints) {
  return {
    slug,
    title,
    summary: summaryPoints[0] ?? `Guidance on ${title.toLowerCase()} at OWOW.`,
    content: buildContent(title, summaryPoints),
    tags: [categorySlug.split("-")[0], "showcase"],
    categorySlug,
    authorEmail: "hr.admin@owow.example",
  };
}

const OWOW_GENERAL = [
  article("Welcome to OWOW", "welcome-to-owow", "owow-general", [
    "Your starting point for culture, tools, and HR basics.",
    "Overview of the playbook",
    "Who to contact for help",
    "How content is organized",
  ]),
  article("Mission, Vision & Promise", "mission-vision-promise", "owow-general", [
    "Why OWOW exists and where we are heading",
    "Mission and vision in plain language",
    "Our promise to clients and colleagues",
  ]),
  article("Core Values", "core-values", "owow-general", [
    "Trust, craftsmanship, and collaboration",
    "How values show up in daily work",
    "Examples of value-led decisions",
  ]),
  article("Work Culture", "work-culture", "owow-general", [
    "How we collaborate across teams",
    "Feedback and psychological safety",
    "Celebrating wins and learning from misses",
  ]),
  article("Way of Working", "way-of-working", "owow-general", [
    "Agile-inspired delivery without jargon overload",
    "Documentation and async communication",
    "Meetings, focus time, and client work",
  ]),
  article("Team Structure", "team-structure", "owow-general", [
    "Studios, leads, and cross-functional partners",
    "Escalation paths for blockers",
    "How projects map to teams",
  ]),
  article("Roles", "roles", "owow-general", [
    "Common role families at OWOW",
    "Expectations by seniority",
    "Growth conversations with your lead",
  ]),
  article("Our Office", "our-office", "owow-general", [
    "Office access and visitor policy",
    "Desk booking and hybrid norms",
    "Facilities and safety contacts",
  ]),
  article("Definitions", "definitions", "owow-general", [
    "Glossary of OWOW terms and acronyms",
    "Client vs internal terminology",
    "Where to suggest new definitions",
  ]),
];

const PRACTICAL = [
  article("Simplicate Login Guide", "simplicate-login-guide", "practical-information", [
    "Access Simplicate with your OWOW account",
    "Register hours and project codes",
    "CRM hygiene expectations",
  ]),
  article("Sickness Reporting", "sickness-reporting", "practical-information", [
    "Notify your manager before 09:30",
    "Log absence in Simplicate",
    "Return-to-work check-in",
  ]),
  article("Absence Policy", "absence-policy", "practical-information", [
    "Planned vs unplanned absence",
    "Coverage handover expectations",
    "HR documentation when required",
  ]),
  article("Holiday Calendar", "holiday-calendar", "practical-information", [
    "National holidays and company closures",
    "Team calendar visibility",
    "Planning around peak client periods",
  ]),
  article("Leave Request Process", "leave-request-process", "practical-information", [
    "Submit requests in advance",
    "Approval workflow with your lead",
    "Balance checks and carry-over basics",
  ]),
  article("Expenses", "expenses", "practical-information", [
    "Eligible business expenses",
    "Receipt requirements",
    "Submission deadlines",
  ]),
  article("Reimbursements", "reimbursements", "practical-information", [
    "Approval and payout timeline",
    "Currency and VAT notes",
    "Questions to finance@ alias",
  ]),
  article("Pension Scheme", "pension-scheme", "practical-information", [
    "Enrollment overview",
    "Employee vs employer contribution (high level)",
    "Where to read full pension docs",
  ]),
  article("Parenthood", "parenthood", "practical-information", [
    "Parental leave types",
    "Notice periods and planning",
    "Return-to-work support",
  ]),
];

const GROWTH = [
  article("Role Description", "role-description", "growth-and-development", [
    "Scope and responsibilities",
    "Success metrics for your role",
    "Alignment with studio goals",
  ]),
  article("Salary Structure", "salary-structure", "growth-and-development", [
    "Bands and review cycles (high level)",
    "Transparency principles",
    "Private conversations with HR",
  ]),
  article("Personal Growth", "personal-growth", "growth-and-development", [
    "Learning budget and time",
    "Mentorship and coaching",
    "Career path conversations",
  ]),
  article("Dealing with Clients", "dealing-with-clients", "growth-and-development", [
    "Professional communication standards",
    "Escalation when scope shifts",
    "Recording decisions in writing",
  ]),
  article("OWOW Online Library", "owow-online-library", "growth-and-development", [
    "Curated books and courses",
    "How to request new titles",
    "Sharing learnings with the studio",
  ]),
  article("Performance Review Process", "performance-review-process", "growth-and-development", [
    "Review cadence and participants",
    "Self-assessment tips",
    "Goal setting for the next period",
  ]),
];

const POLICY = [
  article("Inclusion", "inclusion", "policy-and-conduct", [
    "Inclusive collaboration norms",
    "Accessible meetings and documents",
    "Reporting concerns safely",
  ]),
  article("Non-Discrimination", "non-discrimination", "policy-and-conduct", [
    "Protected characteristics (summary)",
    "Zero tolerance for discrimination",
    "How HR investigates reports",
  ]),
  article("Equal Treatment", "equal-treatment", "policy-and-conduct", [
    "Fair processes for opportunities",
    "Consistent interview practices",
    "Transparency in decisions",
  ]),
  article("Anti-Harassment Reporting", "anti-harassment-reporting", "policy-and-conduct", [
    "What counts as harassment",
    "Confidential reporting channels",
    "Support during investigations",
  ]),
  article("Wellbeing in the Workplace", "wellbeing-in-the-workplace", "policy-and-conduct", [
    "Workload sustainability",
    "Access to support resources",
    "Manager check-in guidance",
  ]),
  article("Complaint Process", "complaint-process", "policy-and-conduct", [
    "Formal vs informal complaints",
    "Timelines and documentation",
    "Outcomes and follow-up",
  ]),
  article("Conflict Mediation", "conflict-mediation", "policy-and-conduct", [
    "When to request mediation",
    "Neutral facilitator role",
    "Agreements and monitoring",
  ]),
  article("Confidential Advisor", "confidential-advisor", "policy-and-conduct", [
    "Independent support contact",
    "What is shared with HR",
    "Emergency escalation paths",
  ]),
  article("Disciplinary Policy", "disciplinary-policy", "policy-and-conduct", [
    "Stages of disciplinary process",
    "Documentation expectations",
    "Right to be heard",
  ]),
  article("Exit Process", "exit-process", "policy-and-conduct", [
    "Resignation notice periods",
    "Handover checklist",
    "Equipment return and access revocation",
  ]),
];

const ARTICLE_SEEDS = [...OWOW_GENERAL, ...PRACTICAL, ...GROWTH, ...POLICY];

const ONBOARDING_SEEDS = [
  {
    order: 1,
    title: "Welcome to OWOW",
    content: "Read the welcome article and bookmark the playbook hub.",
    articleSlug: "welcome-to-owow",
  },
  {
    order: 2,
    title: "Set up your tools",
    content: "Complete Simplicate access and review the tools guide.",
    articleSlug: "simplicate-login-guide",
  },
  {
    order: 3,
    title: "Learn company culture",
    content: "Review core values and our way of working.",
    articleSlug: "core-values",
  },
  {
    order: 4,
    title: "Understand policies",
    content: "Read inclusion and wellbeing articles in Policy & Conduct.",
    articleSlug: "wellbeing-in-the-workplace",
  },
  {
    order: 5,
    title: "Meet your team",
    content: "Schedule intros with your lead and review team structure.",
    articleSlug: "team-structure",
  },
];

module.exports = { ARTICLE_SEEDS, ONBOARDING_SEEDS };
