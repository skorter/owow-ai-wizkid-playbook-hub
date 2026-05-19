import styles from "./Form.module.css";
import Link from "next/link";

type FormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  loading?: boolean;
  handleLogin: () => void;
};

export default function Form({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading = false,
  handleLogin,
}: FormProps) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loading) handleLogin();
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="you@owow.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          autoComplete="email"
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          autoComplete="current-password"
          disabled={loading}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.loginButton} disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </button>
      <p className={styles.forgot}>
        <span className={styles.label}>Forgot password?</span>
        <Link href="/forgot-password" className={styles.link}>
          Reset here
        </Link>
      </p>
    </form>
  );
}
