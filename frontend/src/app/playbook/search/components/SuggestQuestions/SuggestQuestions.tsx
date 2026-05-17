import styles from "./SuggestQuestions.module.css";
import { ArrowRight } from "lucide-react";
import { suggestedQuestions } from "@/lib/data/search";

export default function SuggestQuestions() {
  return (
    <section className={styles.questions}>
      <h2 className={styles.title}>Suggest Questions</h2>
      <ul className={styles.list}>
        {suggestedQuestions.map((question) => (
          <li key={question} className={styles.item}>
            <span>{question}</span>
            <ArrowRight className={styles.icon} />
          </li>
        ))}
      </ul>
    </section>
  );
}
