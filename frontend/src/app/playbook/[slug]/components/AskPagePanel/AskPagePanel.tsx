"use client";

import { useCallback, useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import {
  askPageAI,
  getAskPageAIErrorMessage,
  type AskPageAIResponse,
} from "@/lib/api/ai";
import styles from "./AskPagePanel.module.css";

const PAGE_NO_INFO =
  "I could not find enough information about this in the current article.";

type AskPagePanelProps = {
  articleId: string;
  slug: string;
  articleTitle: string;
};

export default function AskPagePanel({
  articleId,
  slug,
  articleTitle,
}: AskPagePanelProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AskPageAIResponse | null>(null);

  const submit = useCallback(async () => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await askPageAI({
        question: trimmed,
        slug,
        articleId,
      });
      setResult(response);
    } catch (err) {
      setResult(null);
      setError(getAskPageAIErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [articleId, loading, question, slug]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const showNoInfo =
    result != null &&
    (result.confidence === 0 ||
      result.answer.trim() === PAGE_NO_INFO ||
      (result.fallback && result.confidence === 0));

  return (
    <section className={styles.panel} aria-label="Ask AI about this article">
      <div className={styles.header}>
        <Sparkles className={styles.icon} aria-hidden />
        <h2 className={styles.title}>Ask AI about this page</h2>
      </div>
      <p className={styles.hint}>
        Ask a question about {articleTitle}. Answers use only
        this article — not the full playbook search.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.input}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What should I remember from this policy?"
          disabled={loading}
          maxLength={500}
          rows={3}
          aria-label="Question about this article"
        />
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <>
                <Loader2 size={16} className={styles.spinner} aria-hidden />
                Thinking…
              </>
            ) : (
              "Ask"
            )}
          </button>
          {error ? (
            <button
              type="button"
              className={styles.retryButton}
              onClick={() => void submit()}
              disabled={loading || !question.trim()}
            >
              <RefreshCw size={14} aria-hidden />
              Retry
            </button>
          ) : null}
        </div>
      </form>

      {loading ? (
        <p className={styles.loading} role="status">
          Generating an answer from this article…
        </p>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {result && !loading ? (
        <div className={styles.answerBlock}>
          <p className={styles.answerLabel}>
            {showNoInfo ? "No match in this article" : "Answer"}
          </p>
          <p className={styles.answerText}>{result.answer}</p>
          {result.source?.title && !showNoInfo ? (
            <p className={styles.sourceMeta}>
              Source: {result.source.title}
              {result.confidence > 0
                ? ` · ${Math.round(result.confidence * 100)}% match`
                : ""}
              {result.fallback && result.confidence > 0
                ? " · summary mode"
                : ""}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
