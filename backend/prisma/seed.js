const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { prisma } = require("../src/config/prisma");

const PASSWORD_HASH_PLACEHOLDER = "fake_password_hash_phase5_not_bcrypt";

const CATEGORY_SEEDS = [
  { name: "OWOW General", slug: "owow-general" },
  { name: "Practical Information", slug: "practical-information" },
  { name: "Growth and Development", slug: "growth-and-development" },
  { name: "Policy and Conduct", slug: "policy-and-conduct" },
  { name: "Tools", slug: "tools" },
  { name: "Company Culture", slug: "company-culture" },
  { name: "HR", slug: "hr" },
  { name: "Benefits", slug: "benefits" },
  { name: "Communication", slug: "communication" },
  { name: "Onboarding", slug: "onboarding" },
];

/** @type {{ slug: string, title: string, summary: string, content: string, tags: string[], categorySlug: string, authorEmail: string }[]} */
const ARTICLE_SEEDS = [
  {
    slug: "welcome-to-owow",
    title: "Welcome to OWOW",
    summary:
      "Start here for an overview of OWOW, how we work, and where to find help.",
    content:
      "Welcome to OWOW. This playbook is your home for practical guidance on how we collaborate, communicate, and grow together. Reach out to HR via the usual channels if you need anything.",
    tags: ["onboarding", "welcome", "overview"],
    categorySlug: "onboarding",
    authorEmail: "hr.admin@owow.example",
  },
  {
    slug: "holiday-and-leave",
    title: "Holiday and Leave",
    summary: "Basics on requesting leave and holidays at OWOW.",
    content:
      "Request vacation and other leave according to OWOW HR guidelines. Submit requests in advance where possible so teams can plan coverage.",
    tags: ["leave", "vacation", "hr"],
    categorySlug: "benefits",
    authorEmail: "hr.admin@owow.example",
  },
  {
    slug: "sickness-and-absence",
    title: "Sickness and Absence",
    summary: "What to do when you are unwell or need to report absence.",
    content:
      "If you cannot work due to illness, notify your manager and HR as soon as you can. Follow internal reporting procedures for sick leave.",
    tags: ["sickness", "absence", "hr"],
    categorySlug: "hr",
    authorEmail: "hr.admin@owow.example",
  },
  {
    slug: "simplicate",
    title: "Simplicate",
    summary: "How we use Simplicate for time, projects, and CRM.",
    content:
      "Simplicate supports our project and client workflows. Use it for registering hours, updating project status, and keeping CRM records accurate.",
    tags: ["tools", "simplicate", "crm"],
    categorySlug: "tools",
    authorEmail: "employee@owow.example",
  },
  {
    slug: "core-values",
    title: "Core Values",
    summary: "The principles that shape how we behave and decide at OWOW.",
    content:
      "Our culture is built on trust, openness, craftsmanship, and care for impact. Align your work with these values when collaborating with clients and colleagues.",
    tags: ["culture", "values"],
    categorySlug: "company-culture",
    authorEmail: "hr.admin@owow.example",
  },
  {
    slug: "remote-work-policy",
    title: "Remote Work Policy",
    summary: "Expectations and guidelines for hybrid and remote collaboration.",
    content:
      "OWOW supports flexible collaboration. Coordinate availability with your team, keep communication predictable, and use agreed tools for transparency.",
    tags: ["remote", "policy", "hybrid"],
    categorySlug: "policy-and-conduct",
    authorEmail: "hr.admin@owow.example",
  },
  {
    slug: "salary-structure",
    title: "Salary Structure",
    summary: "High-level overview of how compensation is structured.",
    content:
      "Compensation aligns with role, experience, and company guidelines. Discuss detailed questions privately with HR; this article is MVP reference only.",
    tags: ["salary", "compensation"],
    categorySlug: "benefits",
    authorEmail: "hr.admin@owow.example",
  },
  {
    slug: "tools-and-workflows",
    title: "Tools and Workflows",
    summary: "Key tools we use daily and how workflows fit together.",
    content:
      "Beyond Simplicate we use Slack, Confluence/playbook hubs, Git, and other stack-specific tools per team. Prefer documented workflows when they exist.",
    tags: ["tools", "workflow", "productivity"],
    categorySlug: "tools",
    authorEmail: "employee@owow.example",
  },
];

const USER_SEEDS = [
  {
    email: "hr.admin@owow.example",
    fullName: "HR Admin",
    role: "HR_ADMIN",
  },
  {
    email: "employee@owow.example",
    fullName: "Employee User",
    role: "EMPLOYEE",
  },
  {
    email: "new.employee@owow.example",
    fullName: "New Employee User",
    role: "NEW_EMPLOYEE",
  },
];

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
    content:
      "Install core tools (email, Slack, Simplicate). Follow IT guidance.",
    articleSlug: "tools-and-workflows",
  },
  {
    order: 3,
    title: "Learn company culture",
    content: "Review our core values and how teams collaborate.",
    articleSlug: "core-values",
  },
  {
    order: 4,
    title: "Understand policies",
    content:
      "Skim policies that affect everyday work including remote guidelines.",
    articleSlug: "remote-work-policy",
  },
  {
    order: 5,
    title: "Meet your team",
    content:
      "Schedule intros with your lead and buddies. Continue with the welcome article.",
    articleSlug: "welcome-to-owow",
  },
];

async function upsertUsers() {
  const map = {};

  for (const u of USER_SEEDS) {
    const saved = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        fullName: u.fullName,
        role: u.role,
      },
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash: PASSWORD_HASH_PLACEHOLDER,
        role: u.role,
      },
    });
    map[u.email] = saved;
  }

  return map;
}

async function upsertCategories() {
  const map = {};

  for (const c of CATEGORY_SEEDS) {
    const saved = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
      },
      create: {
        name: c.name,
        slug: c.slug,
      },
    });
    map[c.slug] = saved;
  }

  return map;
}

async function upsertArticles(userByEmail, categoryBySlug) {
  const map = {};

  for (const a of ARTICLE_SEEDS) {
    const category = categoryBySlug[a.categorySlug];
    const author = userByEmail[a.authorEmail];

    if (!category || !author) {
      console.warn(`Skip article seed (missing refs): ${a.slug}`);
      continue;
    }

    const saved = await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        summary: a.summary,
        content: a.content,
        tags: a.tags,
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: author.id,
      },
      create: {
        slug: a.slug,
        title: a.title,
        summary: a.summary,
        content: a.content,
        tags: a.tags,
        status: "PUBLISHED",
        categoryId: category.id,
        authorId: author.id,
      },
    });
    map[a.slug] = saved;
  }

  return map;
}

async function upsertOnboardingSteps(articleBySlug) {
  for (const s of ONBOARDING_SEEDS) {
    const linked = s.articleSlug ? articleBySlug[s.articleSlug] : null;

    await prisma.onboardingStep.upsert({
      where: { order: s.order },
      update: {
        title: s.title,
        content: s.content,
        isActive: true,
        ...(linked ? { articleId: linked.id } : {}),
      },
      create: {
        order: s.order,
        title: s.title,
        content: s.content,
        isActive: true,
        ...(linked ? { articleId: linked.id } : {}),
      },
    });
  }
}

async function main() {
  const userByEmail = await upsertUsers();
  const categoryBySlug = await upsertCategories();
  const articleBySlug = await upsertArticles(userByEmail, categoryBySlug);

  await upsertOnboardingSteps(articleBySlug);

  console.log(
    `Seed OK: ${Object.keys(userByEmail).length} users, ` +
      `${Object.keys(categoryBySlug).length} categories, ` +
      `${Object.keys(articleBySlug).length} articles, onboarding steps 1-${ONBOARDING_SEEDS.length}.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
