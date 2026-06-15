"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";

type AuthMode = "signin" | "signup";
type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordScore(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
}

function validate(mode: AuthMode, name: string, email: string, password: string) {
  const errors: FieldErrors = {};

  if (mode === "signup" && name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!emailPattern.test(email.trim())) {
    errors.email = "Enter a valid work email.";
  }

  if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);
  const strengthLabel = ["Weak", "Weak", "Fair", "Good", "Strong"][passwordScore];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const nextErrors = validate(mode, name, email, password);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = {
        email: email.trim().toLowerCase(),
        password,
        callbackURL: "/dashboard",
      };

      const result =
        mode === "signin"
          ? await authClient.signIn.email({
              ...credentials,
              rememberMe,
            })
          : await authClient.signUp.email({
              ...credentials,
              name: name.trim(),
            });

      if (result.error) {
        setStatus(result.error.message || "We could not complete that request. Please try again.");
        return;
      }

      setStatus(mode === "signin" ? "Welcome back. Redirecting..." : "Workspace created. Redirecting...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setStatus("We could not complete that request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setStatus(null);
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/auth",
      });

      if (result.error) {
        setStatus(result.error.message || "Google sign-in could not be started.");
      }
    } catch {
      setStatus("Google sign-in could not be started.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setStatus(null);
  }

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-mode-switch" role="tablist" aria-label="Authentication mode">
        <button
          aria-selected={mode === "signin"}
          className={mode === "signin" ? "active" : ""}
          role="tab"
          type="button"
          onClick={() => switchMode("signin")}
        >
          Sign in
        </button>
        <button
          aria-selected={mode === "signup"}
          className={mode === "signup" ? "active" : ""}
          role="tab"
          type="button"
          onClick={() => switchMode("signup")}
        >
          Create account
        </button>
      </div>

      <div className="auth-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="auth-heading">
        <span>{mode === "signin" ? "Secure access" : "Start your workspace"}</span>
        <h1 id="auth-title">{mode === "signin" ? "Welcome back to Aurent." : "Create your Aurent account."}</h1>
        <p>
          {mode === "signin"
            ? "Sign in to continue managing inbox, calendar, and agent actions from one calm command center."
            : "Set up your workspace and bring email, calendar, and AI actions into one focused surface."}
        </p>
      </div>

      <button
        className="google-auth-button"
        disabled={isGoogleLoading}
        type="button"
        onClick={handleGoogleSignIn}
      >
        <span aria-hidden="true">G</span>
        {isGoogleLoading ? "Opening Google..." : "Continue with Google"}
      </button>

      <div className="auth-divider">
        <span>or use email</span>
      </div>

      <form className="auth-form" noValidate onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label>
            <span>Full name</span>
            <input
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              name="name"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {errors.name ? <small id="name-error">{errors.name}</small> : null}
          </label>
        ) : null}

        <label>
          <span>Work email</span>
          <input
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            name="email"
            placeholder="you@company.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email ? <small id="email-error">{errors.email}</small> : null}
        </label>

        <label>
          <span>Password</span>
          <input
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : "password-strength"}
            name="password"
            placeholder="Minimum 8 characters"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password ? <small id="password-error">{errors.password}</small> : null}
        </label>

        <div className="password-meter" aria-live="polite" id="password-strength">
          <span>Password strength</span>
          <div aria-hidden="true">
            {[1, 2, 3, 4].map((step) => (
              <i className={passwordScore >= step ? "filled" : ""} key={step} />
            ))}
          </div>
          <strong>{strengthLabel}</strong>
        </div>

        <div className="auth-options">
          <label>
            <input
              checked={rememberMe}
              name="remember"
              type="checkbox"
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            <span>Remember this device</span>
          </label>
          <a href="mailto:security@aurent.ai">Forgot password?</a>
        </div>

        <button className="auth-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Securing..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        {status ? (
          <p className="auth-status" role="status">
            {status}
          </p>
        ) : null}
      </form>

      <p className="auth-terms">
        By continuing, you agree to Aurent&apos;s Terms and acknowledge the Privacy Policy.
      </p>
    </section>
  );
}
