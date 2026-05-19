import styles from "./FeedbackModal.module.css";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>What were you looking for?</h2>
          <p className={styles.subtitle}>
            Your feedback helps us improve the Playbook.
          </p>
        </div>

        <textarea
          className={styles.textarea}
          placeholder="Describe what you couldn't find..."
          rows={4}
        />
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submitButton} onClick={onSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
