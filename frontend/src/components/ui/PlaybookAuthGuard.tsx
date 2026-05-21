"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, endpoints } from "@/lib/api";
import { getAuthToken } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";
import { clearSession, hasAuthToken, saveSession } from "@/lib/auth/session";
import styles from "@/components/admin/AdminAuthGuard.module.css";

type PlaybookAuthGuardProps = {
  children: React.ReactNode;
};

/**
 * Requires a valid session for employee/playbook routes.
 * Redirects to /login when unauthenticated or after logout.
 */
export default function PlaybookAuthGuard({ children }: PlaybookAuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      if (!hasAuthToken()) {
        router.replace("/login");
        return;
      }

      try {
        const user = await apiGet<ApiUser>(endpoints.auth.me);
        if (cancelled) return;

        const token = getAuthToken();
        if (token) {
          saveSession(user, token);
        }

        setAuthorized(true);
      } catch {
        if (cancelled) return;
        clearSession();
        router.replace("/login");
      }
    }

    verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div className={styles.shell}>
        <p className={styles.loadingText}>Loading…</p>
      </div>
    );
  }

  return children;
}
