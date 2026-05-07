const { prisma } = require("../config/prisma");

async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

async function getCategoryById(id) {
  return prisma.category.findUnique({
    where: { id },
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
};
