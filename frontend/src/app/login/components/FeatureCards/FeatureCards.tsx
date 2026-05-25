import styles from "./FeatureCards.module.css";
import { Search, TrendingUp, FileText, Users } from "lucide-react";

const features = [
  { icon: Search, title: "Ask AI anything", description: "Powered by AI" },
  {
    icon: TrendingUp,
    title: "Analytics insights",
    description: "Data-driven decisions",
  },
  {
    icon: FileText,
    title: "Knowledge base",
    description: "Centralized information",
  },
  {
    icon: Users,
    title: "Team directory",
    description: "Understand your team",
  },
];

export default function FeatureCards() {
  return (
    <section className={styles.featureCards}>
      {features.map((feature) => (
        <div key={feature.title} className={styles.card}>
          <feature.icon className={styles.icon} />
          <h3 className={styles.title}>{feature.title}</h3>
          <p className={styles.description}>{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
