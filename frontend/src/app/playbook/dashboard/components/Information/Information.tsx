import styles from "./Information.module.css";

export default function Information() {
  return (
    <section className={styles.information}>
      <h2 className={styles.title}>What is OWOW's Playbook?</h2>
      <div className={styles.body}>
        <p className={styles.paragraph}>
          OWOW's Playbook is our living document — the single source of truth
          for everything related to working here.
        </p>
        <p className={styles.paragraph}>
          It captures what we've learned along the way: how we collaborate, how
          we build teams, and how we've grown from our mistakes. You'll find
          answers to the practical stuff — time off, salaries, growth paths —
          and the less obvious stuff, like how we handle feedback or navigate
          client chaos. No fluff, no corporate speak. Just clarity on how things
          actually work at OWOW.
        </p>
        <p className={styles.paragraph}>
          This document isn't finished, and it never will be. As we evolve, so
          does the Playbook. Think of it as a reflection of who we are right
          now, always being refined.
        </p>
        <p className={styles.paragraph}>
          If you're new, start here. If you've been around for a while, come
          back here. And if something feels off or missing — say something. This
          Playbook belongs to all of us.
        </p>
        <p className={styles.paragraph}>
          Welcome to the team (back), Wizkid. 👋
        </p>
      </div>
    </section>
  );
}
