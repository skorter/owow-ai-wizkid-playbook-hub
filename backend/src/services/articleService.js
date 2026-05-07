const { prisma } = require("../config/prisma");

const articleInclude = {
  category: true,
  author: {
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

async function getAllArticles() {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: articleInclude,
    orderBy: { createdAt: "desc" },
  });
}

async function getArticleById(id) {
  return prisma.article.findFirst({
    where: { id, status: "PUBLISHED" },
    include: articleInclude,
  });
}

async function getArticleBySlug(slug) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: articleInclude,
  });
}

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
};
