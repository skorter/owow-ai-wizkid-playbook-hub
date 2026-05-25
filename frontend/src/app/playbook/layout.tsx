"use client";

import { usePathname } from "next/navigation";
import styles from "./layout.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import PlaybookAuthGuard from "@/components/ui/PlaybookAuthGuard";
import WizKidAssistantWidget from "@/components/playbook/WizKidAssistantWidget/WizKidAssistantWidget";

const WIZKID_ASSISTANT_PATHS = new Set([
  "/playbook/dashboard",
  "/playbook/topics",
  "/playbook/onboarding",
]);

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showWizKidAssistant = WIZKID_ASSISTANT_PATHS.has(pathname);

  return (
    <PlaybookAuthGuard>
      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.content}>{children}</div>
        {showWizKidAssistant ? <WizKidAssistantWidget /> : null}
      </div>
    </PlaybookAuthGuard>
  );
}
