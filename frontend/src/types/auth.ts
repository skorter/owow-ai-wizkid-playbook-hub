export type AuthUser = {
  email: string;
  password: string;
  role: "user" | "admin";
  name: string;
};
