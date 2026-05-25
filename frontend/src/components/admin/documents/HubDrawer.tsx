"use client";

import { X } from "lucide-react";
import styles from "./hub-ui.module.css";

type HubDrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function HubDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: HubDrawerProps) {
  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden />
      <aside className={styles.drawer} role="dialog" aria-modal aria-labelledby="hub-drawer-title">
        <header className={styles.drawerHeader}>
          <div>
            <h2 id="hub-drawer-title" className={styles.drawerTitle}>
              {title}
            </h2>
            {subtitle ? <p className={styles.drawerSubtitle}>{subtitle}</p> : null}
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className={styles.drawerBody}>{children}</div>
        {footer ? <footer className={styles.drawerFooter}>{footer}</footer> : null}
      </aside>
    </>
  );
}
