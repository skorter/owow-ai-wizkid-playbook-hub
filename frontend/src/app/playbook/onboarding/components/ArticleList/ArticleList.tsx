import styles from "./ArticleList.module.css";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

type OnboardingStep = {
  id: number;
  label: string;
  slug: string;
  articles: {
    label: string;
    slug: string;
  }[];
};

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
          <div
            // href={`/playbook/${article.slug}`}
            className={styles.articleLink}
            onClick={() => onToggle(article.slug)}
          >
            {completedArticles.includes(article.slug) ? (
              <CheckCircle className={styles.checkIcon} />
            ) : (
              <Circle className={styles.circleIcon} />
            )}
            <span>{article.label}</span>
            <ArrowRight className={styles.arrowRightIcon} />
          </div>
        </li>
      ))}
    </ul>
  );
}
