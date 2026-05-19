"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import SearchBar from "./components/SearchBar/SearchBar";
import Information from "./components/Information/Information";
import CTACards from "./components/CTACards/CTACards";
import Answer from "./components/Answer/Answer";
import FeedbackModal from "./components/FeedbackModal/FeedbackModal";

export default function DashboardPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  return (
    <div
      className={`${styles.dashboardPage} ${isSearching ? styles.searching : ""}`}
    >
      <Greeting />
      <SearchBar
        onSearch={(query) => {
          setSearchQuery(query);
          setIsSearching(query.length > 5);
        }}
      />
      {!isSearching && <Information />}
      {!isSearching && <CTACards />}
      {isSearching && (
        <Answer
          onThumbsDown={() => {
            setThumbsUpClicked(false);
            setModalOpen(true);
          }}
          onThumbsUp={() => {
            setThumbsUpClicked(true);
            setThumbsDownClicked(false);
          }}
          thumbsUp={thumbsUpClicked}
          thumbsDown={thumbsDownClicked}
        />
      )}
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {
          setModalOpen(false);
          setThumbsDownClicked(true);
          setThumbsUpClicked(false);
        }}
      />
      <section className={styles.footer}>
        Built with &lt; 3 for OWOW from Ilia and Sylvio.
      </section>
    </div>
  );
}
