"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Steps from "./components/Steps/Steps";
import Progress from "./components/Progress/Progress";
import ArticleList from "./components/ArticleList/ArticleList";
import Tip from "./components/Tip/Tip";
import Greeting from "./components/Greeting/Greeting";
import { onboardingSteps } from "@/lib/data/onboarding";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);

  const isStepCompleted = (stepIndex: number) =>
    onboardingSteps[stepIndex].articles.every((article) =>
      completedArticles.includes(article.slug),
    );

  const allCurrentCompleted = isStepCompleted(currentStep);
  const totalArticles = onboardingSteps.flatMap((step) => step.articles).length;
  const progress = Math.round((completedArticles.length / totalArticles) * 100);

  const toggleArticle = (slug: string) => {
    setCompletedArticles((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const CurrentIcon = onboardingSteps[currentStep].icon;

  return (
    <div className={styles.onboardingPage}>
      <Greeting />
      <Steps
        steps={onboardingSteps}
        currentStep={currentStep}
        isStepCompleted={isStepCompleted}
        onStepClick={setCurrentStep}
      />

      <Progress progress={progress} />

      <section className={styles.content}>
        <div className={styles.stepCard}>
          <div className={styles.stepHeader}>
            <div className={styles.stepTitleRow}>
              {CurrentIcon && <CurrentIcon className={styles.stepIcon} />}
              <div>
                <h2 className={styles.stepTitle}>
                  {onboardingSteps[currentStep].label}
                </h2>
                <p className={styles.stepCount}>
                  {
                    completedArticles.filter((slug) =>
                      onboardingSteps[currentStep].articles.some(
                        (a) => a.slug === slug,
                      ),
                    ).length
                  }{" "}
                  of {onboardingSteps[currentStep].articles.length} completed
                </p>
              </div>
            </div>
          </div>

          <ArticleList
            steps={onboardingSteps}
            currentStep={currentStep}
            completedArticles={completedArticles}
            onToggle={toggleArticle}
          />

          <div className={styles.navigation}>
            {currentStep > 0 && (
              <button
                className={styles.prevButton}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </button>
            )}
            {currentStep < onboardingSteps.length - 1 ? (
              <button
                className={styles.nextButton}
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!allCurrentCompleted}
              >
                Next Step →
              </button>
            ) : (
              <button
                className={styles.completeButton}
                disabled={!allCurrentCompleted}
              >
                Complete Onboarding ✓
              </button>
            )}
          </div>
        </div>

        <Tip />
      </section>
    </div>
  );
}
