import styles from "./SuggestQuestions.module.css";
import { ArrowRight } from "lucide-react";

export default function SuggestQuestions() {
  return (
    <section className={styles.questions}>
      <h2 className={styles.title}>Suggest Questions</h2>
      <ul className={styles.list}>
        {[
          "How do I request time off?",
          "What tools do I need access to?",
          "How does the performance review process work?",
          "What are the working hours?",
        ].map((question) => (
          <li key={question} className={styles.item}>
            <span>{question}</span>
            <ArrowRight className={styles.arrowRightIcon} />
          </li>
        ))}
      </ul>
    </section>
  );
}
