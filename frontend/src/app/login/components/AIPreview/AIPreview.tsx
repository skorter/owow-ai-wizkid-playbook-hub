"use client";

import { useEffect, useState } from "react";
import styles from "./AIPreview.module.css";
import { Sparkles, ArrowRight } from "lucide-react";

const QUESTIONS = [
  "How do I request time off?",
  "What is the expenses policy?",
  "Who is my team lead?",
  "Where do I find the onboarding docs?",
  "How do I submit a missing content request?",
];

const TYPE_MS = 40;
const DELETE_MS = 25;
const PAUSE_FULL_MS = 1800;
const PAUSE_EMPTY_MS = 400;

export default function AIPreview() {
  const [displayText, setDisplayText] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const question = QUESTIONS[questionIndex];
    let timeoutId: ReturnType<typeof setTimeout>;

    if (!isDeleting && charIndex < question.length) {
      timeoutId = setTimeout(() => {
        setDisplayText(question.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, TYPE_MS);
    } else if (!isDeleting && charIndex === question.length) {
      timeoutId = setTimeout(() => setIsDeleting(true), PAUSE_FULL_MS);
    } else if (isDeleting && charIndex > 0) {
      timeoutId = setTimeout(() => {
        setCharIndex((c) => c - 1);
        setDisplayText(question.slice(0, charIndex - 1));
      }, DELETE_MS);
    } else if (isDeleting && charIndex === 0) {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setQuestionIndex((i) => (i + 1) % QUESTIONS.length);
      }, PAUSE_EMPTY_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [questionIndex, charIndex, isDeleting]);

  return (
    <section className={styles.preview}>
      <Sparkles className={styles.sparklesIcon} />
      <p className={styles.label}>AI Assistant Preview</p>
      <p className={styles.question}>
        &ldquo;
        {displayText}
        <span className={styles.cursor} aria-hidden />
        &rdquo;
      </p>
      <ArrowRight className={styles.arrowIcon} />
    </section>
  );
}
