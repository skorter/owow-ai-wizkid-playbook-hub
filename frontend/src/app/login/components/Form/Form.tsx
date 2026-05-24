import styles from "./Form.module.css";
import Link from "next/link";
import {
  CircleCheckBig,
  Shield,
  Users,
  ArrowRight,
} from "lucide-react";

export type LoginMode = "employee" | "management" | "onboarding";

type FormProps = {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  loading?: boolean;
  shake?: boolean;
  onLogin: (
    loginMode: LoginMode,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
};

export default function Form({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading = false,
  shake = false,
  onLogin,
}: FormProps) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleModeClick = (
    loginMode: LoginMode,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!loading) {
      onLogin(loginMode, event);
    }
  };

  return (
    <section
      className={`${styles.formContainer} ${shake ? styles.shake : ""}`}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Sign in to access your workspace</p>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.fields}>
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

          <div className={styles.row}>
            <label className={styles.remember}>
              <input type="checkbox" className={styles.checkbox} />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className={styles.forgot}>
              Forgot password?
            </Link>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.loginButton}
            disabled={loading}
            onClick={(e) => handleModeClick("employee", e)}
          >
            {loading ? (
              "Signing in…"
            ) : (
              <>
                Continue as Employee
                <ArrowRight className={styles.icon} />
              </>
            )}
          </button>
          <button
            type="button"
            className={styles.managementButton}
            disabled={loading}
            onClick={(e) => handleModeClick("management", e)}
          >
            <Shield className={styles.icon} />
            Continue as Management & HR
          </button>
          <button
            type="button"
            className={styles.onboardingButton}
            disabled={loading}
            onClick={(e) => handleModeClick("onboarding", e)}
          >
            <Users className={styles.icon} />
            New Employee? Start Onboarding
          </button>
        </div>
      </form>

      <div className={styles.security}>
        <CircleCheckBig className={styles.checkIcon} />
        <span>Secure connection • 2FA enabled</span>
      </div>
    </section>
  );
}
