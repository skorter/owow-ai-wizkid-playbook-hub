import styles from "./ArticleList.module.css";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import type { OnboardingStep } from "@/types/onboarding";
import Link from "next/link";

type ArticleListProps = {
  steps: OnboardingStep[];
  currentStep: number;
  completedArticles: string[];
  onToggle: (slug: string) => void;
};

export default function ArticleList({
  steps,
  currentStep,
  completedArticles,
  onToggle,
}: ArticleListProps) {
  return (
    <ul className={styles.articles}>
      {steps[currentStep].articles.map((article) => (
        <li
          key={article.slug}
          className={`${styles.article} ${completedArticles.includes(article.slug) ? styles.completed : ""}`}
        >
          <Link
            href={`/playbook/${article.slug}?from=onboarding`}
            className={styles.link}
            onClick={() => onToggle(article.slug)}
          >
            {completedArticles.includes(article.slug) ? (
              <CheckCircle className={styles.icon} />
            ) : (
              <Circle className={styles.icon} />
            )}
            <span className={styles.label}>{article.label}</span>
            <ArrowRight className={styles.icon} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
