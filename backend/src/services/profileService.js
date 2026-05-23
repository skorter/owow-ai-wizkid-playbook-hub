const { prisma } = require("../config/prisma");

const DEFAULT_ACTIVITY_LIMIT = 8;
const MAX_ACTIVITY_LIMIT = 100;

function parseActivityLimit(raw, fallback = DEFAULT_ACTIVITY_LIMIT) {
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(n, MAX_ACTIVITY_LIMIT);
}

const NO_RESULT_SNIPPETS = [
  "could not find this in the current playbook",
  "could not find enough information",
];

function buildAnswerPreview(answer, maxLen = 140) {
  const text = (answer || "").trim();
  if (!text) return null;
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trim()}…`;
}

function mapActivityItem(row) {
  const isSearch = row.source === "PLAYBOOK_SEARCH";
  return {
    id: row.id,
    type: isSearch ? "AI_SEARCH" : "AI_CHAT",
    title: isSearch ? "AI Search" : "Asked on article",
    question: row.question,
    answerPreview: buildAnswerPreview(row.answer),
    articleTitle: row.articleTitle ?? null,
    articleSlug: null,
    articleId: row.articleId ?? null,
    confidence: row.confidence ?? null,
    sourceCount: row.sourceCount ?? (isSearch ? 0 : 1),
    createdAt: row.createdAt,
  };
}

async function enrichArticleSlugs(items) {
  const ids = [
    ...new Set(items.map((i) => i.articleId).filter((id) => id && typeof id === "string")),
  ];
  if (!ids.length) {
    return items.map(({ articleId, ...rest }) => rest);
  }

  const articles = await prisma.article.findMany({
    where: { id: { in: ids }, status: "PUBLISHED" },
    select: { id: true, slug: true, title: true },
  });
  const byId = new Map(articles.map((a) => [a.id, a]));

  return items.map((item) => {
    const { articleId, ...rest } = item;
    const article = articleId ? byId.get(articleId) : null;
    if (!article) return rest;
    return {
      ...rest,
      articleSlug: article.slug,
      articleTitle: rest.articleTitle || article.title,
    };
  });
}

async function getProfileActivity(userId, limit = DEFAULT_ACTIVITY_LIMIT) {
  if (!userId) {
    return { items: [] };
  }

  const take = parseActivityLimit(limit, DEFAULT_ACTIVITY_LIMIT);

  const rows = await prisma.searchLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });

  const items = await enrichArticleSlugs(rows.map(mapActivityItem));

  return { items };
}

async function getAverageConfidence(userId) {
  const agg = await prisma.searchLog.aggregate({
    where: {
      userId,
      confidence: { not: null },
    },
    _avg: { confidence: true },
    _count: { _all: true },
  });

  if (!agg._count._all) return null;
  const avg = agg._avg.confidence ?? 0;
  return Number(avg.toFixed(2));
}

async function getTopCategoryForUser(userId) {
  const logs = await prisma.searchLog.findMany({
    where: {
      userId,
      source: "PLAYBOOK_SEARCH",
      sourceCount: { gt: 0 },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { answer: true },
  });

  if (!logs.length) return null;

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: { select: { name: true } } },
    take: 200,
  });

  const categoryHits = new Map();
  for (const article of articles) {
    const cat = article.category?.name;
    if (!cat) continue;
    const blob = `${article.title} ${article.summary || ""}`.toLowerCase();
    for (const log of logs) {
      const q = (log.answer || "").toLowerCase();
      if (q.includes(article.title.toLowerCase()) || q.includes(blob.slice(0, 40))) {
        categoryHits.set(cat, (categoryHits.get(cat) || 0) + 1);
      }
    }
  }

  if (!categoryHits.size) {
    const topPublished = await prisma.category.findFirst({
      orderBy: { articles: { _count: "desc" } },
      select: { name: true },
    });
    return topPublished?.name ?? null;
  }

  const sorted = [...categoryHits.entries()].sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
}

async function getProfileInsights(userId) {
  const [
    totalSearches,
    totalAskPageQuestions,
    savedArticlesCount,
    averageConfidence,
  ] = await Promise.all([
    userId
      ? prisma.searchLog.count({
          where: { userId, source: "PLAYBOOK_SEARCH" },
        })
      : 0,
    userId
      ? prisma.searchLog.count({
          where: { userId, source: "AI_CHAT" },
        })
      : 0,
    userId
      ? prisma.savedArticle.count({
          where: { userId, article: { status: "PUBLISHED" } },
        })
      : 0,
    userId ? getAverageConfidence(userId) : null,
  ]);

  const topCategory = userId ? await getTopCategoryForUser(userId) : null;

  return {
    totalSearches,
    totalAskPageQuestions,
    averageConfidence: averageConfidence ?? 0,
    topCategory,
    savedArticlesCount,
    onboardingProgress: null,
  };
}

module.exports = {
  parseActivityLimit,
  getProfileActivity,
  getProfileInsights,
  buildAnswerPreview,
  NO_RESULT_SNIPPETS,
};
