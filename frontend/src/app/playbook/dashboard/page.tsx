"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import Information from "./components/Information/Information";
import CTACards from "./components/CTACards/CTACards";
import FeedbackModal from "@/components/playbook/FeedbackModal";
import MissingInfoModal from "@/components/playbook/MissingInfoModal";

export default function DashboardPage() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [missingInfoOpen, setMissingInfoOpen] = useState(false);

  return (
    <div className={styles.dashboardPage}>
      <Greeting />
      {/* Temporarily hidden — restore PlaybookSupportActions when feedback/missing-info should show on dashboard again */}
      {/* <div className={styles.supportRow}>
        <PlaybookSupportActions
          onFeedback={() => setFeedbackOpen(true)}
          onMissingInfo={() => setMissingInfoOpen(true)}
        />
      </div> */}
      <Information />
      <CTACards />
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <MissingInfoModal
        open={missingInfoOpen}
        onClose={() => setMissingInfoOpen(false)}
        sourceHint="Employee dashboard"
      />
      <section className={styles.footer}>
        Built with &lt; 3 for OWOW from Ilia and Sylvio.
      </section>
    </div>
  );
}
