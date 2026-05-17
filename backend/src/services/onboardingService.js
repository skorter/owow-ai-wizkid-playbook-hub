const { prisma } = require("../config/prisma");

const ARTICLE_SUMMARY_FIELDS = {
  select: {
    id: true,
    title: true,
    slug: true,
    summary: true,
  },
};

const STEP_INCLUDE = {
  article: ARTICLE_SUMMARY_FIELDS,
};

function mapStep(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    order: row.order,
    isActive: row.isActive,
    articleId: row.articleId,
    article: row.article ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function wantsIncludeInactive(user, query) {
  if (!user || user.role !== "HR_ADMIN") return false;
  const v = query && query.includeInactive;
  if (v === true) return true;
  if (typeof v === "string" && v.toLowerCase() === "true") return true;
  return false;
}

async function articleExists(id) {
  if (!id || typeof id !== "string") return false;
  const a = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });
  return !!a;
}

function validateCreateBody(body) {
  const { title, content, order } = body || {};

  if (title == null || typeof title !== "string" || !title.trim()) {
    return { message: "Title is required" };
  }
  if (content == null || typeof content !== "string" || !content.trim()) {
    return { message: "Content is required" };
  }
  if (order === undefined || order === null) {
    return { message: "Order is required" };
  }
  const n = Number(order);
  if (!Number.isInteger(n) || n < 1) {
    return { message: "Order must be a positive integer" };
  }

  if (Object.prototype.hasOwnProperty.call(body, "isActive")) {
    if (typeof body.isActive !== "boolean") {
      return { message: "isActive must be a boolean" };
    }
  }

  return null;
}

async function getOnboardingSteps(user, query) {
  const includeInactive = wantsIncludeInactive(user, query);

  const where = includeInactive ? {} : { isActive: true };

  const rows = await prisma.onboardingStep.findMany({
    where,
    include: STEP_INCLUDE,
    orderBy: { order: "asc" },
  });

  return rows.map(mapStep);
}

async function getOnboardingStepById(id, user) {
  const row = await prisma.onboardingStep.findUnique({
    where: { id },
    include: STEP_INCLUDE,
  });

  if (!row) return { notFound: true };

  const isLimited =
    user &&
    (user.role === "EMPLOYEE" || user.role === "NEW_EMPLOYEE");

  if (isLimited && !row.isActive) {
    return { notFound: true };
  }

  return { step: mapStep(row) };
}

async function createOnboardingStep(body) {
  const err = validateCreateBody(body);
  if (err) return { error: { status: 400, message: err.message } };

  let articleId = null;
  if (body.articleId !== undefined && body.articleId !== null) {
    if (typeof body.articleId !== "string" || !body.articleId.trim()) {
      return { error: { status: 400, message: "Invalid article ID" } };
    }
    articleId = body.articleId.trim();
    const ok = await articleExists(articleId);
    if (!ok) {
      return { error: { status: 400, message: "Article not found" } };
    }
  }

  const order = Number(body.order);
  const isActive =
    Object.prototype.hasOwnProperty.call(body, "isActive") &&
    typeof body.isActive === "boolean"
      ? body.isActive
      : true;

  try {
    const row = await prisma.onboardingStep.create({
      data: {
        title: body.title.trim(),
        content: body.content.trim(),
        order,
        isActive,
        articleId,
      },
      include: STEP_INCLUDE,
    });
    return { step: mapStep(row) };
  } catch (e) {
    if (e.code === "P2002") {
      return {
        error: {
          status: 400,
          message: "An onboarding step with this order already exists",
        },
      };
    }
    throw e;
  }
}

function validateUpdateBody(body) {
  const data = {};

  if (Object.prototype.hasOwnProperty.call(body, "title")) {
    if (body.title == null || typeof body.title !== "string" || !body.title.trim()) {
      return { error: "Title cannot be empty" };
    }
    data.title = body.title.trim();
  }

  if (Object.prototype.hasOwnProperty.call(body, "content")) {
    if (
      body.content == null ||
      typeof body.content !== "string" ||
      !body.content.trim()
    ) {
      return { error: "Content cannot be empty" };
    }
    data.content = body.content.trim();
  }

  if (Object.prototype.hasOwnProperty.call(body, "order")) {
    if (body.order === undefined || body.order === null) {
      return { error: "Order must be a positive integer" };
    }
    const n = Number(body.order);
    if (!Number.isInteger(n) || n < 1) {
      return { error: "Order must be a positive integer" };
    }
    data.order = n;
  }

  if (Object.prototype.hasOwnProperty.call(body, "isActive")) {
    if (typeof body.isActive !== "boolean") {
      return { error: "isActive must be a boolean" };
    }
    data.isActive = body.isActive;
  }

  if (Object.prototype.hasOwnProperty.call(body, "articleId")) {
    if (body.articleId === null) {
      data.articleId = null;
    } else if (typeof body.articleId !== "string" || !body.articleId.trim()) {
      return { error: "Invalid article ID" };
    } else {
      data.articleId = body.articleId.trim();
    }
  }

  return { data };
}

async function updateOnboardingStep(id, body) {
  const existing = await prisma.onboardingStep.findUnique({ where: { id } });
  if (!existing) return { notFound: true };

  const parsed = validateUpdateBody(body || {});
  if (parsed.error) {
    return { error: { status: 400, message: parsed.error } };
  }

  const data = parsed.data || {};
  if (data.articleId !== undefined && data.articleId !== null) {
    const ok = await articleExists(data.articleId);
    if (!ok) {
      return { error: { status: 400, message: "Article not found" } };
    }
  }

  if (Object.keys(data).length === 0) {
    const row = await prisma.onboardingStep.findUnique({
      where: { id },
      include: STEP_INCLUDE,
    });
    return { step: mapStep(row) };
  }

  try {
    const row = await prisma.onboardingStep.update({
      where: { id },
      data,
      include: STEP_INCLUDE,
    });
    return { step: mapStep(row) };
  } catch (e) {
    if (e.code === "P2002") {
      return {
        error: {
          status: 400,
          message: "An onboarding step with this order already exists",
        },
      };
    }
    if (e.code === "P2025") {
      return { notFound: true };
    }
    throw e;
  }
}

async function deleteOnboardingStep(id) {
  const existing = await prisma.onboardingStep.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { notFound: true };

  await prisma.onboardingStep.delete({ where: { id } });
  return { deleted: true };
}

module.exports = {
  getOnboardingSteps,
  getOnboardingStepById,
  createOnboardingStep,
  updateOnboardingStep,
  deleteOnboardingStep,
};
