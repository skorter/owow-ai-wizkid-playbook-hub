"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import TopicsList from "./components/TopicsList/TopicsList";
import Feedback from "./components/Feedback/Feedback";
import Greeting from "./components/Greeting/Greeting";
import { fetchPlaybookTopics } from "@/lib/mappers/playbook";
import type { Category } from "@/types/playbook";
import { ApiError } from "@/lib/api";
import { RefreshCw } from "lucide-react";

type LoadState = "loading" | "error" | "ready";

export default function TopicsPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTopics = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      const result = await fetchPlaybookTopics();
      setCategories(result.categories);
      setLoadState("ready");
    } catch (err) {
      setCategories([]);
      setLoadState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Could not load topics. Please try again.",
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      setErrorMessage("");

      try {
        const result = await fetchPlaybookTopics();
        if (cancelled) return;
        setCategories(result.categories);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        setCategories([]);
        setLoadState("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load topics. Please try again.",
        );
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        pages: category.pages.filter(
          (page) =>
            page.label.toLowerCase().includes(query) ||
            page.description.toLowerCase().includes(query) ||
            "article".includes(query),
        ),
      }))
      .filter((category) => category.pages.length > 0);
  }, [categories, searchQuery]);

  if (loadState === "loading") {
    return (
      <div className={styles.topicsPage}>
        <Greeting />
        <p className={styles.stateMessage}>Loading topics…</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className={styles.topicsPage}>
        <Greeting />
        <div className={styles.stateBlock}>
          <p className={styles.stateError}>{errorMessage}</p>
          <button type="button" className={styles.retryButton} onClick={loadTopics}>
            <RefreshCw size={16} aria-hidden />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = categories.length === 0;

  return (
    <div className={styles.topicsPage}>
      <Greeting />
      <SearchBar onSearch={setSearchQuery} />

      {isEmpty ? (
        <p className={styles.panelEmpty}>No published topics are available yet.</p>
      ) : null}

      {!isEmpty && filteredCategories.length > 0 ? (
        <ul className={styles.content}>
          {filteredCategories.map((category) => (
            <TopicsList key={category.slug} category={category} />
          ))}
        </ul>
      ) : null}

      {!isEmpty && searchQuery && filteredCategories.length === 0 ? (
        <Feedback searchQuery={searchQuery} />
      ) : null}
    </div>
  );
}
