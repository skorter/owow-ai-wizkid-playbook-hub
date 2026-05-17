import styles from "./Information.module.css";
import { playbookInformation } from "@/lib/data/playbook";

export default function Information() {
  return (
    <section className={styles.information}>
      <h2 className={styles.title}>{playbookInformation.title}</h2>
      <div className={styles.body}>
        {playbookInformation.paragraphs.map((paragraph, index) => (
          <p key={index} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
