import styles from "./Identity.module.css";
import {
  Brain,
  SquarePen,
  Calendar,
  TrendingUp,
  Sparkles,
  Award,
} from "lucide-react";

export default function Identity() {
  const image = null;
  return (
    <section className={styles.identity}>
      <div className={styles.avatar}>
        {image ? (
          <img className={styles.image} src={image} alt="User Avatar" />
        ) : (
          <span className={styles.initials}>JD</span>
        )}
      </div>

      <div className={styles.information}>
        <h1 className={styles.name}>John Doe</h1>
        <div className={styles.tags}>
          <span className={styles.tag}>Employee</span>
          <span className={styles.tag}>Design Team</span>
          <span className={styles.tag}>Senior Designer</span>
        </div>
      </div>

      <button className={styles.editButton}>
        <SquarePen /> Edit Profile
      </button>

      <div className={styles.aiSummary}>
        <Brain className={styles.brainIcon} />
        <h2 className={styles.label}>AI Profile Summary</h2>
        <p className={styles.description}>
          Senior Designer with 2+ years at OWOW. Highly engaged with onboarding
          completion at 80%. Frequent AI user, particularly for HR policies and
          design resources. Active team collaborator.
        </p>
      </div>

      <div className={styles.metadata}>
        <article className={styles.data}>
          <Calendar className={styles.calendarIcon} />
          <p className={styles.label}>Joined</p>
          <p className={styles.value}>January 2022</p>
        </article>
        <article className={styles.data}>
          <TrendingUp className={styles.trendingUpIcon} />
          <p className={styles.label}>Onboarding</p>
          <p className={styles.value}>80%</p>
        </article>
        <article className={styles.data}>
          <Sparkles className={styles.sparklesIcon} />
          <p className={styles.label}>AI Searches</p>
          <p className={styles.value}>127</p>
        </article>
        <article className={styles.data}>
          <Award className={styles.awardIcon} />
          <p className={styles.label}>Level</p>
          <p className={styles.value}>Advanced</p>
        </article>
      </div>
    </section>
  );
}
