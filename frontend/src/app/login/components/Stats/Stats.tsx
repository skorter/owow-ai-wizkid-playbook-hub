import styles from "./Stats.module.css";

const stats = [
  { value: "89", label: "Team members" },
  { value: "124", label: "Knowledge articles" },
  { value: "1.2k+", label: "AI searches" },
];

export default function Stats() {
  return (
    <section className={styles.stats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <p className={styles.value}>{stat.value}</p>
          <p className={styles.label}>{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
