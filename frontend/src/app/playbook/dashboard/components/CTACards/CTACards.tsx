import styles from "./CTACards.module.css";
import Link from "next/link";
import { ctaCards } from "@/lib/data/ctacards";

export default function CTACards() {
  return (
    <section className={styles.cards}>
      {ctaCards.map((card) => (
        <Link key={card.title} href={card.href} className={styles.card}>
          <card.icon className={styles.icon} />
          <h2 className={styles.title}>{card.title}</h2>
          <p className={styles.description}>{card.description}</p>
        </Link>
      ))}
    </section>
  );
}
