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
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>What were you looking for?</h3>
        <p className={styles.modalSubtitle}>
          Your feedback helps us improve the Playbook.
        </p>
        <textarea
          className={styles.textarea}
          placeholder="Describe what you couldn't find..."
          rows={4}
        />
        <div className={styles.modalActions}>
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
