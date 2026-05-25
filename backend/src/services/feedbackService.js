const { prisma } = require("../config/prisma");

/** Public user shape for nested includes (never passwordHash). */
const USER_PUBLIC = {
  select: {
    id: true,
    fullName: true,
    email: true,
    role: true,
  },
};

const ARTICLE_PUBLIC = {
  select: {
    id: true,
    title: true,
    slug: true,
  },
};

const FEEDBACK_INCLUDE_DETAIL = {
  user: USER_PUBLIC,
  article: ARTICLE_PUBLIC,
};

const FEEDBACK_TYPES_CREATE = ["GENERAL", "ARTICLE", "AI_RESPONSE"];

function mapUserNested(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.fullName ?? null,
    email: user.email,
    role: user.role,
  };
}

function mapArticleNested(article) {
  if (!article) return null;
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
  };
}

function toFeedbackPayload(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    message: row.message,
    articleId: row.articleId,
    userId: row.userId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    user: row.user ? mapUserNested(row.user) : undefined,
    article: row.article ? mapArticleNested(row.article) : undefined,
  };
}

async function articleExists(id) {
  if (!id || typeof id !== "string") return false;
  const a = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });
  return !!a;
}

function validateFeedbackCreate(body) {
  const { type, message } = body || {};

  if (type == null || typeof type !== "string" || !type.trim()) {
    return "Type is required";
  }
  if (!FEEDBACK_TYPES_CREATE.includes(type.trim())) {
    return "Invalid feedback type";
  }
  if (message == null || typeof message !== "string" || !message.trim()) {
    return "Message is required";
  }
  return null;
}

async function createFeedback(body, userId) {
  const err = validateFeedbackCreate(body);
  if (err) return { error: { status: 400, message: err } };

  const msg = body.message.trim();
  const feedbackType = body.type.trim();

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

  const row = await prisma.feedback.create({
    data: {
      type: feedbackType,
      message: msg,
      articleId,
      userId,
    },
  });

  return {
    feedback: {
      id: row.id,
      type: row.type,
      message: row.message,
      articleId: row.articleId,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
  };
}

async function listFeedback() {
  const rows = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: FEEDBACK_INCLUDE_DETAIL,
  });
  return rows.map(toFeedbackPayload);
}

async function getFeedbackById(id) {
  const row = await prisma.feedback.findUnique({
    where: { id },
    include: FEEDBACK_INCLUDE_DETAIL,
  });
  if (!row) return null;
  return toFeedbackPayload(row);
}

function validateFeedbackUpdate(body) {
  const out = {};

  if (body.type !== undefined) {
    if (body.type == null || typeof body.type !== "string" || !body.type.trim()) {
      return { error: "Type cannot be empty" };
    }
    const t = body.type.trim();
    if (!FEEDBACK_TYPES_CREATE.includes(t)) {
      return { error: "Invalid feedback type" };
    }
    out.type = t;
  }

  if (body.message !== undefined) {
    if (body.message == null || typeof body.message !== "string" || !body.message.trim()) {
      return { error: "Message cannot be empty" };
    }
    out.message = body.message.trim();
  }

  if (body.articleId !== undefined) {
    if (body.articleId === null) {
      out.articleId = null;
    } else if (typeof body.articleId !== "string" || !body.articleId.trim()) {
      return { error: "Invalid article ID" };
    } else {
      out.articleId = body.articleId.trim();
    }
  }

  return { data: out };
}

async function updateFeedback(id, body) {
  const existing = await prisma.feedback.findUnique({ where: { id } });
  if (!existing) return { notFound: true };

  const parsed = validateFeedbackUpdate(body);
  if (parsed.error) {
    return { error: { status: 400, message: parsed.error } };
  }

  const data = parsed.data || {};
  if (!Object.keys(data).length) {
    const full = await prisma.feedback.findUnique({
      where: { id },
      include: FEEDBACK_INCLUDE_DETAIL,
    });
    return { feedback: toFeedbackPayload(full) };
  }

  if (data.articleId !== undefined && data.articleId !== null) {
    const ok = await articleExists(data.articleId);
    if (!ok) {
      return { error: { status: 400, message: "Article not found" } };
    }
  }

  await prisma.feedback.update({
    where: { id },
    data,
  });

  const full = await prisma.feedback.findUnique({
    where: { id },
    include: FEEDBACK_INCLUDE_DETAIL,
  });

  return { feedback: toFeedbackPayload(full) };
}

async function deleteFeedback(id) {
  const existing = await prisma.feedback.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { notFound: true };

  await prisma.feedback.delete({ where: { id } });
  return { deleted: true };
}

module.exports = {
  createFeedback,
  listFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};
