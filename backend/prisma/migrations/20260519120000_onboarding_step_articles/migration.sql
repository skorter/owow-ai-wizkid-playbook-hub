-- CreateTable
CREATE TABLE "OnboardingStepArticle" (
    "id" TEXT NOT NULL,
    "onboardingStepId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OnboardingStepArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OnboardingStepArticle_onboardingStepId_idx" ON "OnboardingStepArticle"("onboardingStepId");

-- CreateIndex
CREATE INDEX "OnboardingStepArticle_articleId_idx" ON "OnboardingStepArticle"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingStepArticle_onboardingStepId_articleId_key" ON "OnboardingStepArticle"("onboardingStepId", "articleId");

-- AddForeignKey
ALTER TABLE "OnboardingStepArticle" ADD CONSTRAINT "OnboardingStepArticle_onboardingStepId_fkey" FOREIGN KEY ("onboardingStepId") REFERENCES "OnboardingStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingStepArticle" ADD CONSTRAINT "OnboardingStepArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill join rows from legacy articleId
INSERT INTO "OnboardingStepArticle" ("id", "onboardingStepId", "articleId", "order")
SELECT
    os."id" || ':' || os."articleId",
    os."id",
    os."articleId",
    0
FROM "OnboardingStep" os
WHERE os."articleId" IS NOT NULL
ON CONFLICT ("onboardingStepId", "articleId") DO NOTHING;
