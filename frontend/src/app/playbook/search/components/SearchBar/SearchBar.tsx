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
};

export default function SearchBar({
  initialQuery = "",
  query: controlledQuery,
  onQueryChange,
  onSearch,
  loading = false,
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
  };

  const submit = (value: string) => {
    const trimmed = value.trim();
    onSearch(trimmed);
    if (trimmed) {
      router.replace(`/playbook/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(query);
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <Search className={styles.icon} />
      <input
        type="text"
        placeholder="How can I help you today?"
        className={styles.input}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <button type="button" className={styles.attachButton} aria-label="Attach file">
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
