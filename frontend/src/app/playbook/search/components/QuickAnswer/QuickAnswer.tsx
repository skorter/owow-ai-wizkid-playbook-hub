import styles from "./QuickAnswer.module.css";
import { Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";

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
        <Sparkles className={styles.sparklesIcon} />
        <h2 className={styles.title}>Quick Answer</h2>
        <p className={styles.answer}>
          To request time off at OWOW, use the Simplicate platform. Navigate to
          the "Time Off" section, select your dates, and submit your request.
          Your manager will be notified automatically and typically responds
          within 24-48 hours.
        </p>
      </div>
      <div className={styles.feedback}>
        <p className={styles.label}>Was this answer helpful?</p>
        <div className={styles.buttons}>
          <button className={styles.yesButton} onClick={onThumbsUp}>
            <ThumbsUp
              className={`${styles.thumbsUpIcon} ${thumbsUp ? styles.active : ""}`}
            />
          </button>
          <button className={styles.noButton} onClick={onThumbsDown}>
            <ThumbsDown
              className={`${styles.thumbsDownIcon} ${thumbsDown ? styles.active : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
