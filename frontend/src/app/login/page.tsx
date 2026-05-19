"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import Header from "./components/Header/Header";
import Form from "./components/Form/Form";
import { MOCK_USERS } from "@/lib/data/auth";

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

    localStorage.setItem("role", found.role);
    localStorage.setItem("user", JSON.stringify(found));

    if (found.role === "admin") {
      router.push("/admin/dashboard");
    } else {
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
