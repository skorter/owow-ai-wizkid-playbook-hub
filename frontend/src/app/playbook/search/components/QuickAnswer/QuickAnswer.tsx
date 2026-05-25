import styles from "./QuickAnswer.module.css";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import type { AIProvider } from "@/lib/api/ai";

type QuickAnswerProps = {
  answer: string;
  confidence?: number;
  provider?: AIProvider;
  fallback?: boolean;
  onThumbsDown: () => void;
  onThumbsUp: () => void;
  thumbsUp: boolean;
  thumbsDown: boolean;
};

export default function QuickAnswer({
  answer,
  confidence,
  provider,
  fallback,
  onThumbsDown,
  onThumbsUp,
  thumbsUp,
  thumbsDown,
}: QuickAnswerProps) {
  return (
    <div className={styles.quickAnswer}>
      <div className={styles.header}>
        <Sparkles className={styles.icon} />
        <h2 className={styles.title}>Quick Answer</h2>
        <p className={styles.answer}>{answer}</p>
        {confidence != null && confidence > 0 ? (
          <p className={styles.meta}>
            Match confidence: {Math.round(confidence * 100)}%
            {fallback ? " · summary mode" : provider === "openai" ? " · AI" : ""}
          </p>
        ) : null}
      </div>
      <div className={styles.feedback}>
        <p className={styles.label}>Was this answer helpful?</p>
        <div className={styles.actions}>
          <button type="button" className={styles.yesButton} onClick={onThumbsUp}>
            <ThumbsUp
              className={`${styles.icon} ${thumbsUp ? styles.active : ""}`}
            />
          </button>
          <button type="button" className={styles.noButton} onClick={onThumbsDown}>
            <ThumbsDown
              className={`${styles.icon} ${thumbsDown ? styles.active : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
