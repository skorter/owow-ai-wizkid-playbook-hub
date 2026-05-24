"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";
import { apiPost, endpoints, ApiError } from "@/lib/api";
import type { ApiAuthData } from "@/lib/api/types";
import { getPostLoginPath, saveSession } from "@/lib/auth/session";
import Hero from "./components/Hero/Hero";
import FeatureCards from "./components/FeatureCards/FeatureCards";
import AIPreview from "./components/AIPreview/AIPreview";
import Stats from "./components/Stats/Stats";
import AIAssistant from "./components/AIAssistant/AIAssistant";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await apiPost<ApiAuthData>(
        endpoints.auth.login,
        { email: email.trim(), password },
        { skipAuth: true },
      );

      saveSession(data.user, data.token);
      router.push(getPostLoginPath(data.user.role));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
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
          handleLogin={handleLogin}
        />
        <AIAssistant />
      </div>
    </div>
  );
}
