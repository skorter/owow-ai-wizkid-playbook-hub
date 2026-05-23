"use client";

import { useState } from "react";
import styles from "./playbook-modal.module.css";
import { getApiErrorMessage } from "@/lib/api";
import {
  submitPlaybookFeedback,
  type FeedbackRating,
} from "@/lib/mappers/feedback";

const RATINGS: FeedbackRating[] = [
  "Helpful",
  "Not helpful",
  "Incorrect",
  "Confusing",
];

type FeedbackModalProps = {
  open: boolean;
  onClose: () => void;
  articleId?: string | null;
  articleTitle?: string | null;
  articleSlug?: string | null;
};

function FeedbackForm({
  onClose,
  articleId,
  articleTitle,
  articleSlug,
}: Omit<FeedbackModalProps, "open">) {
  const [rating, setRating] = useState<FeedbackRating | "">("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      setErrorText("Please choose how this content was for you.");
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setErrorText("");

    try {
      await submitPlaybookFeedback({
        rating,
        message,
        articleId: articleId ?? null,
        articleSlug: articleSlug ?? null,
      });
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err) {
      setStatus("error");
      setErrorText(getApiErrorMessage(err, "Could not send feedback. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="feedback-modal-title" className={styles.title}>
            Was this helpful?
          </h2>
          <p className={styles.subtitle}>
            Your feedback helps HR improve playbook content before AI search arrives.
          </p>
          {articleTitle ? (
            <p className={styles.context}>Article: {articleTitle}</p>
          ) : null}
        </header>

        {status === "success" ? (
          <p className={styles.statusSuccess} role="status">
            Thanks — your feedback was sent.
          </p>
        ) : null}

        {status === "error" && errorText ? (
          <p className={styles.statusError} role="alert">
            {errorText}
          </p>
        ) : null}

        {status !== "success" ? (
          <>
            <div className={styles.field}>
              <span className={styles.label}>How was this?</span>
              <div className={styles.ratingGrid}>
                {RATINGS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.ratingOption} ${rating === option ? styles.ratingOptionActive : ""}`}
                    onClick={() => setRating(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="feedback-message">
                Details (optional)
              </label>
              <textarea
                id="feedback-message"
                className={styles.textarea}
                placeholder="Tell us what was missing or unclear…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.submitButton}
                onClick={() => void handleSubmit()}
                disabled={submitting || !rating}
              >
                {submitting ? "Sending…" : "Send feedback"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function FeedbackModal({ open, onClose, ...props }: FeedbackModalProps) {
  if (!open) return null;
  return <FeedbackForm onClose={onClose} {...props} />;
}
