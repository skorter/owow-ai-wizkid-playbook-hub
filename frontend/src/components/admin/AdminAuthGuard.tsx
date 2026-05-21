"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet, endpoints, ApiError } from "@/lib/api";
import { getAuthToken } from "@/lib/api/client";
import type { ApiUser } from "@/lib/api/types";
import {
  clearSession,
  getStoredSessionUser,
  hasAuthToken,
  isHrAdmin,
  saveSession,
} from "@/lib/auth/session";
import "../admin/admin-tokens.css";
import styles from "./AdminAuthGuard.module.css";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      if (!hasAuthToken()) {
        router.replace("/login");
        return;
      }

      const cached = getStoredSessionUser();
      if (cached && !isHrAdmin(cached.role)) {
        router.replace("/playbook/dashboard");
        return;
      }

      try {
        const user = await apiGet<ApiUser>(endpoints.auth.me);
        if (cancelled) return;

        const token = getAuthToken();
        if (token) {
          saveSession(user, token);
        }

        if (!isHrAdmin(user.role)) {
          router.replace("/playbook/dashboard");
          return;
        }

        setAuthorized(true);
      } catch (err) {
        if (cancelled) return;
        clearSession();
        if (err instanceof ApiError && err.status === 403) {
          router.replace("/playbook/dashboard");
          return;
        }
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
        <p className={styles.loadingText}>Verifying access…</p>
      </div>
    );
  }

  return children;
}
