"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";

const MOCK_USERS = [
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    const found = MOCK_USERS.find(
      (user) => user.email === email && user.password === password,
    );

    if (!found) {
      setError("Invalid email or password");
      return;
    }

    if (found.role === "admin") {
      localStorage.setItem("role", "admin");
      alert(`Welcome, ${found.name}!`);
      router.push("/admin/dashboard");
    } else {
      localStorage.setItem("role", "user");
      alert(`Welcome, ${found.name}!`);
      router.push("/playbook/dashboard");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.content}>
        <Header />
        <Form
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          handleLogin={handleLogin}
        />
      </div>
    </div>
  );
}
