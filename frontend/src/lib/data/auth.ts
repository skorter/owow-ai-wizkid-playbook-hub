import type { MockAuthUser } from "@/types/auth";
export const MOCK_USERS: MockAuthUser[] = [
  {
    email: "user@owow.io",
    password: "user123",
    role: "user",
    name: "John Doe",
  },
  {
    email: "admin@owow.io",
    password: "admin123",
    role: "admin",
    name: "Admin",
  },
];
