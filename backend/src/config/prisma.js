const { PrismaClient } = require("@prisma/client");

// Reuse a single Prisma Client instance across the app.
// This is especially helpful during development with hot reloaders.
const prisma = new PrismaClient();

module.exports = { prisma };

