const { prisma } = require("../config/prisma");
const { getArticleById } = require("./articleService");

function mapSavedArticle(row) {
  const article = row.article;
  return {
    id: row.id,
    articleId: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary ?? undefined,
    category: article.category?.name ?? undefined,
    savedAt: row.createdAt,
  };
}

async function listSavedArticles(userId) {
  if (!userId) {
    return { items: [] };
  }

  const rows = await prisma.savedArticle.findMany({
    where: {
      userId,
      article: { status: "PUBLISHED" },
    },
    include: {
      article: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { items: rows.map(mapSavedArticle) };
}

async function saveArticleForUser(userId, articleId) {
  if (!userId || !articleId) {
    return { error: { status: 400, message: "Article id is required." } };
  }

  const article = await getArticleById(articleId);
  if (!article) {
    return { error: { status: 404, message: "Article not found." } };
  }

  const existing = await prisma.savedArticle.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });

  if (existing) {
    const row = await prisma.savedArticle.findUnique({
      where: { id: existing.id },
      include: {
        article: { include: { category: { select: { id: true, name: true, slug: true } } } },
      },
    });
    return { item: mapSavedArticle(row), alreadySaved: true };
  }

  const row = await prisma.savedArticle.create({
    data: { userId, articleId },
    include: {
      article: {
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  });

  return { item: mapSavedArticle(row), alreadySaved: false };
}

async function removeSavedArticle(userId, articleId) {
  if (!userId || !articleId) {
    return { error: { status: 400, message: "Article id is required." } };
  }

  const existing = await prisma.savedArticle.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });

  if (!existing) {
    return { error: { status: 404, message: "Saved article not found." } };
  }

  await prisma.savedArticle.delete({
    where: { id: existing.id },
  });

  return { deleted: true };
}

async function isArticleSavedByUser(userId, articleId) {
  if (!userId || !articleId) return false;
  const row = await prisma.savedArticle.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
  return !!row;
}

module.exports = {
  listSavedArticles,
  saveArticleForUser,
  removeSavedArticle,
  isArticleSavedByUser,
};
