"use client";

import styles from "./layout.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import PlaybookAuthGuard from "@/components/ui/PlaybookAuthGuard";

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlaybookAuthGuard>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </PlaybookAuthGuard>
  );
}
