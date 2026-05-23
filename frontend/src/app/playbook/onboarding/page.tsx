"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Steps from "./components/Steps/Steps";
import Progress from "./components/Progress/Progress";
import ArticleList from "./components/ArticleList/ArticleList";
import Tip from "./components/Tip/Tip";
import Greeting from "./components/Greeting/Greeting";
import { fetchPlaybookOnboarding } from "@/lib/mappers/playbook";
import type { OnboardingStep } from "@/types/onboarding";
import {
  clearOnboardingProgress,
  findFirstIncompleteStepIndex,
  getOnboardingProgressKey,
  getOnboardingProgressPercent,
  readOnboardingProgress,
} from "@/lib/onboardingProgress";
import {
  getSessionSnapshot,
  parseSessionUserSnapshot,
  subscribeSession,
} from "@/lib/auth/session";
import { ApiError } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type LoadState = "loading" | "error" | "ready";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const completedSlug = searchParams.get("completed");

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progressRevision, setProgressRevision] = useState(0);

  const userSnapshot = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    () => null,
  );
  const sessionUser = useMemo(
    () => parseSessionUserSnapshot(userSnapshot),
    [userSnapshot],
  );
  const progressKey = getOnboardingProgressKey(
    sessionUser?.id,
    sessionUser?.email,
  );

  const completedSlugs = useMemo(() => {
    void progressRevision;
    return readOnboardingProgress(progressKey).completedArticleSlugs;
  }, [progressKey, progressRevision]);

  const allArticleSlugs = useMemo(
    () =>
      onboardingSteps.flatMap((step) =>
        step.articles.map((a) => a.slug.trim().toLowerCase()),
      ),
    [onboardingSteps],
  );

  useEffect(() => {
    const onFocus = () => setProgressRevision((v) => v + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const loadOnboarding = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const result = await fetchPlaybookOnboarding();
      setOnboardingSteps(result.steps);
      const completed = readOnboardingProgress(progressKey).completedArticleSlugs;
      setCurrentStep(findFirstIncompleteStepIndex(result.steps, completed));
      setProgressRevision((v) => v + 1);
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
        setCurrentStep(findFirstIncompleteStepIndex(result.steps, completed));
        setProgressRevision((v) => v + 1);
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

  const progress = getOnboardingProgressPercent(completedSlugs, allArticleSlugs);

  const handleResetProgress = () => {
    clearOnboardingProgress(progressKey);
    setProgressRevision((v) => v + 1);
    setCurrentStep(0);
    router.replace("/playbook/onboarding");
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

  const safeStepIndex = completedSlug
    ? findFirstIncompleteStepIndex(onboardingSteps, completedSlugs)
    : Math.min(currentStep, onboardingSteps.length - 1);
  const activeStep = onboardingSteps[safeStepIndex];
  const CurrentIcon = activeStep.icon;

  const isStepCompleted = (stepIndex: number) =>
    onboardingSteps[stepIndex]?.articles.every((article) =>
      completedSlugs.includes(article.slug.trim().toLowerCase()),
    ) ?? false;

  const allCurrentCompleted = isStepCompleted(safeStepIndex);

  const goToNextStep = () => {
    const next = findFirstIncompleteStepIndex(onboardingSteps, completedSlugs);
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

      {completedSlug ? (
        <p className={styles.successBanner} role="status">
          Step completed. Your onboarding progress was updated.
        </p>
      ) : null}

      <div className={styles.progressMeta}>
        <p className={styles.progressNote}>
          Progress is stored locally for this browser and account (
          {sessionUser?.email ?? "signed in user"}). Use Reset progress to restart the
          demo.
        </p>
        <button
          type="button"
          className={styles.resetProgressButton}
          onClick={handleResetProgress}
        >
          Reset progress
        </button>
      </div>

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
                    completedSlugs.filter((slug) =>
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
              completedArticles={completedSlugs}
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
