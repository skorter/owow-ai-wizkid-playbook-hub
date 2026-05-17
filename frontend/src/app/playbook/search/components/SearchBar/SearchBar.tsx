import styles from "./SearchBar.module.css";
import { Search, Paperclip, Send } from "lucide-react";

type SearchBarProps = {
  onSearch: (isSearching: boolean) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <label className={styles.searchBar}>
      <Search className={styles.searchIcon} />
      <input
        type="text"
        placeholder="How can I help you today?"
        className={styles.input}
        onChange={(e) => {
          onSearch(e.target.value.length > 5);
        }}
      />
      <button className={styles.attachButton}>
        <Paperclip className={styles.paperclipIcon} />
      </button>
      <button className={styles.sendButton}>
        <Send className={styles.sendIcon} />
      </button>
    </label>
  );
}
