"use client";

import { useState } from "react";
import { submitLead } from "@/lib/supabase";
import Icon from "./Icon";

const field =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent/60 focus:ring-2 focus:ring-accent/20";
const label = "mb-1.5 block text-sm font-medium text-ink/90";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await submitLead({
      type: "resume_review",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      target_role: String(data.get("target_role") || ""),
      linkedin_url: String(data.get("linkedin_url") || ""),
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
        <h3 className="mt-5 text-xl font-bold text-ink">Your review is on its way</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Thanks — we&apos;ve got your details. Our team will review your resume and
          get back to you by email within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="lead-name">Full name *</label>
          <input id="lead-name" name="name" required className={field} placeholder="Jane Doe" />
        </div>
        <div>
          <label className={label} htmlFor="lead-email">Email *</label>
          <input id="lead-email" name="email" type="email" required className={field} placeholder="jane@email.com" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="lead-role">Target role</label>
          <input id="lead-role" name="target_role" className={field} placeholder="e.g. Product Manager" />
        </div>
        <div>
          <label className={label} htmlFor="lead-linkedin">LinkedIn or resume link</label>
          <input id="lead-linkedin" name="linkedin_url" className={field} placeholder="https://linkedin.com/in/…" />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="lead-message">
          Anything we should know? <span className="text-muted">(optional)</span>
        </label>
        <textarea id="lead-message" name="message" rows={4} className={field} placeholder="Your goals, industries, what's been frustrating you so far…" />
      </div>

      <p className="text-xs text-muted">
        Prefer to email your resume directly? Send it over and we&apos;ll include it
        in your review. We never share your details.
      </p>

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
        {status === "sending" ? "Sending…" : "Get my free review"}
        {status !== "sending" && <Icon name="arrow" size={18} />}
      </button>
    </form>
  );
}
