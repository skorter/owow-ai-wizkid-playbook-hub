const { prisma } = require("../config/prisma");

function parseUniqueTarget(err) {
  const t = err.meta?.target;
  if (Array.isArray(t)) return t;
  if (typeof t === "string") return [t];
  return [];
}

function uniqueConstraintMessage(err) {
  const target = parseUniqueTarget(err);
  if (target.includes("slug")) {
    return "A category with this slug already exists";
  }
  if (target.includes("name")) {
    return "A category with this name already exists";
  }
  return "A category with this value already exists";
}

function validateCreatePayload(body) {
  const { name, slug } = body || {};

  if (name == null || typeof name !== "string" || !name.trim()) {
    return { status: 400, message: "Name is required" };
  }

  if (slug == null || typeof slug !== "string" || !slug.trim()) {
    return { status: 400, message: "Slug is required" };
  }

  return null;
}

function normalizeName(name) {
  return name.trim();
}

function normalizeSlug(slug) {
  return slug.trim().toLowerCase();
}

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

async function createCategory(body) {
  const validationError = validateCreatePayload(body);
  if (validationError) {
    return { error: validationError };
  }

  const name = normalizeName(body.name);
  const slug = normalizeSlug(body.slug);

  if (!name) {
    return { error: { status: 400, message: "Name cannot be empty" } };
  }
  if (!slug) {
    return { error: { status: 400, message: "Slug cannot be empty" } };
  }

  try {
    const category = await prisma.category.create({
      data: { name, slug },
    });
    return { category };
  } catch (err) {
    if (err.code === "P2002") {
      return {
        error: { status: 400, message: uniqueConstraintMessage(err) },
      };
    }
    throw err;
  }
}

async function updateCategory(id, body) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { notFound: true };
  }

  const data = {};
  if (Object.prototype.hasOwnProperty.call(body || {}, "name")) {
    const { name } = body;
    if (name == null || typeof name !== "string" || !name.trim()) {
      return {
        error: { status: 400, message: "Name cannot be empty" },
      };
    }
    data.name = normalizeName(name);
    if (!data.name) {
      return {
        error: { status: 400, message: "Name cannot be empty" },
      };
    }
  }

  if (Object.prototype.hasOwnProperty.call(body || {}, "slug")) {
    const { slug } = body;
    if (slug == null || typeof slug !== "string" || !slug.trim()) {
      return {
        error: { status: 400, message: "Slug cannot be empty" },
      };
    }
    data.slug = normalizeSlug(slug);
    if (!data.slug) {
      return {
        error: { status: 400, message: "Slug cannot be empty" },
      };
    }
  }

  if (Object.keys(data).length === 0) {
    return {
      error: { status: 400, message: "No valid fields to update" },
    };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    return { category };
  } catch (err) {
    if (err.code === "P2002") {
      return {
        error: { status: 400, message: uniqueConstraintMessage(err) },
      };
    }
    if (err.code === "P2025") {
      return { notFound: true };
    }
    throw err;
  }
}

async function deleteCategory(id) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { notFound: true };
  }

  const articleCount = await prisma.article.count({
    where: { categoryId: id },
  });

  if (articleCount > 0) {
    return {
      error: {
        status: 400,
        message: "Cannot delete category because it has articles",
      },
    };
  }

  await prisma.category.delete({ where: { id } });
  return { deleted: true };
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
