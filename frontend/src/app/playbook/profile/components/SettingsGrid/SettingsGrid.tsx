"use client";
import { useState } from "react";
import styles from "./SettingsGrid.module.css";
import {
  Sun,
  Moon,
  Monitor,
  Shield,
  Globe,
  Accessibility,
  ArrowRight,
} from "lucide-react";

export default function SettingsGrid() {
  const [theme, setTheme] = useState("dark");
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);

  return (
    <section className={styles.settingsGrid}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Sun className={`${styles.icon} ${styles.sunIcon}`} />
          <h3 className={styles.title}>Appearance</h3>
        </div>
        <div className={styles.themeButtons}>
          {[
            { value: "light", label: "Light", Icon: Sun },
            { value: "dark", label: "Dark", Icon: Moon },
            { value: "system", label: "System", Icon: Monitor },
          ].map(({ value, label, Icon }) => (
            <button
              key={value}
              className={`${styles.themeButton} ${theme === value ? styles.active : ""}`}
              onClick={() => setTheme(value)}
            >
              <Icon className={styles.themeIcon} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <div className={styles.toggle}>
          <div>
            <p className={styles.label}>Reduce animations</p>
            <p className={styles.description}>Minimize motion effects</p>
          </div>
          <button
            className={`${styles.toggleButton} ${reduceAnimations ? styles.on : ""}`}
            onClick={() => setReduceAnimations(!reduceAnimations)}
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <Shield className={`${styles.icon} ${styles.shieldIcon}`} />
          <h3 className={styles.title}>Privacy & Security</h3>
        </div>
        <div className={styles.links}>
          {[
            "Change password",
            "Two-factor authentication",
            "Active sessions",
            "Download my data",
          ].map((item) => (
            <button key={item} className={styles.linkButton}>
              <span>{item}</span>
              <ArrowRight className={styles.arrowIcon} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <Globe className={`${styles.icon} ${styles.globeIcon}`} />
          <h3 className={styles.title}>Language & Region</h3>
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <p className={styles.label}>Language</p>
            <select className={styles.select}>
              <option>English</option>
              <option>Dutch</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <div className={styles.field}>
            <p className={styles.label}>Timezone</p>
            <select className={styles.select}>
              <option>Europe/Amsterdam</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.header}>
          <Accessibility
            className={`${styles.icon} ${styles.accessibilityIcon}`}
          />
          <h3 className={styles.title}>Accessibility</h3>
        </div>
        <div className={styles.toggles}>
          <div className={styles.toggle}>
            <div>
              <p className={styles.label}>High contrast mode</p>
              <p className={styles.description}>Increase visual contrast</p>
            </div>
            <button
              className={`${styles.toggleButton} ${highContrast ? styles.on : ""}`}
              onClick={() => setHighContrast(!highContrast)}
            />
          </div>
          <div className={styles.toggle}>
            <div>
              <p className={styles.label}>Larger text</p>
              <p className={styles.description}>Increase font sizes</p>
            </div>
            <button
              className={`${styles.toggleButton} ${largerText ? styles.on : ""}`}
              onClick={() => setLargerText(!largerText)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
