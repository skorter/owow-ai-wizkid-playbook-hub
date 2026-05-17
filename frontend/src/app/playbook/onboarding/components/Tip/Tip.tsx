import styles from "./Tip.module.css";
import { Lightbulb } from "lucide-react";

export default function Tip() {
  return (
    <section className={styles.proTip}>
      <p className={styles.title}>
        <Lightbulb className={styles.lightbulbIcon} />
        Pro Tip
      </p>
      <p className={styles.description}>
        You can always return to this onboarding flow from your dashboard. Take
        your time and revisit articles as needed!
      </p>
    </section>
  );
}
