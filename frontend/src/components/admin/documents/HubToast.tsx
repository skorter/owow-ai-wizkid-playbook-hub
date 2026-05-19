"use client";

import { CheckCircle2 } from "lucide-react";
import styles from "./hub-ui.module.css";

export default function HubToast({ message, visible }: { message: string; visible: boolean }) {
  if (!visible) return null;
  return (
    <div className={styles.toast} role="status">
      <CheckCircle2 size={18} aria-hidden />
      {message}
    </div>
  );
}
