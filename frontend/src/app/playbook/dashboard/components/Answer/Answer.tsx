"use client";
import styles from "./Answer.module.css";
import {
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { answer, sourceDocuments } from "@/lib/data/answer";

type AnswerProps = {
  onThumbsDown: () => void;
  onThumbsUp: () => void;
  thumbsUp: boolean;
  thumbsDown: boolean;
};

export default function Answer({
  onThumbsDown,
  onThumbsUp,
  thumbsUp,
  thumbsDown,
}: AnswerProps) {
  return (
    <section className={styles.results}>
      <div className={styles.answer}>
        <div className={styles.header}>
          <Sparkles className={styles.icon} />
          <h2 className={styles.title}>Answer</h2>
          <p className={styles.description}>{answer.answer}</p>
        </div>
        <div className={styles.feedback}>
          <p className={styles.label}>Was this answer helpful?</p>
          <div className={styles.actions}>
            <button className={styles.yesButton} onClick={onThumbsUp}>
              <ThumbsUp
                className={`${styles.icon} ${thumbsUp ? styles.active : ""}`}
              />
            </button>
            <button className={styles.noButton} onClick={onThumbsDown}>
              <ThumbsDown
                className={`${styles.icon} ${thumbsDown ? styles.active : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
      <div className={styles.sources}>
        <h2 className={styles.title}>Source Documents</h2>
        <ul className={styles.list}>
          {sourceDocuments.map((doc) => (
            <li key={doc.slug}>
              <Link href={`/playbook/${doc.slug}`} className={styles.result}>
                <div className={styles.badge}>{doc.badge}</div>
                <h3 className={styles.title}>{doc.title}</h3>
                <p className={styles.section}>Section: {doc.section}</p>
                <ExternalLink className={styles.icon} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.redirection}>
        <h2 className={styles.label}>Can't find what you're looking for?</h2>
        <Link href="/playbook/search" className={styles.link}>
          AI Powered Search Engine →
        </Link>
      </div>
    </section>
  );
}
