"use client";
import { useState } from "react";
import styles from "./Feedback.module.css";
import FeedbackModal from "../FeedbackModal/FeedbackModal";

export default function Feedback() {
  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  return (
    <section className={styles.feedback}>
      {!feedbackSubmitted ? (
        <>
          <h2 className={styles.title}>Can't find what you're looking for?</h2>
          <p className={styles.subtitle}>
            Let us know and we'll make sure to add it to the Playbook.
          </p>
          <button className={styles.button} onClick={() => setModalOpen(true)}>
            Submit a request
          </button>
        </>
      ) : (
        <>
          <h2 className={styles.label}>Thank you for your feedback!</h2>
          <p className={styles.description}>
            We appreciate your input and will review your request.
          </p>
        </>
      )}
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {
          setFeedbackSubmitted(true);
          setModalOpen(false);
        }}
      />
    </section>
  );
}
