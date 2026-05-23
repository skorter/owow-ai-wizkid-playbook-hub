import styles from "./ArticleList.module.css";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import type { OnboardingStep } from "@/types/onboarding";
import Link from "next/link";

type ArticleListProps = {
  steps: OnboardingStep[];
  currentStep: number;
  completedArticles: string[];
};

export default function ArticleList({
  steps,
  currentStep,
  completedArticles,
}: ArticleListProps) {
  return (
    <ul className={styles.articles}>
      {steps[currentStep].articles.map((article) => {
        const normalizedSlug = article.slug.trim().toLowerCase();
        const isDone = completedArticles.includes(normalizedSlug);

        return (
          <li
            key={article.slug}
            className={`${styles.article} ${isDone ? styles.completed : ""}`}
          >
            <Link
              href={`/playbook/${article.slug}?from=onboarding`}
              className={styles.link}
            >
              {isDone ? (
                <CheckCircle className={styles.icon} aria-hidden />
              ) : (
                <Circle className={styles.icon} aria-hidden />
              )}
              <span className={styles.label}>{article.label}</span>
              <ArrowRight className={styles.icon} aria-hidden />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
