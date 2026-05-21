import type { ApiUserRole } from "@/lib/api/types";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: ApiUserRole;
};

export type MockAuthUser = {
  email: string;
  password: string;
  role: "user" | "admin";
  name: string;
};
