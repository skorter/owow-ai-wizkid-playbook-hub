"use client";

import { useState } from "react";
import styles from "./Feedback.module.css";
import MissingInfoModal from "@/components/playbook/MissingInfoModal";
import FeedbackModal from "@/components/playbook/FeedbackModal";
import PlaybookSupportActions from "@/components/playbook/PlaybookSupportActions";

type FeedbackProps = {
  searchQuery?: string;
};

export default function Feedback({ searchQuery = "" }: FeedbackProps) {
  const [missingOpen, setMissingOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  return (
    <section className={styles.feedback}>
      {!requestSent ? (
        <>
          <h2 className={styles.title}>Can&apos;t find what you&apos;re looking for?</h2>
          <p className={styles.description}>
            Request missing information or send feedback so HR can improve the playbook.
          </p>
          <PlaybookSupportActions
            onFeedback={() => setFeedbackOpen(true)}
            onMissingInfo={() => setMissingOpen(true)}
            layout="stack"
            missingLabel="Request missing info"
          />
        </>
      ) : (
        <>
          <h2 className={styles.label}>Thank you</h2>
          <p className={styles.subtitle}>
            Your request was sent. HR can review it in Missing Requests.
          </p>
        </>
      )}

      <MissingInfoModal
        open={missingOpen}
        onClose={() => setMissingOpen(false)}
        sourceHint={searchQuery ? `Topics search: ${searchQuery}` : "Topics browse"}
        defaultTitle={searchQuery}
        onSubmitted={() => setRequestSent(true)}
      />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </section>
  );
}
