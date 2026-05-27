"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import TransitionOverlay from "@/components/TransitionOverlay/TransitionOverlay";

export type TransitionType = "employee" | "management" | "onboarding";

interface TransitionContextValue {
  navigateWithTransition: (
    href: string,
    type: TransitionType,
    originX: number,
    originY: number,
  ) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [active, setActive] = useState<{
    type: TransitionType;
    originX: number;
    originY: number;
    phase: "in" | "out";
  } | null>(null);
  const hrefRef = useRef("");

  const navigateWithTransition = useCallback(
    (href: string, type: TransitionType, originX: number, originY: number) => {
      hrefRef.current = href;
      setActive({ type, originX, originY, phase: "in" });
    },
    [],
  );

  const handleInComplete = useCallback(() => {
    router.push(hrefRef.current);
    setActive((prev) => (prev ? { ...prev, phase: "out" } : null));
  }, [router]);

  const handleOutComplete = useCallback(() => {
    setActive(null);
  }, []);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      {active ? (
        <TransitionOverlay
          type={active.type}
          originX={active.originX}
          originY={active.originY}
          phase={active.phase}
          onInComplete={handleInComplete}
          onOutComplete={handleOutComplete}
        />
      ) : null}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return ctx;
}
