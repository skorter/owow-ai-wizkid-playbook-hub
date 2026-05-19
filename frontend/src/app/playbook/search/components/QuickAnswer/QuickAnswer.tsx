import styles from "./QuickAnswer.module.css";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { quickAnswer } from "@/lib/data/search";

type QuickAnswerProps = {
  onThumbsDown: () => void;
  onThumbsUp: () => void;
  thumbsUp: boolean;
  thumbsDown: boolean;
};

export default function QuickAnswer({
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
        <p className={styles.answer}>{quickAnswer.answer}</p>
      </div>
      <div className={styles.feedback}>
        <p className={styles.label}>Was this answer helpful?</p>
        <div className={styles.actions}>
          <button className={styles.yesButton} onClick={onThumbsUp}>
            <ThumbsUp
              className={`${styles.icon} ${thumbsUp ? styles.active : ""}`}
            />
          </button>
          <button className={styles.noButton} onClick={onThumbsDown}>
            <ThumbsDown
              className={`${styles.icon} ${thumbsDown ? styles.active : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
