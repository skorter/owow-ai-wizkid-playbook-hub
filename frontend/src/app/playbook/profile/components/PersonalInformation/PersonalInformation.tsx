import styles from "./PersonalInformation.module.css";
import { User, Mail, Building2, Briefcase, Calendar } from "lucide-react";

export default function PersonalInformation() {
  return (
    <section className={styles.personalInformation}>
      <div className={styles.header}>
        <User className={styles.userIcon} />
        <h2 className={styles.title}>Personal Information</h2>
      </div>
      <div className={styles.metadata}>
        <article className={styles.data}>
          <Mail className={styles.mailIcon} />
          <p className={styles.label}>Email</p>
          <p className={styles.value}>john.doe@owow.io</p>
        </article>
        <article className={styles.data}>
          <Building2 className={styles.buildingIcon} />
          <p className={styles.label}>Department</p>
          <p className={styles.value}>Design Team</p>
        </article>
        <article className={styles.data}>
          <Briefcase className={styles.briefcaseIcon} />
          <p className={styles.label}>Role</p>
          <p className={styles.value}>Senior Designer</p>
        </article>
        <article className={styles.data}>
          <Calendar className={styles.calendarIcon} />
          <p className={styles.label}>Start Date</p>
          <p className={styles.value}>January 2022</p>
        </article>
      </div>
    </section>
  );
}
