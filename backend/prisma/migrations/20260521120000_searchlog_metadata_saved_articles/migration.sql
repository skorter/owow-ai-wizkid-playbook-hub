-- AlterTable SearchLog metadata
ALTER TABLE "SearchLog" ADD COLUMN IF NOT EXISTS "confidence" DOUBLE PRECISION;
ALTER TABLE "SearchLog" ADD COLUMN IF NOT EXISTS "fallback" BOOLEAN;
ALTER TABLE "SearchLog" ADD COLUMN IF NOT EXISTS "sourceCount" INTEGER;
ALTER TABLE "SearchLog" ADD COLUMN IF NOT EXISTS "articleId" TEXT;
ALTER TABLE "SearchLog" ADD COLUMN IF NOT EXISTS "articleTitle" TEXT;

CREATE INDEX IF NOT EXISTS "SearchLog_source_idx" ON "SearchLog"("source");

-- CreateTable SavedArticle
CREATE TABLE IF NOT EXISTS "SavedArticle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedArticle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SavedArticle_userId_articleId_key" ON "SavedArticle"("userId", "articleId");
CREATE INDEX IF NOT EXISTS "SavedArticle_userId_idx" ON "SavedArticle"("userId");
CREATE INDEX IF NOT EXISTS "SavedArticle_articleId_idx" ON "SavedArticle"("articleId");

DO $$ BEGIN
  ALTER TABLE "SavedArticle" ADD CONSTRAINT "SavedArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "SavedArticle" ADD CONSTRAINT "SavedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
