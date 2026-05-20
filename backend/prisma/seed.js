const path = require("path");
const bcrypt = require("bcryptjs");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { prisma } = require("../src/config/prisma");

/** Demo login password for seeded users — matches bcrypt used by POST /api/auth/login */
const SEED_USER_PASSWORD = "Password123";

function getSeedSaltRounds() {
  const raw = process.env.BCRYPT_SALT_ROUNDS;
  const n = raw != null ? parseInt(String(raw), 10) : 10;
  return Number.isFinite(n) && n > 0 ? n : 10;
}

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

const { ARTICLE_SEEDS, ONBOARDING_SEEDS } = require("./showcaseArticles");

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

async function upsertUsers() {
  const map = {};

  const passwordHash = await bcrypt.hash(
    SEED_USER_PASSWORD,
    getSeedSaltRounds(),
  );

  for (const u of USER_SEEDS) {
    const saved = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        fullName: u.fullName,
        role: u.role,
        passwordHash,
      },
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash,
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
