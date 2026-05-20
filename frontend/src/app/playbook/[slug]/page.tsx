"use client";

import { useEffect, useState } from "react";
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
import { ApiError } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type LoadState = "loading" | "error" | "ready" | "not-found";

export default function SlugPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const from = searchParams.get("from") ?? undefined;

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [article, setArticle] = useState<PlaybookArticleDetail | null>(null);
  const [staticSubpages, setStaticSubpages] = useState<
    { label: string; slug: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadArticle = async () => {
    if (!slug) {
      setLoadState("not-found");
      return;
    }

    setLoadState("loading");
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

      if (!cancelled) {
        setLoadState("loading");
        setErrorMessage("");
        setStaticSubpages([]);
      }

      try {
        const data = await fetchPlaybookArticleBySlug(slug);
        if (cancelled) return;

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

    load();

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
          <button type="button" className={styles.retryButton} onClick={loadArticle}>
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

  return (
    <div className={styles.slugPage}>
      {from === "topics" ? (
        <Link href="/playbook/topics" className={styles.back}>
          ← Back to Topics
        </Link>
      ) : (
        <BackButton />
      )}
      <h1 className={styles.title}>{article.title}</h1>
      {article.summary ? (
        <p className={styles.description}>{article.summary}</p>
      ) : null}
      {staticSubpages.length > 0 ? (
        <div className={styles.subpages}>
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
        </div>
      ) : null}
      <div className={styles.content}>
        {article.content.split(/\n\n+/).map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
      {article.fromFallback ? (
        <p className={styles.fallbackNote}>
          Showing preview metadata until this article is published from the admin hub.
        </p>
      ) : null}
      {from === "onboarding" && staticSubpages.length === 0 ? (
        <button type="button" className={styles.completeButton}>
          Mark as complete ✓
        </button>
      ) : null}
    </div>
  );
}
