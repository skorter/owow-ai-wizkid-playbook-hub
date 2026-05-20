"use client";

import { RefreshCw } from "lucide-react";
import styles from "./PageStatus.module.css";

type PageStatusProps = {
  variant: "loading" | "error" | "empty";
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export default function PageStatus({
  variant,
  message,
  onRetry,
  retryLabel = "Retry",
  className,
}: PageStatusProps) {
  const rootClass = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role={variant === "error" ? "alert" : "status"}>
      <p className={styles.message}>{message}</p>
      {variant === "error" && onRetry ? (
        <button type="button" className={styles.retryButton} onClick={onRetry}>
          <RefreshCw size={16} aria-hidden />
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
