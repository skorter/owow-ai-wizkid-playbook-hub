"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";
import { Search, Paperclip, Send } from "lucide-react";

type SearchBarProps = {
  initialQuery?: string;
  onSearch: (query: string) => void;
};

export default function SearchBar({ initialQuery = "", onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(() => initialQuery);

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
      <button type="submit" className={styles.sendButton} aria-label="Submit search">
        <Send className={styles.icon} />
      </button>
    </form>
  );
}
