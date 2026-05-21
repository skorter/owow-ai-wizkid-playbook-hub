import { getAuthToken, setAuthToken } from "@/lib/api/client";
import type { ApiUser, ApiUserRole } from "@/lib/api/types";
import type { SessionUser } from "@/types/auth";

export const USER_SESSION_STORAGE_KEY = "authUser";

export const LEGACY_ROLE_STORAGE_KEY = "role";
export const LEGACY_USER_STORAGE_KEY = "user";

function toLegacyRole(role: ApiUserRole): "admin" | "user" {
  return role === "HR_ADMIN" ? "admin" : "user";
}

export function isHrAdmin(role: ApiUserRole): boolean {
  return role === "HR_ADMIN";
}

export function getPostLoginPath(role: ApiUserRole): string {
  switch (role) {
    case "HR_ADMIN":
      return "/admin/dashboard";
    case "NEW_EMPLOYEE":
      return "/playbook/onboarding";
    case "EMPLOYEE":
    default:
      return "/playbook/dashboard";
  }
}

export function getRoleDisplayLabel(role: ApiUserRole): string {
  switch (role) {
    case "HR_ADMIN":
      return "HR Admin";
    case "NEW_EMPLOYEE":
      return "New Employee";
    case "EMPLOYEE":
    default:
      return "Employee";
  }
}

export function toSessionUser(user: ApiUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

export function saveSession(user: ApiUser, token: string): void {
  if (typeof window === "undefined") return;

  const session = toSessionUser(user);
  setAuthToken(token);
  localStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(session));

  const legacyRole = toLegacyRole(user.role);
  localStorage.setItem(LEGACY_ROLE_STORAGE_KEY, legacyRole);
  localStorage.setItem(
    LEGACY_USER_STORAGE_KEY,
    JSON.stringify({
      email: user.email,
      name: user.fullName ?? user.email,
      role: legacyRole,
    }),
  );
}

export function getStoredSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_SESSION_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (!parsed?.id || !parsed?.email || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  setAuthToken(null);
  localStorage.removeItem(USER_SESSION_STORAGE_KEY);
  localStorage.removeItem(LEGACY_ROLE_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
}

export function hasAuthToken(): boolean {
  return Boolean(getAuthToken());
}

export function logout(): void {
  clearSession();
}
