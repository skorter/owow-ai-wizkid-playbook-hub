import { AuthUser } from "@/types/auth";

export const MOCK_USERS: AuthUser[] = [
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
