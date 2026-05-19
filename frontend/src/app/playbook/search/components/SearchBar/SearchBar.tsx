import styles from "./SearchBar.module.css";
import { Search, Paperclip, Send } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <label className={styles.searchBar}>
      <Search className={styles.icon} />
      <input
        type="text"
        placeholder="How can I help you today?"
        className={styles.input}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
      />
      <button className={styles.attachButton}>
        <Paperclip className={styles.icon} />
      </button>
      <button className={styles.sendButton}>
        <Send className={styles.icon} />
      </button>
    </label>
  );
}
