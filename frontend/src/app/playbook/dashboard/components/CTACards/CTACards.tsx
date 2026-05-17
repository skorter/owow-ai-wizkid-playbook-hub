import styles from "./CTACards.module.css";
import Link from "next/link";
import { Search, BookOpen, GraduationCap } from "lucide-react";

export default function CTACards() {
  return (
    <section className={styles.cards}>
      <Link href="/playbook/search" className={styles.card}>
        <Search className={styles.searchIcon} />
        <h2 className={styles.title}>Search</h2>
        <p className={styles.description}>Find specific information quickly.</p>
      </Link>
      <Link href="/playbook/topics" className={styles.card}>
        <BookOpen className={styles.bookIcon} />
        <h2 className={styles.title}>Browse Topics</h2>
        <p className={styles.description}>
          Explore all available topics in the Playbook.
        </p>
      </Link>
      <Link href="/playbook/onboarding" className={styles.card}>
        <GraduationCap className={styles.graduationCapIcon} />
        <h2 className={styles.title}>New here?</h2>
        <p className={styles.description}>Try our onboarding guide.</p>
      </Link>
    </section>
  );
}
