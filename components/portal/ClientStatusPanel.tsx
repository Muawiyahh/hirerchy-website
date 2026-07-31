"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, type ClientProfile, type MessageRow } from "@/lib/portal";
import LocalTime from "./LocalTime";

/** What each pipeline status means to the client, in their words. */
const STATUS_COPY: Record<string, string> = {
  Submitted: "Your profile is in. Our team will review it shortly.",
  "In Review":
    "Your profile is currently being reviewed by our team. We'll get back to you within 1 working day with next steps.",
  Contacted: "We've reached out to you — check your email for next steps.",
  "Payment Pending": "We're ready to start as soon as your payment is confirmed.",
  Active:
    "Your applications are going out. Every role we apply to appears in your tracker.",
  Completed: "Your plan is complete. Thanks for working with us.",
  Halted: "Your search is paused. Message your manager if that's unexpected.",
};

const STATUS_STYLE: Record<string, string> = {
  Submitted: "bg-surface-2 text-ink",
  "In Review": "bg-accent/15 text-accent-deep",
  Contacted: "bg-accent/20 text-accent-deep",
  "Payment Pending": "bg-error/10 text-error",
  Active: "bg-success/10 text-success",
  Completed: "bg-success/15 text-success",
  Halted: "bg-error/15 text-error",
};

/** Status + plan + week progress, exactly as the manager set it. */
export function ClientStatusPanel({ profile }: { profile: ClientProfile }) {
  const status = String(profile.status ?? "Submitted");
  const plan = (profile.plan as string | null) ?? null;
  const total = Number(profile.weeks_total ?? 0);
  const done = Number(profile.weeks_completed ?? 0);
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;
  const applying = status === "Active";

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
          <div className="text-xs font-medium text-muted">Status</div>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
              STATUS_STYLE[status] || "bg-surface-2 text-ink"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
          <div className="text-xs font-medium text-muted">Your plan</div>
          <div className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink">
            {plan || "—"}
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
          <div className="text-xs font-medium text-muted">Progress</div>
          <div className="mt-1.5 text-2xl font-extrabold tabular-nums tracking-tight text-ink">
            {done} / {total || "—"} <span className="text-base text-muted">weeks</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-card border border-border bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              applying ? "bg-success" : "bg-accent"
            }`}
          />
          <span className="text-sm font-bold text-ink">
            {applying ? "We're applying for you right now" : "Applications not started yet"}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {STATUS_COPY[status] || STATUS_COPY.Submitted}
        </p>
      </div>
    </>
  );
}

/** The client half of the manager thread. */
export function ClientMessages({ clientId }: { clientId: string }) {
  const [msgs, setMsgs] = useState<MessageRow[]>([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(
    () => getMessages(clientId).then(setMsgs).catch(() => {}),
    [clientId]
  );

  useEffect(() => {
    let alive = true;
    getMessages(clientId)
      .then((rows) => alive && setMsgs(rows))
      .catch(() => {
        /* thread just stays empty */
      });
    return () => {
      alive = false;
    };
  }, [clientId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [msgs.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError("");
    try {
      await sendMessage(clientId, body, "client");
      setBody("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-bold text-ink">Message your manager</h2>

      {msgs.length === 0 ? (
        <p className="mt-2 text-sm text-muted">
          No messages yet. Send a question below and we&apos;ll get back to you.
        </p>
      ) : (
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.sender_role === "client"
                  ? "ml-auto bg-navy text-white"
                  : "bg-surface-2 text-ink"
              }`}
            >
              {m.sender_role === "owner" && (
                <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-accent-deep">
                  Your manager
                </span>
              )}
              {m.body}
              <span
                className={`mt-1 block text-[10px] ${
                  m.sender_role === "client" ? "text-white/50" : "text-muted"
                }`}
              >
                <LocalTime value={m.created_at} />
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {error && <p className="mt-3 text-sm text-error">{error}</p>}

      <form onSubmit={send} className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ask a question…"
          className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="shrink-0 rounded-full bg-accent px-5 text-sm font-semibold text-navy transition hover:bg-accent-2 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
