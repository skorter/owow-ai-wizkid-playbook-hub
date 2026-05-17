import styles from "./SearchBar.module.css";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <label className={styles.searchBar}>
      <Search className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search topics..."
        className={styles.input}
        onChange={(e) => onSearch(e.target.value)}
      />
    </label>
  );
}
