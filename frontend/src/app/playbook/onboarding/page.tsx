"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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
  findStepIndexForSlug,
  getOnboardingProgressKey,
  readOnboardingProgress,
} from "@/lib/onboardingProgress";
import {
  estimateReadingMinutes,
  findFirstIncompleteArticleInStep,
  getPublishedOnboardingProgressPercent,
} from "@/lib/onboarding/employeeOnboarding";
import {
  getSessionSnapshot,
  parseSessionUserSnapshot,
  subscribeSession,
} from "@/lib/auth/session";
import { ApiError } from "@/lib/api";
import { RefreshCw, GraduationCap } from "lucide-react";
import PremiumEmptyState from "@/components/admin/PremiumEmptyState/PremiumEmptyState";

type LoadState = "loading" | "error" | "ready";

function parseStepParam(value: string | null, max: number): number | null {
  if (value == null || value.trim() === "") return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed >= max) return null;
  return parsed;
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const completedSlug = searchParams.get("completed");
  const stepParam = searchParams.get("step");

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progressRevision, setProgressRevision] = useState(0);
  const [celebrationSlug, setCelebrationSlug] = useState<string | null>(null);
  const handledCompletedRef = useRef<string | null>(null);

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

  const progress = useMemo(
    () =>
      getPublishedOnboardingProgressPercent(onboardingSteps, completedSlugs),
    [onboardingSteps, completedSlugs],
  );

  useEffect(() => {
    const onFocus = () => setProgressRevision((v) => v + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    if (
      !completedSlug ||
      loadState !== "ready" ||
      onboardingSteps.length === 0
    ) {
      return;
    }
    if (handledCompletedRef.current === completedSlug) {
      return;
    }
    handledCompletedRef.current = completedSlug;

    const stepFromArticle = findStepIndexForSlug(
      onboardingSteps,
      completedSlug,
    );
    const stepFromUrl = parseStepParam(stepParam, onboardingSteps.length);
    const active = stepFromUrl ?? stepFromArticle;
    const normalized = completedSlug.trim().toLowerCase();

    const frame = requestAnimationFrame(() => {
      setCelebrationSlug(normalized);
      setProgressRevision((v) => v + 1);
      setCurrentStep(active);
      router.replace(`/playbook/onboarding?step=${active}`);
    });

    return () => cancelAnimationFrame(frame);
  }, [completedSlug, loadState, onboardingSteps, router, stepParam]);

  const loadOnboarding = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const result = await fetchPlaybookOnboarding();
      setOnboardingSteps(result.steps);
      const completed =
        readOnboardingProgress(progressKey).completedArticleSlugs;
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
        const completed =
          readOnboardingProgress(progressKey).completedArticleSlugs;
        const stepFromUrl = parseStepParam(stepParam, result.steps.length);
        setCurrentStep(
          stepFromUrl ?? findFirstIncompleteStepIndex(result.steps, completed),
        );
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
  }, [progressKey, stepParam]);

  const handleResetProgress = () => {
    clearOnboardingProgress(progressKey);
    setProgressRevision((v) => v + 1);
    setCurrentStep(0);
    setCelebrationSlug(null);
    handledCompletedRef.current = null;
    router.replace("/playbook/onboarding");
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
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => void loadOnboarding()}
          >
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
        <PremiumEmptyState
          icon={GraduationCap}
          title="Onboarding is being prepared"
          description="HR is publishing onboarding steps and articles. Check back soon — your progress will start once published content is available."
        />
      </div>
    );
  }

  const safeStepIndex = Math.min(
    parseStepParam(stepParam, onboardingSteps.length) ?? currentStep,
    onboardingSteps.length - 1,
  );
  const activeStep = onboardingSteps[safeStepIndex];
  const CurrentIcon = activeStep.icon;

  const stepCompletedCount = activeStep.articles.filter((article) =>
    completedSlugs.includes(article.slug.trim().toLowerCase()),
  ).length;
  const stepArticleTotal = activeStep.articles.length;

  const isStepCompleted = (stepIndex: number) => {
    const step = onboardingSteps[stepIndex];
    if (!step || step.articles.length === 0) return true;
    return step.articles.every((article) =>
      completedSlugs.includes(article.slug.trim().toLowerCase()),
    );
  };

  const allCurrentCompleted = isStepCompleted(safeStepIndex);
  const hasRemainingInStep =
    stepArticleTotal > 0 && stepCompletedCount < stepArticleTotal;
  const onboardingFullyComplete = progress >= 100;

  const celebratedArticle = celebrationSlug
    ? activeStep.articles.find(
        (a) => a.slug.trim().toLowerCase() === celebrationSlug,
      )
    : null;

  const nextRecommendedSlug = hasRemainingInStep
    ? findFirstIncompleteArticleInStep(activeStep, completedSlugs)
    : null;

  const readingEstimate = estimateReadingMinutes(
    Math.max(0, stepArticleTotal - stepCompletedCount),
  );

  const goToNextStep = () => {
    setCelebrationSlug(null);
    const next = findFirstIncompleteStepIndex(onboardingSteps, completedSlugs);
    if (next !== safeStepIndex) {
      setCurrentStep(next);
      router.replace(`/playbook/onboarding?step=${next}`);
      return;
    }
    if (safeStepIndex < onboardingSteps.length - 1) {
      const target = safeStepIndex + 1;
      setCurrentStep(target);
      router.replace(`/playbook/onboarding?step=${target}`);
    }
  };

  const handleContinueStep = () => {
    setCelebrationSlug(null);
    router.replace(`/playbook/onboarding?step=${safeStepIndex}`);
  };

  return (
    <div className={styles.onboardingPage}>
      <Greeting />
      <Steps
        steps={onboardingSteps}
        currentStep={safeStepIndex}
        isStepCompleted={isStepCompleted}
        onStepClick={(index) => {
          setCelebrationSlug(null);
          setCurrentStep(index);
          router.replace(`/playbook/onboarding?step=${index}`);
        }}
      />

      <Progress progress={progress} />

      {onboardingFullyComplete ? (
        <p className={styles.completionBanner} role="status">
          Onboarding completed locally. You have finished all linked articles in
          this browser.
        </p>
      ) : null}

      {celebratedArticle ? (
        <p
          className={`${styles.successBanner} ${!hasRemainingInStep ? styles.successBannerStepDone : ""}`}
          role="status"
        >
          {hasRemainingInStep ? (
            <>
              &quot;{celebratedArticle.label}&quot; marked complete.
              {` ${stepArticleTotal - stepCompletedCount} article${stepArticleTotal - stepCompletedCount === 1 ? "" : "s"} left in this step.`}
            </>
          ) : (
            <>Step completed ✓ — all articles in this module are done.</>
          )}
        </p>
      ) : null}

      <div className={styles.progressMeta}>
        <p className={styles.progressNote}>
          Progress is stored locally for this browser and account (
          {sessionUser?.email ?? "signed in user"}). Use Reset progress to
          restart the demo.
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
        <div className={`${styles.card} ${styles.cardEnter}`}>
          <div className={styles.header}>
            <div className={styles.information}>
              {CurrentIcon && <CurrentIcon className={styles.icon} />}
              <p className={styles.stepEyebrow}>Step {activeStep.id}</p>
              <h2 className={styles.title}>{activeStep.label}</h2>
              {/* <p className={styles.subtitle}>{activeStep.description}</p> */}
            </div>
            {stepArticleTotal > 0 ? (
              <div className={styles.stepProgressRow}>
                <span className={styles.stepProgressCompleted}>
                  {stepCompletedCount} of {stepArticleTotal} articles completed
                </span>
                {readingEstimate > 0 &&
                stepCompletedCount < stepArticleTotal ? (
                  <span className={styles.stepProgressReading}>
                    ~{readingEstimate} min reading left
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {activeStep.articles.length === 0 ? (
            <p className={styles.panelEmpty}>
              No linked articles for this step yet. You can continue when HR
              adds content.
            </p>
          ) : (
            <ArticleList
              steps={onboardingSteps}
              currentStep={safeStepIndex}
              completedArticles={completedSlugs}
              highlightIncomplete={Boolean(
                celebrationSlug && hasRemainingInStep,
              )}
              nextRecommendedSlug={nextRecommendedSlug}
            />
          )}

          <div className={styles.navigation}>
            {safeStepIndex > 0 && (
              <button
                type="button"
                className={styles.previousButton}
                onClick={() => {
                  const prev = safeStepIndex - 1;
                  setCurrentStep(prev);
                  router.replace(`/playbook/onboarding?step=${prev}`);
                }}
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
                {allCurrentCompleted
                  ? "Continue to next step →"
                  : "Complete articles to continue"}
              </button>
            ) : (
              <button
                type="button"
                className={styles.completeButton}
                disabled={!onboardingFullyComplete}
              >
                {onboardingFullyComplete
                  ? "Onboarding complete ✓"
                  : "Complete remaining steps"}
              </button>
            )}
          </div>
        </div>

        <Tip />
      </section>
    </div>
  );
}
