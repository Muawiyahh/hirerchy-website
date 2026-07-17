"use client";

import { useState } from "react";
import BrandMark from "@/components/BrandMark";
import { signIn, signUp } from "@/lib/portal";

const input =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

export default function PortalAuth({ onAuthed }: { onAuthed: () => void }) {
  // "Client login" links arrive with ?view=signin so returning clients land on
  // the sign-in view; "Get started" (no param) defaults to sign-up.
  const [mode, setMode] = useState<"signup" | "signin">(() =>
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("view") === "signin"
      ? "signin"
      : "signup"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await signUp(email.trim(), password);
        // If email confirmation is off, signUp returns a session; else sign in.
        if (!res.session) await signIn(email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      onAuthed();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-68px)] flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center">
        <BrandMark size={52} />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">Hirerchy</h1>
        <p className="mt-1.5 text-sm text-muted">Your profile, ready to apply.</p>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-sm"
      >
        <label className="mb-1.5 block text-sm font-medium text-ink/90">Email</label>
        <input className={input} type="email" required autoComplete="email"
          placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="mb-1.5 mt-4 block text-sm font-medium text-ink/90">Password</label>
        <input className={input} type="password" required minLength={6} autoComplete="current-password"
          placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && (
          <div className="mt-4 rounded-xl border border-error/30 bg-error/10 px-4 py-2.5 text-sm text-error">
            {error}
          </div>
        )}

        <button type="submit" disabled={busy}
          className="mt-5 w-full rounded-full bg-navy px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-navy-2 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "signup" ? "Already have an account? " : "First time here? "}
          <button type="button" className="font-semibold text-accent-deep hover:underline"
            onClick={() => { setError(""); setMode(mode === "signup" ? "signin" : "signup"); }}>
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </form>

      <p className="mt-6 text-xs text-muted">
        Powered by <strong className="text-accent-deep">Hirerchy</strong>
      </p>
    </div>
  );
}
