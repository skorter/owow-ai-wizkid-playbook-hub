import styles from "./SearchBar.module.css";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (isSearching: boolean) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <label className={styles.searchBar}>
      <input
        type="text"
        placeholder="Ask anything about OWOW..."
        className={styles.input}
        onChange={(e) => onSearch(e.target.value.length > 5)}
      />
      <button type="submit" className={styles.searchButton}>
        <Search className={styles.searchIcon} />
      </button>
    </label>
  );
}
