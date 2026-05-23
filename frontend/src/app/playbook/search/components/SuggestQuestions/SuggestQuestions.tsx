"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SuggestQuestions.module.css";
import { ArrowRight } from "lucide-react";
import { apiGet, endpoints } from "@/lib/api";
import type { ApiArticle } from "@/lib/mappers/articles";

export default function SuggestQuestions() {
  const router = useRouter();
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

        setQuestions(
          titles.length > 0
            ? titles
            : ["How do I request time off?", "What tools does OWOW use?"],
        );
      } catch {
        if (!cancelled) {
          setQuestions(["How do I request time off?", "What tools does OWOW use?"]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className={styles.questions}>
        <h2 className={styles.title}>Suggest Questions</h2>
        <p className={styles.empty}>Loading suggestions…</p>
      </section>
    );
  }

  return (
    <section className={styles.questions}>
      <h2 className={styles.title}>Suggest Questions</h2>
      <ul className={styles.list}>
        {questions.map((question) => (
          <li key={question} className={styles.item}>
            <button
              type="button"
              className={styles.itemButton}
              onClick={() =>
                router.push(`/playbook/search?q=${encodeURIComponent(question)}`)
              }
            >
              <span>{question}</span>
              <ArrowRight className={styles.icon} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
