"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth-layout";
import { useAppState } from "@/components/app-provider";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { safePhotoUrl } from "@/lib/utils";

export function RegisterPage() {
  const router = useRouter();
  const { register, notify } = useAppState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Enter your name so neighbours know who’s joining.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email address.");
    if (!safePhotoUrl(photo)) return setError("Add a photo URL that starts with https://.");
    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) return setError("Use 6+ characters with an uppercase and a lowercase letter.");
    setBusy(true);
    try {
      await register({ name: name.trim(), email: email.trim().toLowerCase(), photo: safePhotoUrl(photo), password });
      notify("Your community profile is ready.", "success");
      router.replace("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to register.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form-heading"><p className="eyebrow"><span className="eyebrow-dot" /> Make good happen nearby</p><h1>Join the <em>neighbourhood.</em></h1><p>Create a profile to start or join local events.</p></div>
      <form className="auth-form auth-register-form" onSubmit={submit} noValidate>
        <label className="form-field"><span>Full name</span><Input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></label>
        <label className="form-field"><span>Email address</span><Input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
        <label className="form-field"><span>Profile photo URL</span><span className="field-with-icon"><Icon name="camera" size={17} /><Input type="url" value={photo} onChange={(event) => setPhoto(event.target.value)} placeholder="https://example.com/photo.jpg" required /></span></label>
        <label className="form-field"><span>Password</span><Input autoComplete="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" required aria-describedby="password-rules" /></label>
        <p className="password-rules" id="password-rules"><span className={password.length >= 6 ? "password-rule password-rule-met" : "password-rule"}><Icon name={password.length >= 6 ? "check" : "leaf"} size={13} /> 6 characters</span><span className={/[A-Z]/.test(password) ? "password-rule password-rule-met" : "password-rule"}><Icon name={/[A-Z]/.test(password) ? "check" : "leaf"} size={13} /> One uppercase letter</span><span className={/[a-z]/.test(password) ? "password-rule password-rule-met" : "password-rule"}><Icon name={/[a-z]/.test(password) ? "check" : "leaf"} size={13} /> One lowercase letter</span></p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <Button className="auth-submit" type="submit" size="lg" disabled={busy}>{busy ? "Creating your profile…" : <>Create account <Icon name="arrow" size={18} /></>}</Button>
      </form>
      <p className="auth-switch-copy">Already have a profile? <Link href="/login">Log in</Link></p>
    </AuthLayout>
  );
}
