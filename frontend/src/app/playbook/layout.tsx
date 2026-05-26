"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./layout.module.css";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import PlaybookAuthGuard from "@/components/ui/PlaybookAuthGuard";
import WizKidAssistantWidget from "@/components/playbook/WizKidAssistantWidget/WizKidAssistantWidget";
import { WizKidArticleProvider } from "@/components/playbook/WizKidAssistantWidget/WizKidArticleContext";
import { shouldShowWizKidAssistant } from "@/components/playbook/WizKidAssistantWidget/wizKidVisibility";

function PlaybookLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";
  const showWizKidAssistant = shouldShowWizKidAssistant(pathname, fromOnboarding);

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>{children}</div>
      {showWizKidAssistant ? <WizKidAssistantWidget /> : null}
    </div>
  );
}

export default function PlaybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PlaybookAuthGuard>
      <WizKidArticleProvider>
        <Suspense fallback={null}>
          <PlaybookLayoutInner>{children}</PlaybookLayoutInner>
        </Suspense>
      </WizKidArticleProvider>
    </PlaybookAuthGuard>
  );
}
