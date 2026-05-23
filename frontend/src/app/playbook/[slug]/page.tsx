"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import BackButton from "./components/BackButton/BackButton";
import {
  buildStaticArticleFallback,
  fetchPlaybookArticleBySlug,
  findStaticPageBySlug,
  type PlaybookArticleDetail,
} from "@/lib/mappers/playbook";
import { renderArticleContent } from "@/lib/playbook/renderArticleContent";
import {
  getOnboardingProgressKey,
  isArticleComplete,
  markArticleComplete,
} from "@/lib/onboardingProgress";
import {
  getSessionSnapshot,
  parseSessionUserSnapshot,
  subscribeSession,
} from "@/lib/auth/session";
import { ApiError } from "@/lib/api";
import { CheckCircle, RefreshCw } from "lucide-react";
import FeedbackModal from "@/components/playbook/FeedbackModal";
import MissingInfoModal from "@/components/playbook/MissingInfoModal";
import PlaybookSupportActions from "@/components/playbook/PlaybookSupportActions";

type LoadState = "loading" | "error" | "ready" | "not-found";

export default function SlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const from = searchParams.get("from") ?? undefined;
  const onboardingStep = searchParams.get("step");

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [article, setArticle] = useState<PlaybookArticleDetail | null>(null);
  const [staticSubpages, setStaticSubpages] = useState<
    { label: string; slug: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [completionVersion, setCompletionVersion] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [missingInfoOpen, setMissingInfoOpen] = useState(false);

  const userSnapshot = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    () => null,
  );
  const sessionUser = useMemo(
    () => parseSessionUserSnapshot(userSnapshot),
    [userSnapshot],
  );
  const progressKey = getOnboardingProgressKey(
    sessionUser?.id,
    sessionUser?.email,
  );

  const completed = useMemo(() => {
    void completionVersion;
    if (!slug) return false;
    return isArticleComplete(progressKey, slug);
  }, [completionVersion, progressKey, slug]);

  useEffect(() => {
    const onFocus = () => setCompletionVersion((v) => v + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleMarkComplete = () => {
    if (!slug || completing || completed) return;

    setCompleting(true);
    markArticleComplete(progressKey, slug);

    if (from === "onboarding") {
      const params = new URLSearchParams({
        completed: slug,
      });
      if (onboardingStep != null && onboardingStep.trim() !== "") {
        params.set("step", onboardingStep.trim());
      }
      router.push(`/playbook/onboarding?${params.toString()}`);
      return;
    }

    setCompletionVersion((v) => v + 1);
    setCompleting(false);
  };

  const backHref =
    from === "onboarding" ? "/playbook/onboarding" : "/playbook/topics";
  const backLabel =
    from === "onboarding" ? "Back to Onboarding" : "Back to Topics";

  const loadArticle = async () => {
    if (!slug) {
      setLoadState("not-found");
      return;
    }

    setErrorMessage("");
    setStaticSubpages([]);

    try {
      const data = await fetchPlaybookArticleBySlug(slug);
      if (data) {
        setArticle(data);
        setLoadState("ready");
        return;
      }

      const staticFallback = buildStaticArticleFallback(slug);
      if (staticFallback) {
        setArticle(staticFallback);
        const staticPage = findStaticPageBySlug(slug);
        setStaticSubpages(staticPage?.subpages ?? []);
        setLoadState("ready");
        return;
      }

      setArticle(null);
      setLoadState("not-found");
    } catch (err) {
      setArticle(null);
      setLoadState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Could not load this article. Please try again.",
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug) {
        if (!cancelled) setLoadState("not-found");
        return;
      }

      try {
        const data = await fetchPlaybookArticleBySlug(slug);
        if (cancelled) return;

        if (data) {
          setArticle(data);
          setStaticSubpages([]);
          setLoadState("ready");
          return;
        }

        const staticFallback = buildStaticArticleFallback(slug);
        if (staticFallback) {
          setArticle(staticFallback);
          const staticPage = findStaticPageBySlug(slug);
          setStaticSubpages(staticPage?.subpages ?? []);
          setLoadState("ready");
          return;
        }

        setArticle(null);
        setLoadState("not-found");
      } catch (err) {
        if (cancelled) return;
        setArticle(null);
        setLoadState("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load this article. Please try again.",
        );
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (loadState === "not-found") {
      router.replace("/playbook/topics");
    }
  }, [loadState, router]);

  if (loadState === "loading") {
    return (
      <div className={styles.slugPage}>
        <p className={styles.stateMessage}>Loading article…</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className={styles.slugPage}>
        <div className={styles.stateBlock}>
          <p className={styles.stateError}>{errorMessage}</p>
          <button type="button" className={styles.retryButton} onClick={() => void loadArticle()}>
            <RefreshCw size={16} aria-hidden />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loadState === "not-found" || !article) {
    return (
      <div className={styles.slugPage}>
        <p className={styles.stateMessage}>Article not found. Redirecting…</p>
      </div>
    );
  }

  const showOnboardingCta = from === "onboarding" && staticSubpages.length === 0;

  return (
    <article className={styles.slugPage}>
      <BackButton href={backHref} label={backLabel} />

      <header className={styles.heroCard}>
        <div className={styles.metaRow}>
          {article.categoryName ? (
            <span className={styles.categoryBadge}>{article.categoryName}</span>
          ) : null}
          <span className={styles.sourceBadge}>OWOW Playbook</span>
          {article.fromFallback ? (
            <span className={styles.sourceBadge}>Preview metadata</span>
          ) : null}
        </div>
        <h1 className={styles.title}>{article.title}</h1>
        {article.summary ? (
          <div className={styles.summaryCard}>
            <p className={styles.summaryLabel}>Summary</p>
            <p className={styles.summaryText}>{article.summary}</p>
          </div>
        ) : null}
      </header>

      {staticSubpages.length > 0 ? (
        <section className={styles.subpages}>
          <h2 className={styles.subpagesTitle}>Subtopics</h2>
          <ul className={styles.subpagesList}>
            {staticSubpages.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={`/playbook/${sub.slug}${from ? `?from=${from}` : ""}`}
                  className={styles.subpage}
                >
                  {sub.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.contentCard}>{renderArticleContent(article.content)}</section>

      {article.fromFallback ? (
        <p className={styles.fallbackNote}>
          Showing preview metadata until this article is published from the admin hub.
        </p>
      ) : null}

      <section className={styles.supportCard}>
        <PlaybookSupportActions
          onFeedback={() => setFeedbackOpen(true)}
          onMissingInfo={() => setMissingInfoOpen(true)}
          missingLabel="Something missing?"
        />
      </section>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        articleId={article.id}
        articleTitle={article.title}
        articleSlug={article.slug}
      />
      <MissingInfoModal
        open={missingInfoOpen}
        onClose={() => setMissingInfoOpen(false)}
        articleId={article.id}
        articleSlug={article.slug}
        sourceHint={`Article: ${article.title}`}
        defaultTitle={`Missing info: ${article.title}`}
      />

      {showOnboardingCta ? (
        <section className={styles.completeCard}>
          <p className={styles.completeText}>
            Mark this reading complete to advance your onboarding progress. Completion is
            stored locally in your browser until server-side tracking is added.
          </p>
          <button
            type="button"
            className={`${styles.completeButton} ${completed ? styles.completeButtonDone : ""}`}
            onClick={handleMarkComplete}
            disabled={completed || completing}
          >
            {completed ? (
              <>
                <CheckCircle size={18} aria-hidden style={{ verticalAlign: "middle", marginRight: 6 }} />
                Completed
              </>
            ) : completing ? (
              "Saving…"
            ) : (
              "Mark as complete ✓"
            )}
          </button>
        </section>
      ) : null}
    </article>
  );
}
