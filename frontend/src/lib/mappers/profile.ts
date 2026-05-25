import { apiPut, endpoints, getAuthToken } from "@/lib/api";
import type { ApiUser } from "@/lib/api/types";
import { saveSession } from "@/lib/auth/session";

export type ProfileUpdatePayload = {
  fullName: string;
};

export async function updateCurrentUserProfile(
  payload: ProfileUpdatePayload,
): Promise<ApiUser> {
  const user = await apiPut<ApiUser>(endpoints.auth.updateMe, payload);
  const token = getAuthToken();
  if (token) {
    saveSession(user, token);
  }
  return user;
}
