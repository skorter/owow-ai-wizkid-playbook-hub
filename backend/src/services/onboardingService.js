const { prisma } = require("../config/prisma");

async function getAllOnboardingSteps() {
  return prisma.onboardingStep.findMany({
    where: { isActive: true },
    include: {
      article: {
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          tags: true,
          status: true,
          categoryId: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });
}

module.exports = {
  getAllOnboardingSteps,
};
