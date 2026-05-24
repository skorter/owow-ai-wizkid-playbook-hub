import { ApiError } from "./types";

export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (err instanceof ApiError) {
    if (err.status === 0) {
      return "Could not reach the server. Check that the backend is running.";
    }
    if (err.message.trim()) return err.message;
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }

  return fallback;
}
