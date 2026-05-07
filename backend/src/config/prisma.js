const { PrismaClient } = require("@prisma/client");

// Reuse a single Prisma Client instance across the app.
// Helps prevent "too many connections" during nodemon restarts.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };

