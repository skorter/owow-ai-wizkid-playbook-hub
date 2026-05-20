"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import SearchBar from "./components/SearchBar/SearchBar";
import Information from "./components/Information/Information";
import CTACards from "./components/CTACards/CTACards";
import FeedbackModal from "./components/FeedbackModal/FeedbackModal";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.dashboardPage}>
      <Greeting />
      <SearchBar />
      <Information />
      <CTACards />
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => setModalOpen(false)}
      />
      <section className={styles.footer}>
        Built with &lt; 3 for OWOW from Ilia and Sylvio.
      </section>
    </div>
  );
}
