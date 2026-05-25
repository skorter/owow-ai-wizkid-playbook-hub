"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const submit = (value: string) => {
    const trimmed = value.trim();
    onSearch?.(trimmed);

    if (trimmed.length > 0) {
      router.push(`/playbook/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(query);
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask anything about OWOW..."
        className={styles.input}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
      />
      <button type="submit" className={styles.searchButton} aria-label="Search playbook">
        <Search className={styles.icon} />
      </button>
    </form>
  );
}
