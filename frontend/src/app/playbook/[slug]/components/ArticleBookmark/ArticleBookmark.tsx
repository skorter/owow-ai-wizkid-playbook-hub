"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { fetchSavedArticles, saveArticle, unsaveArticle } from "@/lib/api/savedArticles";
import { getApiErrorMessage } from "@/lib/api";
import styles from "./ArticleBookmark.module.css";

type ArticleBookmarkProps = {
  articleId: string;
};

export default function ArticleBookmark({ articleId }: ArticleBookmarkProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSavedArticles();
        if (cancelled) return;
        setSaved(data.items.some((item) => item.articleId === articleId));
      } catch {
        if (!cancelled) setSaved(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  const toggle = async () => {
    if (busy || loading) return;
    setBusy(true);
    setError("");
    try {
      if (saved) {
        await unsaveArticle(articleId);
        setSaved(false);
      } else {
        await saveArticle(articleId);
        setSaved(true);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update bookmark."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={`${styles.button} ${saved ? styles.saved : ""}`}
        onClick={() => void toggle()}
        disabled={loading || busy}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved articles" : "Save article"}
      >
        <Bookmark className={styles.icon} aria-hidden />
        {loading ? "Checking…" : saved ? "Saved" : "Save article"}
      </button>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
