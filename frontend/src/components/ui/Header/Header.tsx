"use client";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        <span className={styles.accent}>OWOW&apos;s</span> Playbook
      </h1>
      <p className={styles.subtitle}>The smarter way to find what you need.</p>
    </header>
  );
}
