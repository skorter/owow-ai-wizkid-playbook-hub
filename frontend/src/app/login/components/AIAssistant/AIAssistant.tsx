import styles from "./AIAssistant.module.css";
import { Sparkles } from "lucide-react";

export default function AIAssistant() {
  return (
    <section className={styles.assistant}>
      <Sparkles className={styles.sparklesIcon} />
      <div>
        <h3 className={styles.title}>AI Assistant Ready</h3>
        <p className={styles.description}>
          Once logged in, ask me anything about OWOW policies, tools, or team
          information.
        </p>
      </div>
    </section>
  );
}
