const { prisma } = require("../config/prisma");

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const USER_SAFE = {
  select: {
    id: true,
    fullName: true,
    email: true,
    role: true,
  },
};

const ARTICLE_BASIC = {
  select: {
    id: true,
    title: true,
    slug: true,
  },
};

function parseLimit(raw) {
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(n, MAX_LIMIT);
}

function mapUserSafe(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.fullName ?? null,
    email: user.email,
    role: user.role,
  };
}

async function getOverviewAnalytics() {
  const [
    totalUsers,
    totalCategories,
    totalArticles,
    totalPublishedArticles,
    totalDraftArticles,
    totalArchivedArticles,
    totalSearches,
    totalFeedback,
    totalMissingInfoReports,
    openMissingInfoReports,
    reviewedMissingInfoReports,
    resolvedMissingInfoReports,
    activeOnboardingSteps,
    inactiveOnboardingSteps,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "ARCHIVED" } }),
    prisma.searchLog.count(),
    prisma.feedback.count(),
    prisma.missingInfoReport.count(),
    prisma.missingInfoReport.count({ where: { status: "OPEN" } }),
    prisma.missingInfoReport.count({ where: { status: "REVIEWED" } }),
    prisma.missingInfoReport.count({ where: { status: "RESOLVED" } }),
    prisma.onboardingStep.count({ where: { isActive: true } }),
    prisma.onboardingStep.count({ where: { isActive: false } }),
  ]);

  return {
    totalUsers,
    totalCategories,
    totalArticles,
    totalPublishedArticles,
    totalDraftArticles,
    totalArchivedArticles,
    totalSearches,
    totalFeedback,
    totalMissingInfoReports,
    openMissingInfoReports,
    reviewedMissingInfoReports,
    resolvedMissingInfoReports,
    activeOnboardingSteps,
    inactiveOnboardingSteps,
  };
}

async function getSearchAnalytics(query) {
  const limit = parseLimit(query?.limit);
  const totalSearches = await prisma.searchLog.count();

  const rows = await prisma.searchLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: USER_SAFE,
    },
  });

  const recentSearches = rows.map((r) => ({
    id: r.id,
    query: r.question,
    createdAt: r.createdAt,
    user: mapUserSafe(r.user),
  }));

  return {
    totalSearches,
    recentSearches,
  };
}

async function getPopularQuestions(query) {
  const limit = parseLimit(query?.limit);

  const groups = await prisma.searchLog.groupBy({
    by: ["question"],
    where: {
      question: { not: "" },
    },
    _count: { question: true },
    orderBy: { _count: { question: "desc" } },
    take: Math.min(limit * 5, 200),
  });

  const filtered = groups
    .filter((g) => g.question && String(g.question).trim().length > 0)
    .slice(0, limit)
    .map((g) => ({
      query: g.question.trim(),
      count: g._count.question,
    }));

  return filtered;
}

async function getFeedbackAnalytics(query) {
  const limit = parseLimit(query?.limit);
  const totalFeedback = await prisma.feedback.count();

  const byTypeRaw = await prisma.feedback.groupBy({
    by: ["type"],
    _count: { _all: true },
    orderBy: { type: "asc" },
  });

  const feedbackByType = byTypeRaw.map((g) => ({
    type: g.type,
    count: g._count._all,
  }));

  const recentRows = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: USER_SAFE,
      article: ARTICLE_BASIC,
    },
  });

  const recentFeedback = recentRows.map((r) => ({
    id: r.id,
    type: r.type,
    message: r.message,
    createdAt: r.createdAt,
    article: r.article
      ? { id: r.article.id, title: r.article.title, slug: r.article.slug }
      : null,
    user: mapUserSafe(r.user),
  }));

  return {
    totalFeedback,
    feedbackByType,
    recentFeedback,
  };
}

async function getMissingInfoAnalytics(query) {
  const limit = parseLimit(query?.limit);

  const totalMissingInfoReports = await prisma.missingInfoReport.count();
  const openMissingInfoReports = await prisma.missingInfoReport.count({
    where: { status: "OPEN" },
  });

  const byStatusRaw = await prisma.missingInfoReport.groupBy({
    by: ["status"],
    _count: { _all: true },
    orderBy: { status: "asc" },
  });

  const missingInfoByStatus = byStatusRaw.map((g) => ({
    status: g.status,
    count: g._count._all,
  }));

  const byTypeRaw = await prisma.missingInfoReport.groupBy({
    by: ["type"],
    _count: { _all: true },
    orderBy: { type: "asc" },
  });

  const missingInfoByType = byTypeRaw.map((g) => ({
    type: g.type,
    count: g._count._all,
  }));

  const recentRows = await prisma.missingInfoReport.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: USER_SAFE,
      article: ARTICLE_BASIC,
    },
  });

  const recentMissingInfoReports = recentRows.map((r) => ({
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.description,
    status: r.status,
    createdAt: r.createdAt,
    article: r.article
      ? { id: r.article.id, title: r.article.title, slug: r.article.slug }
      : null,
    user: mapUserSafe(r.user),
  }));

  return {
    totalMissingInfoReports,
    openMissingInfoReports,
    missingInfoByStatus,
    missingInfoByType,
    recentMissingInfoReports,
  };
}

module.exports = {
  parseLimit,
  getOverviewAnalytics,
  getSearchAnalytics,
  getPopularQuestions,
  getFeedbackAnalytics,
  getMissingInfoAnalytics,
};
