const FIXED_WIDGET_PATHS = new Set(["/playbook/dashboard"]);

const RESERVED_PLAYBOOK_SEGMENTS = new Set([
  "dashboard",
  "topics",
  "onboarding",
  "search",
  "profile",
]);

export function isPlaybookArticlePath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 2 || parts[0] !== "playbook") return false;
  return !RESERVED_PLAYBOOK_SEGMENTS.has(parts[1]);
}

export function shouldShowWizKidAssistant(
  pathname: string,
  fromOnboarding: boolean,
): boolean {
  if (fromOnboarding && isPlaybookArticlePath(pathname)) {
    return false;
  }

  if (FIXED_WIDGET_PATHS.has(pathname)) {
    return true;
  }

  return isPlaybookArticlePath(pathname);
}
