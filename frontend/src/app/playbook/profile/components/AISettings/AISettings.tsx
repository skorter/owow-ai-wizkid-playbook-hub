"use client";
import { useState } from "react";
import styles from "./AISettings.module.css";
import { Bot } from "lucide-react";

const toggleOptions = [
  {
    slug: "smart-recommendations",
    label: "Smart Recommendations",
    description: "Get AI-suggested articles",
  },
  {
    slug: "auto-save",
    label: "Auto-save Searches",
    description: "Automatically save your search history",
  },
  {
    slug: "show-sources",
    label: "Show Source Documents",
    description: "Display source references in AI answers",
  },
];

export default function AISettings() {
  const [confidence, setConfidence] = useState(75);
  const [tone, setTone] = useState("balanced");
  const [toggles, setToggles] = useState<string[]>([
    "smart-recommendations",
    "auto-save",
    "show-sources",
  ]);

  const handleToggle = (slug: string) => {
    setToggles((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  return (
    <section className={styles.aiSettings}>
      <div className={styles.header}>
        <Bot className={styles.botIcon} />
        <h2 className={styles.title}>AI Assistant Settings</h2>
        <p className={styles.subtitle}>Configure your personal AI experience</p>
      </div>

      <div className={styles.setting}>
        <div className={styles.header}>
          <p className={styles.label}>AI Confidence Level</p>
          <span className={styles.value}>{confidence}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className={styles.slider}
        />
        <div className={styles.labels}>
          <span>Conservative</span>
          <span>Confident</span>
          <span>Very Confident</span>
        </div>
      </div>

      <div className={styles.setting}>
        <p className={styles.label}>AI Response Tone</p>
        <div className={styles.toneButtons}>
          {["concise", "balanced", "detailed"].map((t) => (
            <button
              key={t}
              className={`${styles.toneButton} ${tone === t ? styles.active : ""}`}
              onClick={() => setTone(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.toggles}>
        {toggleOptions.map((option) => (
          <div key={option.slug} className={styles.toggle}>
            <div className={styles.information}>
              <p className={styles.label}>{option.label}</p>
              <p className={styles.description}>{option.description}</p>
            </div>
            <button
              className={`${styles.toggleButton} ${toggles.includes(option.slug) ? styles.on : ""}`}
              onClick={() => handleToggle(option.slug)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
