"use client";
import { useState } from "react";
import styles from "./page.module.css";
import SearchBar from "./components/SearchBar/SearchBar";
import TopicsList from "./components/TopicsList/TopicsList";
import { categories } from "@/lib/data/categories";
import Feedback from "./components/Feedback/Feedback";
import Greeting from "./components/Greeting/Greeting";

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = searchQuery
    ? categories
        .map((category) => ({
          ...category,
          pages: category.pages.filter(
            (page) =>
              page.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              page.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              (page.subpages.length > 0 ? "subtopics" : "article").includes(
                searchQuery.toLowerCase(),
              ),
          ),
        }))
        .filter((category) => category.pages.length > 0)
    : categories;
  return (
    <div className={styles.topicsPage}>
      <Greeting />
      <SearchBar onSearch={setSearchQuery} />
      {filteredCategories.length > 0 && (
        <ul className={styles.content}>
          {filteredCategories.map((category) => (
            <TopicsList key={category.slug} category={category} />
          ))}
        </ul>
      )}
      {searchQuery && filteredCategories.length === 0 && <Feedback />}
    </div>
  );
}
