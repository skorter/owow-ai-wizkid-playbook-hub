const { prisma } = require("../config/prisma");

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

const REPORT_DETAIL_INCLUDE = {
  user: USER_PUBLIC,
  article: ARTICLE_PUBLIC,
};

const MISSING_INFO_TYPES_CREATE = [
  "MISSING_ARTICLE",
  "OUTDATED_INFORMATION",
  "INCORRECT_INFORMATION",
  "OTHER",
];

const REPORT_STATUSES = ["OPEN", "REVIEWED", "RESOLVED"];

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

function toReportPayload(row) {
  if (!row) return null;
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    status: row.status,
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

function validateReportCreate(body) {
  const { type, title, description } = body || {};

  if (type == null || typeof type !== "string" || !type.trim()) {
    return "Type is required";
  }
  if (!MISSING_INFO_TYPES_CREATE.includes(type.trim())) {
    return "Invalid missing information type";
  }
  if (title == null || typeof title !== "string" || !title.trim()) {
    return "Title is required";
  }
  if (description == null || typeof description !== "string" || !description.trim()) {
    return "Description is required";
  }
  return null;
}

async function createMissingInfoReport(body, userId) {
  const err = validateReportCreate(body);
  if (err) return { error: { status: 400, message: err } };

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

  const row = await prisma.missingInfoReport.create({
    data: {
      type: body.type.trim(),
      title: body.title.trim(),
      description: body.description.trim(),
      articleId,
      userId,
    },
  });

  return {
    report: {
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      status: row.status,
      articleId: row.articleId,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    },
  };
}

async function listMissingInfoReports(filters) {
  const statusFilter =
    typeof filters?.status === "string" && filters.status.trim()
      ? filters.status.trim().toUpperCase()
      : null;

  if (statusFilter && !REPORT_STATUSES.includes(statusFilter)) {
    return { error: { status: 400, message: "Invalid status filter" } };
  }

  const where = statusFilter ? { status: statusFilter } : {};

  const rows = await prisma.missingInfoReport.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: REPORT_DETAIL_INCLUDE,
  });

  return { reports: rows.map(toReportPayload) };
}

async function getMissingInfoReportById(id) {
  const row = await prisma.missingInfoReport.findUnique({
    where: { id },
    include: REPORT_DETAIL_INCLUDE,
  });
  if (!row) return null;
  return toReportPayload(row);
}

function validateReportUpdate(body) {
  const data = {};

  if (body.type !== undefined) {
    if (body.type == null || typeof body.type !== "string" || !body.type.trim()) {
      return { error: "Type cannot be empty" };
    }
    const t = body.type.trim();
    if (!MISSING_INFO_TYPES_CREATE.includes(t)) {
      return { error: "Invalid missing information type" };
    }
    data.type = t;
  }

  if (body.title !== undefined) {
    if (body.title == null || typeof body.title !== "string" || !body.title.trim()) {
      return { error: "Title cannot be empty" };
    }
    data.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (
      body.description == null ||
      typeof body.description !== "string" ||
      !body.description.trim()
    ) {
      return { error: "Description cannot be empty" };
    }
    data.description = body.description.trim();
  }

  if (body.status !== undefined) {
    if (body.status == null || typeof body.status !== "string" || !body.status.trim()) {
      return { error: "Status cannot be empty" };
    }
    const s = body.status.trim().toUpperCase();
    if (!REPORT_STATUSES.includes(s)) {
      return { error: "Invalid status value" };
    }
    data.status = s;
  }

  if (body.articleId !== undefined) {
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

async function updateMissingInfoReport(id, body) {
  const existing = await prisma.missingInfoReport.findUnique({
    where: { id },
  });
  if (!existing) return { notFound: true };

  const parsed = validateReportUpdate(body);
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

  if (!Object.keys(data).length) {
    const full = await prisma.missingInfoReport.findUnique({
      where: { id },
      include: REPORT_DETAIL_INCLUDE,
    });
    return { report: toReportPayload(full) };
  }

  await prisma.missingInfoReport.update({
    where: { id },
    data,
  });

  const full = await prisma.missingInfoReport.findUnique({
    where: { id },
    include: REPORT_DETAIL_INCLUDE,
  });

  return { report: toReportPayload(full) };
}

async function deleteMissingInfoReport(id) {
  const existing = await prisma.missingInfoReport.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) return { notFound: true };

  await prisma.missingInfoReport.delete({ where: { id } });
  return { deleted: true };
}

module.exports = {
  createMissingInfoReport,
  listMissingInfoReports,
  getMissingInfoReportById,
  updateMissingInfoReport,
  deleteMissingInfoReport,
};
