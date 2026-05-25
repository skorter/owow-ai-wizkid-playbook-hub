"use client";

import styles from "./playbook-support-actions.module.css";
import { MessageSquarePlus, SearchX } from "lucide-react";

type PlaybookSupportActionsProps = {
  onFeedback: () => void;
  onMissingInfo: () => void;
  layout?: "row" | "stack";
  feedbackLabel?: string;
  missingLabel?: string;
};

export default function PlaybookSupportActions({
  onFeedback,
  onMissingInfo,
  layout = "row",
  feedbackLabel = "Give feedback",
  missingLabel = "Request missing info",
}: PlaybookSupportActionsProps) {
  return (
    <div
      className={`${styles.actions} ${layout === "stack" ? styles.stack : ""}`}
      role="group"
      aria-label="Playbook support"
    >
      <button type="button" className={styles.secondaryButton} onClick={onFeedback}>
        <MessageSquarePlus size={16} aria-hidden />
        {feedbackLabel}
      </button>
      <button type="button" className={styles.ghostButton} onClick={onMissingInfo}>
        <SearchX size={16} aria-hidden />
        {missingLabel}
      </button>
    </div>
  );
}
