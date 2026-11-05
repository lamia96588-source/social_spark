"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth-layout";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function returnPath() {
  const value = new URLSearchParams(window.location.search).get("next");
  return value && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export function LoginPage() {
  const router = useRouter();
  const { login, loginWithGithub, githubEnabled, notify } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    try {
      await login(email.trim().toLowerCase(), password);
      notify("Welcome back!", "success");
      router.replace(returnPath());
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Your community is waiting</p><h1>Welcome <em>back.</em></h1><p>Sign in to keep your community plans moving.</p></div>
      <form className="auth-form" onSubmit={submit} noValidate>
        <label className="form-field"><span>Email address</span><span className="field-with-icon"><Icon name="mail" size={17} /><Input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required aria-invalid={!!error} /></span></label>
        <label className="form-field"><span>Password</span><span className="field-with-icon"><Icon name="lock" size={17} /><Input autoComplete="current-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required /></span></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button className="auth-submit" type="submit" size="lg" disabled={busy}>{busy ? "Opening your workspace…" : <>Log in <Icon name="arrow" size={18} /></>}</Button>
      </form>
      {githubEnabled && <Button variant="outline" size="lg" onClick={async () => { try { await loginWithGithub(); } catch (error) { setError(error instanceof Error ? error.message : "GitHub sign in failed."); } }}>Continue with GitHub</Button>}
      <div className="auth-divider"><span>New to SocialSpark?</span></div>
      <Link className="auth-secondary-link" href="/register">Create a community profile <Icon name="arrowUpRight" size={16} /></Link>
    </AuthLayout>
  );
}
