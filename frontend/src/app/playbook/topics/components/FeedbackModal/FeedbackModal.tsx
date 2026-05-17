"use client";
import { useState } from "react";
import styles from "./FeedbackModal.module.css";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [feedbackValue, setFeedbackValue] = useState("");
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>What are you looking for?</h3>
        <p className={styles.modalSubtitle}>
          We'll review your request and add it to the Playbook.
        </p>
        <textarea
          className={styles.textarea}
          placeholder="Describe what information you couldn't find..."
          rows={4}
          value={feedbackValue}
          onChange={(e) => setFeedbackValue(e.target.value)}
        />
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submitButton}
            onClick={() => {
              onSubmit(feedbackValue);
              setFeedbackValue("");
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
