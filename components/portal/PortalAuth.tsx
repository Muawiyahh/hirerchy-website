"use client";

import { useState } from "react";
import BrandMark from "@/components/BrandMark";
import { signIn, signUp } from "@/lib/portal";

const input =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder-white/30 outline-none transition focus:border-violet-400/70 focus:bg-white/[0.06] focus:ring-4 focus:ring-violet-500/10";

export default function PortalAuth({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center">
        <BrandMark size={52} onDark />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">Hirerchy</h1>
        <p className="mt-1.5 text-sm text-white/50">Your profile, ready to apply.</p>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/50">Email</label>
        <input className={input} type="email" required autoComplete="email"
          placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-white/50">Password</label>
        <input className={input} type="password" required minLength={6} autoComplete="current-password"
          placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
            {error}
          </div>
        )}

        <button type="submit" disabled={busy}
          className="mt-5 w-full rounded-xl bg-violet-600 px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>

        <p className="mt-4 text-center text-sm text-white/50">
          {mode === "signup" ? "Already have an account? " : "First time here? "}
          <button type="button" className="font-semibold text-violet-300 hover:text-violet-200"
            onClick={() => { setError(""); setMode(mode === "signup" ? "signin" : "signup"); }}>
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </form>

      <p className="mt-6 text-xs text-white/40">
        Powered by <strong className="text-violet-300">Hirerchy</strong>
      </p>
    </div>
  );
}
