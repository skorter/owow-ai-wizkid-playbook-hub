"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import SearchBar from "./components/SearchBar/SearchBar";
import SuggestQuestions from "./components/SuggestQuestions/SuggestQuestions";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import ActionButtons from "./components/ActionButtons/ActionButtons";
import QuickAnswer from "./components/QuickAnswer/QuickAnswer";
import DetailedAnswer from "./components/DetailedAnswer/DetailedAnswer";
import FeedbackModal from "./components/FeedbackModal/FeedbackModal";

export default function SearchPage() {
  const [suggestedQuestionsOpen, setSuggestedQuestionsOpen] = useState(false);
  const [recentActivityOpen, setRecentActivityOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [extendedAnswerOpen, setExtendedAnswerOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  return (
    <div
      className={`${styles.searchPage} ${isSearching ? styles.searching : ""}`}
    >
      <section className={styles.hero}>
        {!isSearching && <Greeting />}
        <SearchBar
          onSearch={(query) => {
            setSearchQuery(query);
            setIsSearching(query.length > 5);
          }}
        />
        {!isSearching && (
          <ActionButtons
            suggestedOpen={suggestedQuestionsOpen}
            recentOpen={recentActivityOpen}
            setSuggestedOpen={setSuggestedQuestionsOpen}
            setRecentOpen={setRecentActivityOpen}
          />
        )}
      </section>

      {!isSearching && (
        <div className={styles.bottom}>
          {suggestedQuestionsOpen && <SuggestQuestions />}
          {recentActivityOpen && <RecentActivity />}
        </div>
      )}

      {isSearching && (
        <section className={styles.results}>
          <QuickAnswer
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
          <DetailedAnswer
            extendedOpen={extendedAnswerOpen}
            setExtendedOpen={setExtendedAnswerOpen}
          />
          <FeedbackModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubmit={() => {
              setModalOpen(false);
              setThumbsDownClicked(true);
              setThumbsUpClicked(false);
            }}
          />
        </section>
      )}
    </div>
  );
}
