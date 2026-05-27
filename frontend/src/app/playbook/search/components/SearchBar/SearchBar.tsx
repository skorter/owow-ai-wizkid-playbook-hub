"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";
import { Search, Paperclip, Send } from "lucide-react";

type SearchBarProps = {
  initialQuery?: string;
  query?: string;
  onQueryChange?: (value: string) => void;
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  navigateOnSubmit?: boolean;
  variant?: "hero" | "compact";
};

export default function SearchBar({
  initialQuery = "",
  query: controlledQuery,
  onQueryChange,
  onSearch,
  loading = false,
  placeholder = "How can I help you today?",
  navigateOnSubmit = true,
  variant = "hero",
}: SearchBarProps) {
  const router = useRouter();
  const [internalQuery, setInternalQuery] = useState(() => initialQuery);
  const isControlled = controlledQuery !== undefined;
  const query = isControlled ? controlledQuery : internalQuery;

  const setQuery = (value: string) => {
    if (isControlled) {
      onQueryChange?.(value);
    } else {
      setInternalQuery(value);
    }
    if (value === "") {
      onSearch("");
    }
  };

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    if (navigateOnSubmit) {
      router.replace(`/playbook/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(query);
  };

  return (
    <form
      className={`${styles.searchBar} ${variant === "compact" ? styles.searchBarCompact : ""}`}
      onSubmit={handleSubmit}
    >
      <Search className={styles.icon} />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="button"
        className={styles.attachButton}
        aria-label="Attach file"
      >
        <Paperclip className={styles.icon} />
      </button>
      <button
        type="submit"
        className={styles.sendButton}
        aria-label="Submit search"
        disabled={loading}
      >
        <Send className={styles.icon} />
      </button>
    </form>
  );
}
