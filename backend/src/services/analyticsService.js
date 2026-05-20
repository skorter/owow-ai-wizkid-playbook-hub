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

const NO_RESULT_PHRASES = [
  "could not find this in the current playbook",
  "could not find enough information",
];

function isUnansweredSearchWhere() {
  return {
    OR: [
      { confidence: 0 },
      { fallback: true, sourceCount: 0 },
      { sourceCount: 0 },
      { answer: null },
      { answer: "" },
      ...NO_RESULT_PHRASES.map((phrase) => ({
        answer: { contains: phrase, mode: "insensitive" },
      })),
    ],
  };
}

function isAnsweredSearchWhere() {
  return {
    AND: [
      { answer: { not: null } },
      { NOT: { answer: "" } },
      {
        OR: [
          { confidence: { gt: 0 } },
          { sourceCount: { gt: 0 } },
          {
            AND: [
              { confidence: null },
              { sourceCount: null },
              { NOT: { answer: { contains: "could not find", mode: "insensitive" } } },
            ],
          },
        ],
      },
    ],
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

  const maxValue = Math.max(0, ...counts);
  const yMax = computeNiceYMax(maxValue);

  let peakHour = null;
  let peakInsight =
    "Peak usage data will appear as employees search the playbook.";
  if (maxValue > 0) {
    const peakIndex = counts.indexOf(maxValue);
    peakHour = `${String(peakIndex).padStart(2, "0")}:00`;
    const sorted = [...points].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 2).map((p) => p.label);
    if (top.length === 2) {
      peakInsight = `Most activity occurs around ${top[0]} and ${top[1]} (peak ${peakHour}).`;
    } else if (top.length === 1) {
      peakInsight = `Most activity occurs around ${top[0]} (peak ${peakHour}).`;
    }
  }

  return {
    points,
    yMax,
    yTicks: buildYTicks(yMax),
    insight: peakInsight,
    peakHour,
    peakCount: maxValue,
  };
}

async function getUnansweredQuestions(query) {
  const limit = parseLimit(query?.limit);

  const rows = await prisma.searchLog.findMany({
    where: isUnansweredSearchWhere(),
    orderBy: { createdAt: "desc" },
    take: Math.min(limit * 3, 100),
  });

  const seen = new Set();
  const items = [];

  for (const row of rows) {
    const q = row.question?.trim();
    if (!q || seen.has(q.toLowerCase())) continue;
    seen.add(q.toLowerCase());

    const sourceLabel =
      row.source === "AI_CHAT" ? "Ask Page" : "AI Search";

    items.push({
      id: row.id,
      question: q,
      category: sourceLabel,
      source: row.source,
      failedAttempts: 1,
      createdAt: row.createdAt,
    });

    if (items.length >= limit) break;
  }

  return { items, count: items.length };
}

async function getPerformanceAnalytics() {
  const [
    totalSearches,
    answeredSearches,
    totalFeedback,
    totalUsers,
    unansweredCount,
    publishedByCategory,
    onboardingActive,
    onboardingTotal,
    dailyUserRows,
    confidenceAgg,
    savedArticlesCount,
    publishedArticles,
    missingInfoCount,
  ] = await Promise.all([
    prisma.searchLog.count(),
    prisma.searchLog.count({ where: isAnsweredSearchWhere() }),
    prisma.feedback.count(),
    prisma.user.count(),
    prisma.searchLog.count({ where: isUnansweredSearchWhere() }),
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
    prisma.searchLog.aggregate({
      where: { confidence: { not: null, gt: 0 } },
      _avg: { confidence: true },
    }),
    prisma.savedArticle.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.missingInfoReport.count(),
  ]);

  const successRatePercent =
    totalSearches > 0 ? Math.round((answeredSearches / totalSearches) * 100) : 100;

  const dailyActiveUsers = dailyUserRows.length;

  const averageConfidence = confidenceAgg._avg.confidence
    ? Number(confidenceAgg._avg.confidence.toFixed(2))
    : 0;

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
    averageConfidence,
    avgResponseTimeLabel: null,
    dailyActiveUsers,
    unansweredCount,
    totalSearches,
    totalUsers,
    savedArticlesCount,
    publishedArticles,
    missingInfoCount,
    feedbackCount: totalFeedback,
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

async function getAdminAnalyticsDashboard() {
  const [usageTrends, peakHours, unanswered, performance, overview] =
    await Promise.all([
      getUsageTrends({ days: 7 }),
      getPeakHours(),
      getUnansweredQuestions({ limit: 10 }),
      getPerformanceAnalytics(),
      getOverviewAnalytics(),
    ]);

  const usageTrendsFormatted = usageTrends.points.map((p) => ({
    date: p.label,
    searches: p.searches,
    activeUsers: p.activeUsers,
  }));

  return {
    summary: {
      searchSuccessRate: performance.successRatePercent,
      averageConfidence: performance.averageConfidence,
      dailyActiveUsers: performance.dailyActiveUsers,
      unansweredCount: performance.unansweredCount,
      totalSearches: performance.totalSearches,
      savedArticlesCount: performance.savedArticlesCount,
    },
    usageTrends: usageTrendsFormatted,
    peakUsage: {
      hour: peakHours.peakHour,
      count: peakHours.peakCount ?? 0,
    },
    unansweredQuestions: unanswered.items,
    contentInsights: {
      topCategory:
        performance.cards[0]?.subtitle?.replace(" category", "") ??
        "Published content",
      publishedArticles: performance.publishedArticles,
      activeOnboardingPercent: performance.cards[1]?.value
        ? parseInt(String(performance.cards[1].value), 10)
        : 0,
      searchSuccessRate: performance.successRatePercent,
      missingInfoCount: performance.missingInfoCount,
      feedbackCount: performance.feedbackCount,
      totalArticles: overview.totalArticles,
    },
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
  getAdminAnalyticsDashboard,
};
