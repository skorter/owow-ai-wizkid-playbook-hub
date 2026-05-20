"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import SearchBar from "./components/SearchBar/SearchBar";
import SuggestQuestions from "./components/SuggestQuestions/SuggestQuestions";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import ActionButtons from "./components/ActionButtons/ActionButtons";
import QuickAnswer from "./components/QuickAnswer/QuickAnswer";
import DetailedAnswer from "./components/DetailedAnswer/DetailedAnswer";
import FeedbackModal from "@/components/playbook/FeedbackModal";
import MissingInfoModal from "@/components/playbook/MissingInfoModal";
import PlaybookSupportActions from "@/components/playbook/PlaybookSupportActions";
import { aiSearch, type AISearchResponse } from "@/lib/api/ai";
import { ApiError } from "@/lib/api";
import { Loader2, RefreshCw } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() ?? "";

  const [suggestedQuestionsOpen, setSuggestedQuestionsOpen] = useState(false);
  const [recentActivityOpen, setRecentActivityOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [missingInfoOpen, setMissingInfoOpen] = useState(false);
  const [extendedOpen, setExtendedOpen] = useState(true);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AISearchResponse | null>(null);

  const lastFetchedRef = useRef<string | null>(null);

  const isSearching = queryFromUrl.length > 0;

  const runSearch = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) {
      setResult(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setThumbsUp(false);
    setThumbsDown(false);

    try {
      const data = await aiSearch(trimmed);
      lastFetchedRef.current = trimmed;
      setResult(data);
    } catch (err) {
      setResult(null);
      lastFetchedRef.current = null;
      setError(
        err instanceof ApiError
          ? err.message
          : "AI search is unavailable right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (queryFromUrl) {
        void runSearch(queryFromUrl);
      } else {
        setResult(null);
        setError("");
        lastFetchedRef.current = null;
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [queryFromUrl, runSearch]);

  const handleThumbsDown = () => {
    setThumbsDown(true);
    setThumbsUp(false);
    setFeedbackOpen(true);
  };

  const handleRetry = () => {
    if (queryFromUrl) {
      lastFetchedRef.current = null;
      void runSearch(queryFromUrl);
    }
  };

  return (
    <div className={`${styles.searchPage} ${isSearching ? styles.searching : ""}`}>
      <section className={styles.hero}>
        {!isSearching && <Greeting />}
        <SearchBar
          key={`bar-${queryFromUrl}`}
          initialQuery={queryFromUrl}
          onSearch={() => {}}
          loading={loading}
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
          {loading ? (
            <div className={styles.loadingState} role="status">
              <Loader2 className={styles.spinner} aria-hidden />
              <p>Searching the playbook for &quot;{queryFromUrl}&quot;…</p>
            </div>
          ) : null}

          {error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button type="button" className={styles.retryButton} onClick={handleRetry}>
                <RefreshCw size={16} aria-hidden />
                Try again
              </button>
            </div>
          ) : null}

          {!loading && !error && result ? (
            <>
              <QuickAnswer
                answer={result.answer}
                confidence={result.confidence}
                provider={result.provider}
                fallback={result.fallback}
                onThumbsDown={handleThumbsDown}
                onThumbsUp={() => {
                  setThumbsUp(true);
                  setThumbsDown(false);
                }}
                thumbsUp={thumbsUp}
                thumbsDown={thumbsDown}
              />
              {result.sources.length > 0 ? (
                <DetailedAnswer
                  sources={result.sources}
                  extendedOpen={extendedOpen}
                  setExtendedOpen={setExtendedOpen}
                />
              ) : null}
              {result.sources.length === 0 || result.fallback ? (
                <div className={styles.supportRow}>
                  <PlaybookSupportActions
                    onFeedback={() => setFeedbackOpen(true)}
                    onMissingInfo={() => setMissingInfoOpen(true)}
                    feedbackLabel="Was this helpful?"
                    missingLabel="Request missing info"
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <MissingInfoModal
        open={missingInfoOpen}
        onClose={() => setMissingInfoOpen(false)}
        sourceHint={isSearching ? `Search: ${queryFromUrl}` : "Playbook search"}
        defaultTitle={isSearching ? queryFromUrl : ""}
      />
    </div>
  );
}
