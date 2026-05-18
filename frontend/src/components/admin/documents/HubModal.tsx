"use client";

import { X } from "lucide-react";
import styles from "./hub-ui.module.css";

type HubModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function HubModal({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: HubModalProps) {
  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden />
      <div className={styles.modal} role="dialog" aria-modal aria-labelledby="hub-modal-title">
        <header className={styles.modalHeader}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <h2 id="hub-modal-title" className={styles.drawerTitle}>
                {title}
              </h2>
              {subtitle ? <p className={styles.drawerSubtitle}>{subtitle}</p> : null}
            </div>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </header>
        <div className={styles.modalBody}>{children}</div>
        {footer ? <footer className={styles.modalFooter}>{footer}</footer> : null}
      </div>
    </>
  );
}
