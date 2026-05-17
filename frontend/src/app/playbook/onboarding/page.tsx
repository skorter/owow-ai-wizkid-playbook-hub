"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { Building2, Briefcase, TrendingUp, LucideIcon } from "lucide-react";
import Steps from "./components/Steps/Steps";
import Progress from "./components/Progress/Progress";
import ArticleList from "./components/ArticleList/ArticleList";
import Tip from "./components/Tip/Tip";
import Greeting from "./components/Greeting/Greeting";

type OnboardingArticle = {
  label: string;
  slug: string;
};

type OnboardingStep = {
  id: number;
  label: string;
  slug: string;
  icon: string;
  description: string;
  articles: OnboardingArticle[];
};

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Briefcase,
  TrendingUp,
};

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    label: "Company & Culture",
    slug: "company-culture",
    icon: "Building2",
    description: "Get to know OWOW — who we are and how we work.",
    articles: [
      { label: "Welcome to OWOW", slug: "welcome-to-owow" },
      {
        label: "Mission, vision & our promise",
        slug: "mission-vision-our-promise",
      },
      { label: "Core values", slug: "core-values" },
      {
        label: "Our work culture & Way of working",
        slug: "our-work-culture-way-of-working",
      },
    ],
  },
  {
    id: 2,
    label: "Practical Setup",
    slug: "practical-setup",
    icon: "Briefcase",
    description: "Everything you need to get up and running from day one.",
    articles: [
      { label: "Simplicate", slug: "simplicate" },
      { label: "Team structure & roles", slug: "team-structure-roles" },
      { label: "Our office", slug: "our-office" },
      { label: "Holidays and leave", slug: "holidays-and-leave" },
      {
        label: "Expenses and reimbursements",
        slug: "expenses-and-reimbursements",
      },
    ],
  },
  {
    id: 3,
    label: "Growth & Conduct",
    slug: "growth-conduct",
    icon: "TrendingUp",
    description: "Understand how you grow at OWOW and what's expected.",
    articles: [
      { label: "Role description", slug: "role-description" },
      { label: "Personal growth", slug: "personal-growth" },
      {
        label: "Inclusion, non-discrimination and equal treatment",
        slug: "inclusion-non-discrimination-equal-treatment",
      },
      {
        label: "Wellbeing in the workplace",
        slug: "wellbeing-in-the-workplace",
      },
      {
        label: "Anti-harassment & reporting procedure",
        slug: "anti-harassment-reporting-procedure",
      },
    ],
  },
];

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

  const CurrentIcon = iconMap[onboardingSteps[currentStep].icon];

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
