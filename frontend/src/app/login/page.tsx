"use client";

import { useCallback, useRef, useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Header from "./components/Header/Header";
import Form, { type LoginMode } from "./components/Form/Form";
import { apiPost, endpoints, ApiError } from "@/lib/api";
import type { ApiAuthData } from "@/lib/api/types";
import { getPostLoginPath, saveSession } from "@/lib/auth/session";
import Hero from "./components/Hero/Hero";
import FeatureCards from "./components/FeatureCards/FeatureCards";
import AIPreview from "./components/AIPreview/AIPreview";
import Stats from "./components/Stats/Stats";
import AIAssistant from "./components/AIAssistant/AIAssistant";
import TransitionOverlay from "@/components/TransitionOverlay/TransitionOverlay";

type TransitionState = {
  type: "employee" | "management" | "onboarding";
  originX: number;
  originY: number;
};

function loginModeToTransitionType(
  mode: LoginMode,
): TransitionState["type"] {
  return mode;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const pendingPathRef = useRef<string | null>(null);
  const router = useRouter();

  const triggerShake = useCallback(() => {
    setShake(true);
    window.setTimeout(() => setShake(false), 400);
  }, []);

  const handleLogin = async (
    loginMode: LoginMode,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setError("");
    setLoading(true);

    const originX = event.clientX;
    const originY = event.clientY;

    try {
      const data = await apiPost<ApiAuthData>(
        endpoints.auth.login,
        { email: email.trim(), password, loginMode },
        { skipAuth: true },
      );

      saveSession(data.user, data.token);
      pendingPathRef.current = getPostLoginPath(data.user.role);
      setTransition({
        type: loginModeToTransitionType(loginMode),
        originX,
        originY,
      });
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Please try again.";
      setError(message);
      triggerShake();
      setLoading(false);
    }
  };

  const handleTransitionComplete = () => {
    const path = pendingPathRef.current;
    if (path) {
      router.push(path);
    }
    pendingPathRef.current = null;
    setTransition(null);
    setLoading(false);
  };

  return (
    <div className={styles.loginPage}>
      <div className={`${styles.orb} ${styles.orbYellow}`} />
      <div className={`${styles.orb} ${styles.orbOrange}`} />
      <div className={`${styles.orb} ${styles.orbBlue}`} />
      <div className={styles.leftPanel}>
        <Header />
        <Hero />
        <FeatureCards />
        <AIPreview />
        <Stats />
      </div>
      <div className={styles.rightPanel}>
        <Form
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          shake={shake}
          onLogin={handleLogin}
        />
        <AIAssistant />
      </div>
      {transition && (
        <TransitionOverlay
          type={transition.type}
          originX={transition.originX}
          originY={transition.originY}
          onComplete={handleTransitionComplete}
        />
      )}
    </div>
  );
}
