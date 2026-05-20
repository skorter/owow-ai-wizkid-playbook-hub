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

function parseDays(raw, fallback = 7) {
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, 90);
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatHourLabel(hour) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function computeNiceYMax(maxValue) {
  if (maxValue <= 0) return 10;
  const step = maxValue <= 20 ? 5 : maxValue <= 50 ? 10 : 20;
  return Math.ceil(maxValue / step) * step;
}

function buildYTicks(yMax) {
  const step = yMax <= 20 ? 5 : yMax <= 50 ? 10 : 20;
  const ticks = [];
  for (let v = 0; v <= yMax; v += step) {
    ticks.push(v);
  }
  return ticks.length ? ticks : [0, yMax];
}

function isUnansweredSearchWhere() {
  return {
    OR: [{ answer: null }, { answer: "" }],
  };
}

function isAnsweredSearchWhere() {
  return {
    AND: [{ answer: { not: null } }, { NOT: { answer: "" } }],
  };
}

async function getUsageTrends(query) {
  const days = parseDays(query?.days, 7);
  const today = startOfDay(new Date());
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));

  const logs = await prisma.searchLog.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true, userId: true },
  });

  const buckets = new Map();
  for (let i = 0; i < days; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, {
      label: formatShortDate(d),
      searches: 0,
      userIds: new Set(),
    });
  }

  for (const log of logs) {
    const key = startOfDay(log.createdAt).toISOString().slice(0, 10);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.searches += 1;
    if (log.userId) bucket.userIds.add(log.userId);
  }

  const points = Array.from(buckets.values()).map((bucket) => ({
    label: bucket.label,
    searches: bucket.searches,
    activeUsers: bucket.userIds.size,
  }));

  const maxValue = Math.max(
    0,
    ...points.map((p) => Math.max(p.searches, p.activeUsers)),
  );
  const yMax = computeNiceYMax(maxValue);

  return { points, yMax, yTicks: buildYTicks(yMax), days };
}

async function getPeakHours() {
  const logs = await prisma.searchLog.findMany({
    select: { createdAt: true },
  });

  const counts = Array.from({ length: 24 }, () => 0);
  for (const log of logs) {
    const hour = new Date(log.createdAt).getHours();
    counts[hour] += 1;
  }

  const businessHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const points = businessHours.map((hour) => ({
    label: formatHourLabel(hour),
    value: counts[hour],
    showLabel: hour % 2 === 0,
  }));

  const maxValue = Math.max(0, ...points.map((p) => p.value));
  const yMax = computeNiceYMax(maxValue);

  let peakInsight =
    "Peak usage data will appear as employees search the playbook.";
  if (maxValue > 0) {
    const sorted = [...points].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 2).map((p) => p.label);
    if (top.length === 2) {
      peakInsight = `Most activity occurs around ${top[0]} and ${top[1]}.`;
    } else if (top.length === 1) {
      peakInsight = `Most activity occurs around ${top[0]}.`;
    }
  }

  return { points, yMax, yTicks: buildYTicks(yMax), insight: peakInsight };
}

async function getUnansweredQuestions(query) {
  const limit = parseLimit(query?.limit);

  const groups = await prisma.searchLog.groupBy({
    by: ["question"],
    where: isUnansweredSearchWhere(),
    _count: { question: true },
    orderBy: { _count: { question: "desc" } },
    take: Math.min(limit * 5, 200),
  });

  const items = groups
    .filter((g) => g.question && String(g.question).trim().length > 0)
    .slice(0, limit)
    .map((g, index) => ({
      id: `unanswered-${index}-${g.question.slice(0, 24)}`,
      question: g.question.trim(),
      category: "Search",
      failedAttempts: g._count.question,
    }));

  return { items, count: items.length };
}

async function getPerformanceAnalytics() {
  const [
    totalSearches,
    answeredSearches,
    totalFeedback,
    totalUsers,
    unansweredGroups,
    publishedByCategory,
    onboardingActive,
    onboardingTotal,
    dailyUserRows,
  ] = await Promise.all([
    prisma.searchLog.count(),
    prisma.searchLog.count({ where: isAnsweredSearchWhere() }),
    prisma.feedback.count(),
    prisma.user.count(),
    prisma.searchLog.groupBy({
      by: ["question"],
      where: isUnansweredSearchWhere(),
      _count: { question: true },
    }),
    prisma.article.groupBy({
      by: ["categoryId"],
      where: { status: "PUBLISHED" },
      _count: { _all: true },
      orderBy: { _count: { categoryId: "desc" } },
      take: 1,
    }),
    prisma.onboardingStep.count({ where: { isActive: true } }),
    prisma.onboardingStep.count(),
    prisma.searchLog.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        userId: { not: null },
      },
      select: { userId: true },
      distinct: ["userId"],
    }),
  ]);

  const successRatePercent =
    totalSearches > 0 ? Math.round((answeredSearches / totalSearches) * 100) : 0;

  const unansweredCount = unansweredGroups.reduce(
    (sum, g) => sum + g._count.question,
    0,
  );

  const dailyActiveUsers = dailyUserRows.length;

  let topCategoryName = "Published content";
  let topCategoryValue = `${publishedByCategory[0]?._count._all ?? 0} articles`;
  if (publishedByCategory[0]?.categoryId) {
    const cat = await prisma.category.findUnique({
      where: { id: publishedByCategory[0].categoryId },
      select: { name: true },
    });
    if (cat?.name) {
      topCategoryName = cat.name;
      topCategoryValue = `${publishedByCategory[0]._count._all} published`;
    }
  }

  const onboardingRate =
    onboardingTotal > 0
      ? Math.round((onboardingActive / onboardingTotal) * 100)
      : 0;

  const satisfactionPercent =
    totalFeedback > 0 && totalSearches > 0
      ? Math.min(100, Math.round((answeredSearches / totalSearches) * 100))
      : totalSearches > 0
        ? successRatePercent
        : 0;

  return {
    successRatePercent,
    avgResponseTimeLabel: null,
    dailyActiveUsers,
    unansweredCount,
    totalSearches,
    totalUsers,
    cards: [
      {
        id: "perf-top",
        title: "Top Performing",
        subtitle: `${topCategoryName} category`,
        value: topCategoryValue,
        accent: "green",
      },
      {
        id: "perf-growing",
        title: "Active Onboarding",
        subtitle: "Steps enabled",
        value: `${onboardingRate}%`,
        accent: "cyan",
      },
      {
        id: "perf-satisfaction",
        title: "Search Success",
        subtitle: "Answered searches",
        value: `${satisfactionPercent}%`,
        accent: "purple",
      },
    ],
  };
}

module.exports = {
  parseLimit,
  parseDays,
  getOverviewAnalytics,
  getSearchAnalytics,
  getPopularQuestions,
  getFeedbackAnalytics,
  getMissingInfoAnalytics,
  getUsageTrends,
  getPeakHours,
  getUnansweredQuestions,
  getPerformanceAnalytics,
};
