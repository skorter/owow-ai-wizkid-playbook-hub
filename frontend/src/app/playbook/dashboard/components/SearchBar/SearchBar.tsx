import styles from "./SearchBar.module.css";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <label className={styles.searchBar}>
      <input
        type="text"
        placeholder="Ask anything about OWOW..."
        className={styles.input}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button type="button" className={styles.searchButton}>
        <Search className={styles.icon} />
      </button>
    </label>
  );
}
