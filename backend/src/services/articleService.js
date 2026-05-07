const { prisma } = require("../config/prisma");

const ARTICLE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

const articleIncludePublic = {
  category: true,
  author: {
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
    },
  },
};

function normalizeSlug(slug) {
  if (slug == null || typeof slug !== "string") return "";
  return slug.trim().toLowerCase();
}

function buildPublishedListWhere(filters) {
  const { category: categoryRaw, search: searchRaw } = filters || {};
  const andParts = [];

  const categoryTrim =
    typeof categoryRaw === "string" ? categoryRaw.trim() : "";
  if (categoryTrim) {
    const catNorm = categoryTrim.toLowerCase();
    andParts.push({
      category: {
        OR: [
          { slug: { equals: catNorm, mode: "insensitive" } },
          { slug: { contains: categoryTrim, mode: "insensitive" } },
          { name: { contains: categoryTrim, mode: "insensitive" } },
        ],
      },
    });
  }

  const searchTrim = typeof searchRaw === "string" ? searchRaw.trim() : "";
  if (searchTrim) {
    andParts.push({
      OR: [
        { title: { contains: searchTrim, mode: "insensitive" } },
        { summary: { contains: searchTrim, mode: "insensitive" } },
        { content: { contains: searchTrim, mode: "insensitive" } },
        {
          category: {
            slug: { contains: searchTrim, mode: "insensitive" },
          },
        },
        {
          category: {
            name: { contains: searchTrim, mode: "insensitive" },
          },
        },
      ],
    });
  }

  return {
    status: "PUBLISHED",
    ...(andParts.length ? { AND: andParts } : {}),
  };
}

async function categoryExists(categoryId) {
  if (!categoryId || typeof categoryId !== "string") return null;
  const c = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  return c;
}

function validateStatus(status) {
  if (typeof status !== "string" || !ARTICLE_STATUSES.includes(status)) {
    return false;
  }
  return true;
}

function coerceTags(tags) {
  if (tags === undefined || tags === null) return undefined;
  if (!Array.isArray(tags)) return { error: true, message: "Tags must be an array" };
  const out = [];
  for (const t of tags) {
    if (typeof t !== "string" || !t.trim()) continue;
    out.push(t.trim());
  }
  return { tags: out };
}

async function getAllArticles(filters) {
  const where = buildPublishedListWhere(filters);
  return prisma.article.findMany({
    where,
    include: articleIncludePublic,
    orderBy: { createdAt: "desc" },
  });
}

async function getArticleById(id) {
  return prisma.article.findFirst({
    where: { id, status: "PUBLISHED" },
    include: articleIncludePublic,
  });
}

async function getArticleBySlug(slugParam) {
  const slug = normalizeSlug(slugParam);
  if (!slug) return null;
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: articleIncludePublic,
  });
}

function validateCreateBody(body) {
  const missing = [];

  const { title, slug, summary, content, categoryId } = body || {};

  if (title == null || typeof title !== "string" || !title.trim()) {
    missing.push("title");
  }
  if (slug == null || typeof slug !== "string" || !slug.trim()) {
    missing.push("slug");
  }
  if (summary == null || typeof summary !== "string" || !summary.trim()) {
    missing.push("summary");
  }
  if (content == null || typeof content !== "string" || !content.trim()) {
    missing.push("content");
  }
  if (categoryId == null || typeof categoryId !== "string" || !categoryId.trim()) {
    missing.push("categoryId");
  }

  if (missing.length) {
    const label = missing.join(", ");
    return {
      error: {
        status: 400,
        message: `Missing or invalid required field(s): ${label}`,
      },
    };
  }

  let statusToUse = "DRAFT";
  if (body.status !== undefined && body.status !== null) {
    if (typeof body.status !== "string" || !validateStatus(body.status)) {
      return {
        error: {
          status: 400,
          message: `Status must be one of: ${ARTICLE_STATUSES.join(", ")}`,
        },
      };
    }
    statusToUse = body.status;
  }

  const tagsResult = coerceTags(body.tags);
  if (tagsResult && tagsResult.error) {
    return { error: { status: 400, message: tagsResult.message } };
  }

  const tags = tagsResult && tagsResult.tags !== undefined ? tagsResult.tags : [];

  return {
    data: {
      title: title.trim(),
      slug: normalizeSlug(slug),
      summary: summary.trim(),
      content: content.trim(),
      categoryId: categoryId.trim(),
      status: statusToUse,
      tags,
    },
  };
}

async function createArticle(body, authorId) {
  const validated = validateCreateBody(body);
  if (validated.error) {
    return validated;
  }

  const draft = validated.data;

  if (!draft.slug) {
    return {
      error: { status: 400, message: "Slug cannot be empty" },
    };
  }

  const cat = await categoryExists(draft.categoryId);
  if (!cat) {
    return {
      error: { status: 404, message: "Category not found" },
    };
  }

  try {
    const article = await prisma.article.create({
      data: {
        title: draft.title,
        slug: draft.slug,
        summary: draft.summary,
        content: draft.content,
        tags: draft.tags.length ? draft.tags : [],
        status: draft.status,
        categoryId: draft.categoryId,
        authorId: authorId || null,
      },
      include: articleIncludePublic,
    });
    return { article };
  } catch (err) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta.target : [];
      if (target.includes("slug")) {
        return {
          error: {
            status: 400,
            message: "An article with this slug already exists",
          },
        };
      }
    }
    throw err;
  }
}

async function updateArticle(id, body) {
  const existing = await prisma.article.findUnique({
    where: { id },
  });

  if (!existing) {
    return { notFound: true };
  }

  const data = {};

  if (body && Object.prototype.hasOwnProperty.call(body, "title")) {
    const { title } = body;
    if (typeof title !== "string" || !title.trim()) {
      return {
        error: { status: 400, message: "Title cannot be empty" },
      };
    }
    data.title = title.trim();
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "slug")) {
    const { slug } = body;
    if (slug == null || typeof slug !== "string" || !slug.trim()) {
      return {
        error: { status: 400, message: "Slug cannot be empty" },
      };
    }
    const norm = normalizeSlug(slug);
    if (!norm) {
      return {
        error: { status: 400, message: "Slug cannot be empty" },
      };
    }
    data.slug = norm;
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "summary")) {
    const { summary } = body;
    if (summary == null || typeof summary !== "string" || !summary.trim()) {
      return {
        error: { status: 400, message: "Summary cannot be empty" },
      };
    }
    data.summary = summary.trim();
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "content")) {
    const { content } = body;
    if (content == null || typeof content !== "string" || !content.trim()) {
      return {
        error: { status: 400, message: "Content cannot be empty" },
      };
    }
    data.content = content.trim();
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "tags")) {
    const tagsResult = coerceTags(body.tags);
    if (tagsResult && tagsResult.error) {
      return { error: { status: 400, message: tagsResult.message } };
    }
    data.tags =
      tagsResult && tagsResult.tags !== undefined ? tagsResult.tags : [];
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "status")) {
    const { status } = body;
    if (typeof status !== "string" || !validateStatus(status)) {
      return {
        error: {
          status: 400,
          message: `Status must be one of: ${ARTICLE_STATUSES.join(", ")}`,
        },
      };
    }
    data.status = status;
  }

  if (body && Object.prototype.hasOwnProperty.call(body, "categoryId")) {
    const { categoryId } = body;
    if (typeof categoryId !== "string" || !categoryId.trim()) {
      return {
        error: { status: 400, message: "categoryId cannot be empty" },
      };
    }
    const cat = await categoryExists(categoryId.trim());
    if (!cat) {
      return {
        error: { status: 404, message: "Category not found" },
      };
    }
    data.categoryId = categoryId.trim();
  }

  if (Object.keys(data).length === 0) {
    const article = await prisma.article.findUnique({
      where: { id },
      include: articleIncludePublic,
    });
    return { article };
  }

  try {
    const article = await prisma.article.update({
      where: { id },
      data,
      include: articleIncludePublic,
    });
    return { article };
  } catch (err) {
    if (err.code === "P2002") {
      const target = Array.isArray(err.meta?.target) ? err.meta.target : [];
      if (target.includes("slug")) {
        return {
          error: {
            status: 400,
            message: "An article with this slug already exists",
          },
        };
      }
    }
    if (err.code === "P2025") {
      return { notFound: true };
    }
    throw err;
  }
}

async function deleteArticle(id) {
  const existing = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { notFound: true };
  }

  await prisma.article.delete({ where: { id } });
  return { deleted: true };
}

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
};
