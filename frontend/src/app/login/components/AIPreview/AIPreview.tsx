import styles from "./AIPreview.module.css";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AIPreview() {
  return (
    <section className={styles.preview}>
      <Sparkles className={styles.sparklesIcon} />
      <p className={styles.label}>AI Assistant Preview</p>
      <p className={styles.question}>"How do I request time off?"</p>
      <ArrowRight className={styles.arrowIcon} />
    </section>
  );
}
