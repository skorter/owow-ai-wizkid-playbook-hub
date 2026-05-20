"use client";

import { useState } from "react";
import styles from "./playbook-modal.module.css";
import { submitMissingInfoReport } from "@/lib/mappers/missingInfo";

const MISSING_TYPES = [
  { value: "MISSING_ARTICLE", label: "Missing article or topic" },
  { value: "OUTDATED_INFORMATION", label: "Outdated information" },
  { value: "INCORRECT_INFORMATION", label: "Incorrect information" },
  { value: "OTHER", label: "Other" },
] as const;

type MissingInfoModalProps = {
  open: boolean;
  onClose: () => void;
  articleId?: string | null;
  articleSlug?: string | null;
  sourceHint?: string | null;
  defaultTitle?: string;
  onSubmitted?: () => void;
};

function MissingInfoForm({
  onClose,
  articleId,
  articleSlug,
  sourceHint,
  defaultTitle = "",
  onSubmitted,
}: Omit<MissingInfoModalProps, "open">) {
  const [type, setType] = useState("MISSING_ARTICLE");
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setErrorText("Please add a short title or question.");
      setStatus("error");
      return;
    }
    if (!trimmedDescription) {
      setErrorText("Please describe what is missing.");
      setStatus("error");
      return;
    }

    setSubmitting(true);
    setStatus("idle");
    setErrorText("");

    const contextLine = [
      sourceHint ? `Source: ${sourceHint}` : null,
      articleSlug ? `Article slug: ${articleSlug}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const fullDescription = contextLine
      ? `${trimmedDescription}\n\n---\n${contextLine}`
      : trimmedDescription;

    try {
      await submitMissingInfoReport({
        type,
        title: trimmedTitle,
        description: fullDescription,
        articleId: articleId ?? null,
      });
      setStatus("success");
      onSubmitted?.();
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      setStatus("error");
      setErrorText(
        err instanceof Error ? err.message : "Could not send request. Try again.",
      );
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
        aria-labelledby="missing-info-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 id="missing-info-modal-title" className={styles.title}>
            Request missing info
          </h2>
          <p className={styles.subtitle}>
            HR can review this in Missing Requests. This will later help AI search
            when content is not found.
          </p>
        </header>

        {status === "success" ? (
          <p className={styles.statusSuccess} role="status">
            Request sent. HR can review it in Missing Requests.
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
              <label className={styles.label} htmlFor="missing-type">
                Type
              </label>
              <select
                id="missing-type"
                className={styles.select}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {MISSING_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="missing-title">
                Title / question
              </label>
              <input
                id="missing-title"
                className={styles.input}
                type="text"
                placeholder="What were you looking for?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="missing-description">
                Description
              </label>
              <textarea
                id="missing-description"
                className={styles.textarea}
                placeholder="Describe the missing information or what felt wrong…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Send request"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function MissingInfoModal({ open, onClose, ...props }: MissingInfoModalProps) {
  if (!open) return null;
  return <MissingInfoForm onClose={onClose} {...props} />;
}
