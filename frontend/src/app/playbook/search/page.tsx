"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import SearchBar from "./components/SearchBar/SearchBar";
import SuggestQuestions from "./components/SuggestQuestions/SuggestQuestions";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import ActionButtons from "./components/ActionButtons/ActionButtons";
import FeedbackModal from "@/components/playbook/FeedbackModal";
import MissingInfoModal from "@/components/playbook/MissingInfoModal";
import PlaybookSupportActions from "@/components/playbook/PlaybookSupportActions";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() ?? "";

  const [suggestedQuestionsOpen, setSuggestedQuestionsOpen] = useState(false);
  const [recentActivityOpen, setRecentActivityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => queryFromUrl);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [missingInfoOpen, setMissingInfoOpen] = useState(false);

  const activeQuery = searchQuery.trim() || queryFromUrl;
  const isSearching = activeQuery.length > 0;

  const pendingMessage = useMemo(() => {
    if (!isSearching) return "";
    return activeQuery;
  }, [isSearching, activeQuery]);

  return (
    <div className={`${styles.searchPage} ${isSearching ? styles.searching : ""}`}>
      <section className={styles.hero}>
        {!isSearching && <Greeting />}
        <SearchBar
          key={queryFromUrl}
          initialQuery={queryFromUrl}
          onSearch={setSearchQuery}
        />
        {!isSearching && (
          <ActionButtons
            suggestedOpen={suggestedQuestionsOpen}
            recentOpen={recentActivityOpen}
            setSuggestedOpen={setSuggestedQuestionsOpen}
            setRecentOpen={setRecentActivityOpen}
          />
        )}
        {!isSearching ? (
          <div className={styles.supportRow}>
            <PlaybookSupportActions
              onFeedback={() => setFeedbackOpen(true)}
              onMissingInfo={() => setMissingInfoOpen(true)}
              layout="stack"
            />
          </div>
        ) : null}
      </section>

      {!isSearching && (
        <div className={styles.bottom}>
          {suggestedQuestionsOpen && <SuggestQuestions />}
          {recentActivityOpen && <RecentActivity />}
        </div>
      )}

      {isSearching ? (
        <section className={styles.results}>
          <div className={styles.aiPending}>
            <h2 className={styles.aiPendingTitle}>AI search coming in Phase 12</h2>
            <p className={styles.aiPendingText}>
              Your query &quot;{pendingMessage}&quot; is ready. Intelligent answers will
              be connected in the next release. Browse topics or open a published article
              in the meantime.
            </p>
            <div className={styles.supportRow}>
              <PlaybookSupportActions
                onFeedback={() => setFeedbackOpen(true)}
                onMissingInfo={() => setMissingInfoOpen(true)}
                feedbackLabel="Was this helpful?"
                missingLabel="Request missing info"
              />
            </div>
          </div>
        </section>
      ) : null}

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <MissingInfoModal
        open={missingInfoOpen}
        onClose={() => setMissingInfoOpen(false)}
        sourceHint={isSearching ? `Search: ${activeQuery}` : "Playbook search"}
        defaultTitle={isSearching ? activeQuery : ""}
      />
    </div>
  );
}
