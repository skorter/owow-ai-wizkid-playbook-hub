"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Greeting from "./components/Greeting/Greeting";
import SearchBar from "./components/SearchBar/SearchBar";
import Information from "./components/Information/Information";
import CTACards from "./components/CTACards/CTACards";

export default function DashboardPage() {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <div className={styles.dashboardPage}>
      <Greeting />
      <SearchBar onSearch={setIsSearching} />
      {!isSearching && <Information />}
      {!isSearching && <CTACards />}
      <section className={styles.footer}>
        Built with &lt; 3 for OWOW from Ilia and Sylvio.
      </section>
    </div>
  );
}
