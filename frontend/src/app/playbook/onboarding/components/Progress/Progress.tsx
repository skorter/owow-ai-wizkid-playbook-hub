import styles from "./Progress.module.css";

type ProgressProps = {
  progress: number;
};

export default function Progress({ progress }: ProgressProps) {
  return (
    <section className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progress}%` }} />
      <span className={styles.label}>{progress}% completed</span>
    </section>
  );
}
