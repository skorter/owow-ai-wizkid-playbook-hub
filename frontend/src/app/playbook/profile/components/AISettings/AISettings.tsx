"use client";

import { useEffect, useState } from "react";
import styles from "./AISettings.module.css";
import { Bot } from "lucide-react";
import { getAIStatus, type AIStatusResponse } from "@/lib/api/ai";
import { getApiErrorMessage } from "@/lib/api";
import PageStatus from "@/components/ui/PageStatus";
import { toggleOptions } from "@/lib/data/profile";

type LoadState = "loading" | "ready" | "error";

export default function AISettings() {
  const [confidence, setConfidence] = useState(75);
  const [tone, setTone] = useState("balanced");
  const [toggles, setToggles] = useState<string[]>([
    "smart-recommendations",
    "auto-save",
    "show-sources",
  ]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [status, setStatus] = useState<AIStatusResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const loadStatus = async () => {
    setLoadState("loading");
    setErrorMessage("");
    try {
      const data = await getAIStatus();
      setStatus(data);
      setLoadState("ready");
    } catch (err) {
      setStatus(null);
      setLoadState("error");
      setErrorMessage(
        getApiErrorMessage(err, "Could not load AI status. Try again later."),
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      setLoadState("loading");
      setErrorMessage("");
      try {
        const data = await getAIStatus();
        if (cancelled) return;
        setStatus(data);
        setLoadState("ready");
      } catch (err) {
        if (cancelled) return;
        setStatus(null);
        setLoadState("error");
        setErrorMessage(
          getApiErrorMessage(err, "Could not load AI status. Try again later."),
        );
      }
    }

    void fetchStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggle = (slug: string) => {
    setToggles((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const backendLabel =
    status == null
      ? ""
      : status.configured
        ? `Backend AI: ${status.provider} (${status.model})`
        : "Backend AI: fallback mode (OpenAI not enabled)";

  return (
    <section className={styles.aiSettings}>
      <div className={styles.header}>
        <Bot className={styles.icon} />
        <h2 className={styles.title}>AI Assistant Settings</h2>
        <p className={styles.subtitle}>Configure your personal AI experience</p>
        {loadState === "loading" ? (
          <PageStatus variant="loading" message="Checking AI service status…" />
        ) : null}
        {loadState === "error" ? (
          <PageStatus
            variant="error"
            message={errorMessage}
            onRetry={() => void loadStatus()}
          />
        ) : null}
        {loadState === "ready" && backendLabel ? (
          <p className={styles.backendStatus}>{backendLabel}</p>
        ) : null}
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
              type="button"
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
              type="button"
              className={`${styles.toggleButton} ${toggles.includes(option.slug) ? styles.on : ""}`}
              onClick={() => handleToggle(option.slug)}
              aria-pressed={toggles.includes(option.slug)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
