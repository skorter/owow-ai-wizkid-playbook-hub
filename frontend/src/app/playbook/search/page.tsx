"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { aiSearch, getAISearchErrorMessage, type AISearchResponse } from "@/lib/api/ai";
import { Loader2, RefreshCw } from "lucide-react";

type SearchEntry = {
  id: string;
  question: string;
  result: AISearchResponse;
  thumbsUp: boolean;
  thumbsDown: boolean;
  extendedOpen: boolean;
};

function createEntry(question: string, result: AISearchResponse): SearchEntry {
  return {
    id: crypto.randomUUID(),
    question,
    result,
    thumbsUp: false,
    thumbsDown: false,
    extendedOpen: true,
  };
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q")?.trim() ?? "";

  const [suggestedQuestionsOpen, setSuggestedQuestionsOpen] = useState(false);
  const [recentActivityOpen, setRecentActivityOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [missingInfoOpen, setMissingInfoOpen] = useState(false);

  const [draftQuery, setDraftQuery] = useState("");
  const [followUpDraft, setFollowUpDraft] = useState("");
  const barQuery = queryFromUrl || draftQuery;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [feedbackEntryId, setFeedbackEntryId] = useState<string | null>(null);

  const lastFetchedRef = useRef<string | null>(null);
  const lastSubmittedRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isSearching = queryFromUrl.length > 0 || entries.length > 0 || loading;
  const showHeroSearchBar =
    entries.length === 0 && queryFromUrl.length === 0 && !loading;
  const latestQuestion =
    entries[entries.length - 1]?.question ?? queryFromUrl ?? "";

  const submitQuestion = useCallback(
    async (question: string, options?: { replace?: boolean }) => {
      const trimmed = question.trim();
      if (!trimmed) {
        if (options?.replace) {
          setEntries([]);
          setError("");
          lastFetchedRef.current = null;
          lastSubmittedRef.current = null;
          router.replace("/playbook/search");
        }
        return;
      }

      if (options?.replace) {
        setEntries([]);
      }

      setLoading(true);
      setError("");
      lastFetchedRef.current = trimmed;
      lastSubmittedRef.current = trimmed;
      router.replace(`/playbook/search?q=${encodeURIComponent(trimmed)}`);

      try {
        const data = await aiSearch(trimmed);
        const entry = createEntry(trimmed, data);
        setEntries((prev) =>
          options?.replace ? [entry] : [...prev, entry],
        );
        setFollowUpDraft("");
        setDraftQuery("");
      } catch (err) {
        if (options?.replace) {
          setEntries([]);
        }
        setError(getAISearchErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!queryFromUrl) {
        setEntries([]);
        setError("");
        setFollowUpDraft("");
        lastFetchedRef.current = null;
        lastSubmittedRef.current = null;
        return;
      }

      if (lastFetchedRef.current === queryFromUrl) {
        return;
      }

      void submitQuestion(queryFromUrl, { replace: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [queryFromUrl, submitQuestion]);

  const handleQuestionSelect = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    void submitQuestion(trimmed, {
      replace: entries.length === 0 && !queryFromUrl,
    });
  };

  const handleHeroSearch = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    void submitQuestion(trimmed, { replace: true });
  };

  const handleFollowUpSearch = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    void submitQuestion(trimmed, { replace: false });
  };

  const handleThumbsDown = (entryId: string) => {
    setFeedbackEntryId(entryId);
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? { ...entry, thumbsDown: true, thumbsUp: false }
          : entry,
      ),
    );
    setFeedbackOpen(true);
  };

  const handleRetry = () => {
    const retryQuestion =
      lastSubmittedRef.current ?? queryFromUrl ?? latestQuestion;
    if (!retryQuestion) return;
    lastFetchedRef.current = null;
    void submitQuestion(retryQuestion, {
      replace: entries.length === 0,
    });
  };

  const updateEntry = (entryId: string, patch: Partial<SearchEntry>) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, ...patch } : entry,
      ),
    );
  };

  const scrollToLatest = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    if (!isSearching) return;

    const frame = requestAnimationFrame(() => {
      scrollToLatest();
    });

    return () => cancelAnimationFrame(frame);
  }, [entries, loading, error, isSearching, scrollToLatest]);

  return (
    <div className={`${styles.searchPage} ${isSearching ? styles.searching : ""}`}>
      <section className={styles.hero}>
        {!isSearching && <Greeting />}
        {showHeroSearchBar ? (
          <SearchBar
            query={barQuery}
            onQueryChange={setDraftQuery}
            onSearch={handleHeroSearch}
            loading={loading}
            navigateOnSubmit={false}
          />
        ) : null}
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
          {suggestedQuestionsOpen && (
            <SuggestQuestions onSelectQuestion={handleQuestionSelect} />
          )}
          {recentActivityOpen && (
            <RecentActivity onSelectQuestion={handleQuestionSelect} />
          )}
        </div>
      )}

      {isSearching ? (
        <section className={styles.results}>
          {entries.map((entry, index) => (
            <div key={entry.id} className={styles.resultBlock}>
              {index > 0 ? (
                <p className={styles.followUpQuestion}>{entry.question}</p>
              ) : null}
              <QuickAnswer
                answer={entry.result.answer}
                confidence={entry.result.confidence}
                provider={entry.result.provider}
                fallback={entry.result.fallback}
                onThumbsDown={() => handleThumbsDown(entry.id)}
                onThumbsUp={() =>
                  updateEntry(entry.id, { thumbsUp: true, thumbsDown: false })
                }
                thumbsUp={entry.thumbsUp}
                thumbsDown={entry.thumbsDown}
              />
              {entry.result.sources.length > 0 ? (
                <DetailedAnswer
                  sources={entry.result.sources}
                  extendedOpen={entry.extendedOpen}
                  setExtendedOpen={(open) =>
                    updateEntry(entry.id, { extendedOpen: open })
                  }
                />
              ) : null}
              {entry.result.sources.length === 0 || entry.result.fallback ? (
                <div className={styles.supportRow}>
                  <PlaybookSupportActions
                    onFeedback={() => {
                      setFeedbackEntryId(entry.id);
                      setFeedbackOpen(true);
                    }}
                    onMissingInfo={() => setMissingInfoOpen(true)}
                    feedbackLabel="Was this helpful?"
                    missingLabel="Request missing info"
                  />
                </div>
              ) : null}
            </div>
          ))}

          {loading ? (
            <div className={styles.loadingState} role="status">
              <Loader2 className={styles.spinner} aria-hidden />
              <p>
                Searching the playbook for &quot;
                {lastSubmittedRef.current ?? queryFromUrl}&quot;…
              </p>
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

          <div ref={bottomRef} className={styles.scrollAnchor} aria-hidden />

          <div className={styles.followUpWrap}>
            <SearchBar
              query={followUpDraft}
              onQueryChange={setFollowUpDraft}
              onSearch={handleFollowUpSearch}
              loading={loading}
              placeholder="Ask a follow-up…"
              navigateOnSubmit={false}
            />
          </div>
        </section>
      ) : null}

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <MissingInfoModal
        open={missingInfoOpen}
        onClose={() => setMissingInfoOpen(false)}
        sourceHint={
          isSearching
            ? `Search: ${feedbackEntryId ? entries.find((e) => e.id === feedbackEntryId)?.question ?? latestQuestion : latestQuestion}`
            : "Playbook search"
        }
        defaultTitle={
          isSearching
            ? feedbackEntryId
              ? entries.find((e) => e.id === feedbackEntryId)?.question ?? latestQuestion
              : latestQuestion
            : ""
        }
      />
    </div>
  );
}
