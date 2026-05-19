"use client";

import type { ManagementTabId } from "@/data/adminMockData";
import { managementTabs } from "@/data/adminMockData";
import styles from "@/app/admin/documents/page.module.css";

type ManagementTabsProps = {
  active: ManagementTabId;
  onChange: (tab: ManagementTabId) => void;
};

export default function ManagementTabs({ active, onChange }: ManagementTabsProps) {
  return (
    <nav className={styles.mgmtTabs} role="tablist" aria-label="Content management sections">
      {managementTabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          className={`${styles.mgmtTab} ${active === tab.id ? styles.mgmtTabActive : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
