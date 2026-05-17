import styles from "./Greeting.module.css";

export default function Greeting() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Playbook Topics</h1>
      <p className={styles.description}>
        Explore the various topics covered in the OWOW Playbook, from company
        policies to team processes and best practices.
      </p>
    </section>
  );
}
