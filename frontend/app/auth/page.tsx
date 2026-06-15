import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "./auth-form";

export const metadata: Metadata = {
  title: "Sign in | Aurent",
  description:
    "Access Aurent, the AI command center for email, calendar, and agent workflows.",
};

function AurentMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 46 46" role="img">
        <path d="M23 4 41 42H31.8l-3.2-7.5H17.1L13.9 42H5L23 4Z" />
        <path d="M20.1 27.4h5.8L23 20.2l-2.9 7.2Z" />
      </svg>
    </span>
  );
}

export default function AuthPage() {
  return (
    <main className="auth-page">
      <div className="noise-layer" aria-hidden="true" />
      <header className="auth-nav">
        <Link className="brand" href="/" aria-label="Aurent home">
          <AurentMark />
          <span>AURENT</span>
        </Link>
        <Link className="auth-nav-link" href="/">
          Back to home
        </Link>
      </header>

      <div className="auth-layout single-card">
        <AuthForm />
      </div>
    </main>
  );
}
