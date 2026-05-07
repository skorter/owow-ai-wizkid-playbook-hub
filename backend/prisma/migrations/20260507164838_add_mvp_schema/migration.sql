/*
  Warnings:

  - The values [HR,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `categoryId` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SearchSource" AS ENUM ('PLAYBOOK_SEARCH', 'AI_CHAT');

-- CreateEnum
CREATE TYPE "MissingInfoType" AS ENUM ('MISSING_ARTICLE', 'OUTDATED_INFO', 'WRONG_INFO', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('HR_ADMIN', 'EMPLOYEE', 'NEW_EMPLOYEE');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'EMPLOYEE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_categoryId_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "OnboardingStep" ADD COLUMN     "articleId" TEXT;

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" TEXT NOT NULL,
    "source" "SearchSource" NOT NULL DEFAULT 'PLAYBOOK_SEARCH',
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MissingInfoReport" (
    "id" TEXT NOT NULL,
    "type" "MissingInfoType" NOT NULL DEFAULT 'OTHER',
    "title" TEXT,
    "description" TEXT NOT NULL,
    "articleId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MissingInfoReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchLog_userId_idx" ON "SearchLog"("userId");

-- CreateIndex
CREATE INDEX "SearchLog_createdAt_idx" ON "SearchLog"("createdAt");

-- CreateIndex
CREATE INDEX "MissingInfoReport_articleId_idx" ON "MissingInfoReport"("articleId");

-- CreateIndex
CREATE INDEX "MissingInfoReport_userId_idx" ON "MissingInfoReport"("userId");

-- CreateIndex
CREATE INDEX "MissingInfoReport_createdAt_idx" ON "MissingInfoReport"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_articleId_idx" ON "Feedback"("articleId");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "OnboardingStep_articleId_idx" ON "OnboardingStep"("articleId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLog" ADD CONSTRAINT "SearchLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingInfoReport" ADD CONSTRAINT "MissingInfoReport_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissingInfoReport" ADD CONSTRAINT "MissingInfoReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingStep" ADD CONSTRAINT "OnboardingStep_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
