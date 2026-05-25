"use client";

import { useEffect, useState } from "react";
import styles from "./SuggestQuestions.module.css";
import { ArrowRight } from "lucide-react";
import { apiGet, endpoints } from "@/lib/api";
import type { ApiArticle } from "@/lib/mappers/articles";

const FALLBACK_QUESTIONS = [
  "How do I request time off?",
  "What is the remote work policy?",
  "How does onboarding work?",
  "Where can I find learning resources?",
  "How do I report absence?",
  "What tools does OWOW use?",
];

type SuggestQuestionsProps = {
  onSelectQuestion?: (question: string) => void;
};

export default function SuggestQuestions({ onSelectQuestion }: SuggestQuestionsProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSuggestions() {
      try {
        const articles = await apiGet<ApiArticle[]>(endpoints.articles.list);
        if (cancelled) return;

        const titles = articles
          .map((article) => article.title?.trim())
          .filter((title): title is string => Boolean(title))
          .slice(0, 6);

        setQuestions(titles.length > 0 ? titles : FALLBACK_QUESTIONS);
      } catch {
        if (!cancelled) setQuestions(FALLBACK_QUESTIONS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = (question: string) => {
    if (onSelectQuestion) {
      onSelectQuestion(question);
      return;
    }
  };

  if (loading) {
    return (
      <section className={styles.questions}>
        <h2 className={styles.title}>Suggested Questions</h2>
        <p className={styles.subtitle}>Start with common playbook questions.</p>
        <p className={styles.empty}>Loading suggestions…</p>
      </section>
    );
  }

  return (
    <section className={styles.questions}>
      <h2 className={styles.title}>Suggested Questions</h2>
      <p className={styles.subtitle}>Start with common playbook questions.</p>
      <ul className={styles.grid}>
        {questions.map((question) => (
          <li key={question}>
            <button
              type="button"
              className={styles.card}
              onClick={() => handleSelect(question)}
            >
              <span className={styles.cardText}>{question}</span>
              <ArrowRight className={styles.icon} aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
