import styles from "./ActionButtons.module.css";
import { Lightbulb, RotateCcw } from "lucide-react";

type ActionButtonsProps = {
  suggestedOpen: boolean;
  recentOpen: boolean;
  setSuggestedOpen: (open: boolean) => void;
  setRecentOpen: (open: boolean) => void;
};

export default function ActionButtons({
  suggestedOpen,
  recentOpen,
  setSuggestedOpen,
  setRecentOpen,
}: ActionButtonsProps) {
  return (
    <section className={styles.actions}>
      <button
        className={`${styles.action} ${suggestedOpen ? styles.active : ""}`}
        onClick={() => {
          setSuggestedOpen(!suggestedOpen);
          setRecentOpen(false);
        }}
      >
        <Lightbulb className={styles.icon} />
        Suggested Questions
      </button>
      <button
        className={`${styles.action} ${recentOpen ? styles.active : ""}`}
        onClick={() => {
          setRecentOpen(!recentOpen);
          setSuggestedOpen(false);
        }}
      >
        <RotateCcw className={styles.icon} />
        Recent Activity
      </button>
    </section>
  );
}
