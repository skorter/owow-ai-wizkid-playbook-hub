"use client";

import { useState } from "react";
import { getStoredSessionUser } from "@/lib/auth/session";
import type { SessionUser } from "@/types/auth";
import { getRoleDisplayLabel } from "@/lib/auth/session";

export function getDisplayFirstName(user: SessionUser | null): string {
  if (!user) return "there";
  const name = user.fullName?.trim();
  if (!name) return user.email.split("@")[0] ?? "there";
  return name.split(/\s+/)[0] ?? name;
}

export function getDisplayFullName(user: SessionUser | null): string {
  if (!user) return "Playbook user";
  return user.fullName?.trim() || user.email;
}

export function getDisplayInitials(user: SessionUser | null): string {
  const full = getDisplayFullName(user);
  const parts = full.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return full.slice(0, 2).toUpperCase();
}

export function getDisplayRole(user: SessionUser | null): string {
  if (!user) return "Employee";
  return getRoleDisplayLabel(user.role);
}

export function usePlaybookSession(): SessionUser | null {
  const [user] = useState<SessionUser | null>(() => getStoredSessionUser());
  return user;
}
