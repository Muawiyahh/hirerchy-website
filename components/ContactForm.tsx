"use client";

import { useState } from "react";
import { submitLead } from "@/lib/supabase";
import Icon from "./Icon";

const field =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20";
const label = "mb-1.5 block text-sm font-medium text-ink/90";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await submitLead({
      type: "contact",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
    });

    if (res.ok) {
      setStatus("ok");
      form.reset();
    } else {
      setStatus("error");
      setError(res.error || "Something went wrong. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-card border border-success/30 bg-success/5 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <Icon name="check" size={28} />
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">Message sent</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Thanks for reaching out — we&apos;ll get back to you by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="c-name">Name *</label>
          <input id="c-name" name="name" required className={field} placeholder="Your name" />
        </div>
        <div>
          <label className={label} htmlFor="c-email">Email *</label>
          <input id="c-email" name="email" type="email" required className={field} placeholder="you@email.com" />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="c-phone">
          Phone <span className="text-muted">(optional)</span>
        </label>
        <input id="c-phone" name="phone" className={field} placeholder="+1 555 000 0000" />
      </div>
      <div>
        <label className={label} htmlFor="c-message">How can we help? *</label>
        <textarea id="c-message" name="message" rows={5} required className={field} placeholder="Tell us a bit about your situation…" />
      </div>

      {status === "error" && (
        <p className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-2 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : "Send message"}
        {status !== "sending" && <Icon name="arrow" size={18} />}
      </button>
    </form>
  );
}
