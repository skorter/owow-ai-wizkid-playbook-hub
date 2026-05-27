"use client";

import { useEffect, useRef } from "react";
import styles from "./ArticleList.module.css";
import { CheckCircle, Circle, ArrowRight, Pin } from "lucide-react";
import type { OnboardingStep } from "@/types/onboarding";
import Link from "next/link";
import { normalizeArticleSlug } from "@/lib/onboarding/employeeOnboarding";

type ArticleListProps = {
  steps: OnboardingStep[];
  currentStep: number;
  completedArticles: string[];
  highlightIncomplete?: boolean;
  nextRecommendedSlug?: string | null;
};

export default function ArticleList({
  steps,
  currentStep,
  completedArticles,
  highlightIncomplete = false,
  nextRecommendedSlug = null,
}: ArticleListProps) {
  const step = steps[currentStep];
  const listRef = useRef<HTMLUListElement>(null);
  const normalizedNext = nextRecommendedSlug
    ? normalizeArticleSlug(nextRecommendedSlug)
    : null;

  useEffect(() => {
    if (!normalizedNext || !listRef.current) return;
    const target = listRef.current.querySelector(
      `[data-article-slug="${normalizedNext}"]`,
    );
    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [normalizedNext, highlightIncomplete]);

  return (
    <ul ref={listRef} className={styles.checklist} aria-label="Step articles">
      {step.articles.map((article) => {
        const normalizedSlug = normalizeArticleSlug(article.slug);
        const isDone = completedArticles.includes(normalizedSlug);
        const isRecommended = normalizedNext === normalizedSlug && !isDone;
        const showHighlight = (highlightIncomplete && !isDone) || isRecommended;

        return (
          <li
            key={article.slug}
            data-article-slug={normalizedSlug}
            className={`${styles.item} ${isDone ? styles.itemDone : ""} ${showHighlight ? styles.itemHighlight : ""} ${isRecommended ? styles.itemRecommended : ""}`}
          >
            {isRecommended ? (
              <p className={styles.recommendedLabel}>
                <Pin size={14} aria-hidden />
                Next recommended article
              </p>
            ) : null}
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
                {isDone ? "Review" : isRecommended ? "Continue" : "Open article"}
                <ArrowRight size={16} aria-hidden />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
