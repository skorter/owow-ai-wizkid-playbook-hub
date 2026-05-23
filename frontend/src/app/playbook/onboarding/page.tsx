"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import Steps from "./components/Steps/Steps";
import Progress from "./components/Progress/Progress";
import ArticleList from "./components/ArticleList/ArticleList";
import Tip from "./components/Tip/Tip";
import Greeting from "./components/Greeting/Greeting";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import type { OnboardingStep } from "@/types/onboarding";
import {
  findFirstIncompleteStepIndex,
  getOnboardingProgressKey,
  getOnboardingProgressPercent,
  readOnboardingProgress,
  writeOnboardingProgress,
} from "@/lib/onboardingProgress";
import { getStoredSessionUser } from "@/lib/auth/session";
import { ApiError } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type LoadState = "loading" | "error" | "ready";

export default function OnboardingPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const progressKey = useMemo(() => {
    const user = getStoredSessionUser();
    return getOnboardingProgressKey(user?.id, user?.email);
  }, []);

  const [completedArticles, setCompletedArticles] = useState<string[]>(() =>
    readOnboardingProgress(progressKey).completedArticleSlugs,
  );

  const allArticleSlugs = useMemo(
    () =>
      onboardingSteps.flatMap((step) =>
        step.articles.map((a) => a.slug.trim().toLowerCase()),
      ),
    [onboardingSteps],
  );

  useEffect(() => {
    const onFocus = () => {
      setCompletedArticles(
        readOnboardingProgress(progressKey).completedArticleSlugs,
      );
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [progressKey]);

  const loadOnboarding = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const result = await fetchPlaybookOnboarding();
      setOnboardingSteps(result.steps);
      const firstIncomplete = findFirstIncompleteStepIndex(
        result.steps,
        readOnboardingProgress(progressKey).completedArticleSlugs,
      );
      setCurrentStep(firstIncomplete);
      setCompletedArticles(
        readOnboardingProgress(progressKey).completedArticleSlugs,
      );
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
      try {
        const result = await fetchPlaybookOnboarding();
        if (cancelled) return;
        setOnboardingSteps(result.steps);
        const completed = readOnboardingProgress(progressKey).completedArticleSlugs;
        setCompletedArticles(completed);
        setCurrentStep(findFirstIncompleteStepIndex(result.steps, completed));
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

    void load();

    return () => {
      cancelled = true;
    };
  }, [progressKey]);

  const isStepCompleted = (stepIndex: number) =>
    onboardingSteps[stepIndex]?.articles.every((article) =>
      completedArticles.includes(article.slug.trim().toLowerCase()),
    ) ?? false;

  const allCurrentCompleted = isStepCompleted(currentStep);
  const progress = getOnboardingProgressPercent(completedArticles, allArticleSlugs);

  const toggleArticle = (slug: string) => {
    const normalized = slug.trim().toLowerCase();
    const next = completedArticles.includes(normalized)
      ? completedArticles.filter((s) => s !== normalized)
      : [...completedArticles, normalized];
    writeOnboardingProgress(progressKey, next);
    setCompletedArticles(next);
  };

  if (loadState === "loading") {
    return (
      <div className={styles.onboardingPage}>
        <Greeting stepCount={0} progressPercent={0} />
        <p className={styles.stateMessage}>Loading onboarding…</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className={styles.onboardingPage}>
        <Greeting stepCount={0} progressPercent={0} />
        <div className={styles.stateBlock}>
          <p className={styles.stateError}>{errorMessage}</p>
          <button type="button" className={styles.retryButton} onClick={() => void loadOnboarding()}>
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
        <Greeting stepCount={0} progressPercent={0} />
        <p className={styles.panelEmpty}>No onboarding steps are available yet.</p>
      </div>
    );
  }

  const safeStepIndex = Math.min(currentStep, onboardingSteps.length - 1);
  const activeStep = onboardingSteps[safeStepIndex];
  const CurrentIcon = activeStep.icon;

  const goToNextStep = () => {
    const next = findFirstIncompleteStepIndex(onboardingSteps, completedArticles);
    if (next > safeStepIndex) {
      setCurrentStep(next);
      return;
    }
    if (safeStepIndex < onboardingSteps.length - 1) {
      setCurrentStep(safeStepIndex + 1);
    }
  };

  return (
    <div className={styles.onboardingPage}>
      <Greeting stepCount={onboardingSteps.length} progressPercent={progress} />
      <Steps
        steps={onboardingSteps}
        currentStep={safeStepIndex}
        isStepCompleted={isStepCompleted}
        onStepClick={setCurrentStep}
      />

      <Progress progress={progress} />

      <p className={styles.progressNote}>
        Progress is saved locally in your browser per account until backend onboarding
        tracking is added.
      </p>

      <section className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.information}>
              {CurrentIcon && <CurrentIcon className={styles.icon} />}
              <div>
                <h2 className={styles.title}>{activeStep.label}</h2>
                <p className={styles.subtitle}>{activeStep.description}</p>
                <p className={styles.subtitle}>
                  {
                    completedArticles.filter((slug) =>
                      activeStep.articles.some(
                        (a) => a.slug.trim().toLowerCase() === slug,
                      ),
                    ).length
                  }{" "}
                  of {activeStep.articles.length} articles completed
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
                type="button"
                className={styles.previousButton}
                onClick={() => setCurrentStep(safeStepIndex - 1)}
              >
                Previous
              </button>
            )}
            {safeStepIndex < onboardingSteps.length - 1 ? (
              <button
                type="button"
                className={styles.nextButton}
                onClick={goToNextStep}
                disabled={!allCurrentCompleted}
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                className={styles.completeButton}
                disabled={!allCurrentCompleted || progress < 100}
              >
                {progress >= 100 ? "Onboarding Complete ✓" : "Complete remaining articles"}
              </button>
            )}
          </div>
        </div>

        <Tip />
      </section>
    </div>
  );
}
