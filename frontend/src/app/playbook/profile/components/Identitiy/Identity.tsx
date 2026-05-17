import styles from "./Identity.module.css";
import {
  Brain,
  SquarePen,
  Calendar,
  TrendingUp,
  Sparkles,
  Award,
} from "lucide-react";
import { user } from "@/lib/data/user";

type IdentityProps = {
  onEdit: () => void;
};

export default function Identity({ onEdit }: IdentityProps) {
  const image = null;
  return (
    <section className={styles.identity}>
      <div className={styles.avatar}>
        {image ? (
          <img className={styles.image} src={image} alt="User Avatar" />
        ) : (
          <span className={styles.initials}>{user.initials}</span>
        )}
      </div>

      <div className={styles.information}>
        <h1 className={styles.name}>{user.fullName}</h1>
        <div className={styles.tags}>
          <span className={styles.tag}>{user.role}</span>
          <span className={styles.tag}>{user.department}</span>
          <span className={styles.tag}>{user.position}</span>
        </div>
      </div>

      <button className={styles.editButton} onClick={onEdit}>
        <SquarePen /> Edit Profile
      </button>

      <div className={styles.aiSummary}>
        <Brain className={styles.brainIcon} />
        <h2 className={styles.label}>AI Profile Summary</h2>
        <p className={styles.description}>{user.aiSummary}</p>
      </div>

      <div className={styles.metadata}>
        <article className={styles.data}>
          <Calendar className={styles.calendarIcon} />
          <p className={styles.label}>Joined</p>
          <p className={styles.value}>{user.startDate}</p>
        </article>
        <article className={styles.data}>
          <TrendingUp className={styles.trendingUpIcon} />
          <p className={styles.label}>Onboarding</p>
          <p className={styles.value}>{user.onboardingProgress}%</p>
        </article>
        <article className={styles.data}>
          <Sparkles className={styles.sparklesIcon} />
          <p className={styles.label}>AI Searches</p>
          <p className={styles.value}>{user.aiSearches}</p>
        </article>
        <article className={styles.data}>
          <Award className={styles.awardIcon} />
          <p className={styles.label}>Level</p>
          <p className={styles.value}>{user.level}</p>
        </article>
      </div>
    </section>
  );
}
