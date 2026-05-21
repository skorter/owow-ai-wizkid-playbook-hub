"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Steps from "./components/Steps/Steps";
import Progress from "./components/Progress/Progress";
import ArticleList from "./components/ArticleList/ArticleList";
import Tip from "./components/Tip/Tip";
import Greeting from "./components/Greeting/Greeting";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import type { OnboardingStep } from "@/types/onboarding";
import { ApiError } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type LoadState = "loading" | "error" | "ready";

export default function OnboardingPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [completedArticles, setCompletedArticles] = useState<string[]>([]);

  const loadOnboarding = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const result = await fetchPlaybookOnboarding();
      setOnboardingSteps(result.steps);
      setCurrentStep(0);
      setLoadState("ready");
    } catch (err) {
      setOnboardingSteps([]);
      setLoadState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Could not load onboarding. Please try again.",
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      setErrorMessage("");

      try {
        const result = await fetchPlaybookOnboarding();
        if (cancelled) return;
        setOnboardingSteps(result.steps);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        setOnboardingSteps([]);
        setLoadState("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load onboarding. Please try again.",
        );
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const isStepCompleted = (stepIndex: number) =>
    onboardingSteps[stepIndex]?.articles.every((article) =>
      completedArticles.includes(article.slug),
    ) ?? false;

  const allCurrentCompleted = isStepCompleted(currentStep);
  const totalArticles = onboardingSteps.flatMap((step) => step.articles).length;
  const progress =
    totalArticles > 0
      ? Math.round((completedArticles.length / totalArticles) * 100)
      : 0;

  const toggleArticle = (slug: string) => {
    setCompletedArticles((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  if (loadState === "loading") {
    return (
      <div className={styles.onboardingPage}>
        <Greeting />
        <p className={styles.stateMessage}>Loading onboarding…</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className={styles.onboardingPage}>
        <Greeting />
        <div className={styles.stateBlock}>
          <p className={styles.stateError}>{errorMessage}</p>
          <button type="button" className={styles.retryButton} onClick={loadOnboarding}>
            <RefreshCw size={16} aria-hidden />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (onboardingSteps.length === 0) {
    return (
      <div className={styles.onboardingPage}>
        <Greeting />
        <p className={styles.panelEmpty}>No onboarding steps are available yet.</p>
      </div>
    );
  }

  const safeStepIndex = Math.min(currentStep, onboardingSteps.length - 1);
  const activeStep = onboardingSteps[safeStepIndex];
  const CurrentIcon = activeStep.icon;

  return (
    <div className={styles.onboardingPage}>
      <Greeting />
      <Steps
        steps={onboardingSteps}
        currentStep={safeStepIndex}
        isStepCompleted={isStepCompleted}
        onStepClick={setCurrentStep}
      />

      <Progress progress={progress} />

      <section className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.information}>
              {CurrentIcon && <CurrentIcon className={styles.icon} />}
              <div>
                <h2 className={styles.title}>{activeStep.label}</h2>
                <p className={styles.subtitle}>
                  {
                    completedArticles.filter((slug) =>
                      activeStep.articles.some((a) => a.slug === slug),
                    ).length
                  }{" "}
                  of {activeStep.articles.length} completed
                </p>
              </div>
            </div>
          </div>

          {activeStep.articles.length === 0 ? (
            <p className={styles.panelEmpty}>
              No linked articles for this step yet.
            </p>
          ) : (
            <ArticleList
              steps={onboardingSteps}
              currentStep={safeStepIndex}
              completedArticles={completedArticles}
              onToggle={toggleArticle}
            />
          )}

          <div className={styles.navigation}>
            {safeStepIndex > 0 && (
              <button
                className={styles.previousButton}
                onClick={() => setCurrentStep(safeStepIndex - 1)}
              >
                Previous
              </button>
            )}
            {safeStepIndex < onboardingSteps.length - 1 ? (
              <button
                className={styles.nextButton}
                onClick={() => setCurrentStep(safeStepIndex + 1)}
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
