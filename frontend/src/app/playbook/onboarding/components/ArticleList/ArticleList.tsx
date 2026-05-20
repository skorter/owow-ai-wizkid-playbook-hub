import styles from "./ArticleList.module.css";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import type { OnboardingStep } from "@/types/onboarding";
import Link from "next/link";

type ArticleListProps = {
  steps: OnboardingStep[];
  currentStep: number;
  completedArticles: string[];
  highlightIncomplete?: boolean;
};

export default function ArticleList({
  steps,
  currentStep,
  completedArticles,
  highlightIncomplete = false,
}: ArticleListProps) {
  const step = steps[currentStep];

  return (
    <ul className={styles.checklist} aria-label="Step articles">
      {step.articles.map((article) => {
        const normalizedSlug = article.slug.trim().toLowerCase();
        const isDone = completedArticles.includes(normalizedSlug);
        const showHighlight = highlightIncomplete && !isDone;

        return (
          <li
            key={article.slug}
            className={`${styles.item} ${isDone ? styles.itemDone : ""} ${showHighlight ? styles.itemHighlight : ""}`}
          >
            <Link
              href={`/playbook/${article.slug}?from=onboarding&step=${currentStep}`}
              className={styles.link}
            >
              <span className={styles.statusIcon} aria-hidden>
                {isDone ? (
                  <CheckCircle className={styles.iconDone} />
                ) : (
                  <Circle className={styles.iconPending} />
                )}
              </span>
              <span className={styles.copy}>
                <span className={styles.title}>{article.label}</span>
                {article.summary ? (
                  <span className={styles.summary}>{article.summary}</span>
                ) : (
                  <span className={styles.summaryMuted}>Read this article to continue</span>
                )}
              </span>
              <span className={styles.action}>
                {isDone ? "Review" : "Open"}
                <ArrowRight size={16} aria-hidden />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
