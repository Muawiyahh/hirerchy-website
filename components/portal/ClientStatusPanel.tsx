"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMessages, sendMessage, type ClientProfile, type MessageRow } from "@/lib/portal";
import LocalTime from "./LocalTime";

/** What each pipeline status means to the client, in their words. */
const STATUS_COPY: Record<string, string> = {
  Submitted: "Your profile is in. Our team will review it shortly.",
  "In Review": "Being reviewed now — we'll come back to you within 1 working day.",
  Contacted: "We've reached out — check your email for next steps.",
  "Payment Pending": "We start the moment your payment is confirmed.",
  Active: "Applications are going out. Every role appears in your tracker.",
  Completed: "Your plan is complete. Thanks for working with us.",
  Halted: "Your search is paused. Message your manager if that's unexpected.",
};

const STATUS_STYLE: Record<string, string> = {
  Submitted: "bg-surface-2 text-ink",
  "In Review": "bg-accent/15 text-accent-deep",
  Contacted: "bg-accent/25 text-accent-deep",
  "Payment Pending": "bg-error/10 text-error",
  Active: "bg-success/12 text-success",
  Completed: "bg-success/20 text-success",
  Halted: "bg-error/15 text-error",
};

const label = "text-[11px] font-semibold uppercase tracking-[0.1em] text-muted";

/** Status, plan and week progress as one compact strip rather than three
 *  half-empty cards. */
export function ClientStatusPanel({ profile }: { profile: ClientProfile }) {
  const status = String(profile.status ?? "Submitted");
  const plan = (profile.plan as string | null) ?? null;
  const total = Number(profile.weeks_total ?? 0);
  const done = Number(profile.weeks_completed ?? 0);
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;
  const applying = status === "Active";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="px-4 py-3.5">
          <div className={label}>Status</div>
          <span
            className={`mt-1.5 inline-block rounded-md px-2.5 py-1 text-[13px] font-bold ${
              STATUS_STYLE[status] || "bg-surface-2 text-ink"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="px-4 py-3.5">
          <div className={label}>Your plan</div>
          <div className="mt-1.5 text-lg font-bold leading-tight text-ink">
            {plan || "Not set"}
          </div>
        </div>

        <div className="px-4 py-3.5">
          <div className={label}>Progress</div>
          <div className="mt-1.5 flex items-baseline gap-1 text-lg font-bold leading-tight text-ink">
            <span className="tabular-nums">
              {done}/{total || "—"}
            </span>
            <span className="text-xs font-medium text-muted">weeks</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* one slim line rather than a card of its own */}
      <div className="flex items-start gap-2.5 border-t border-border bg-surface-2/60 px-4 py-2.5">
        <span
          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
            applying ? "bg-success" : "bg-accent"
          }`}
        />
        <p className="text-[13px] leading-snug text-muted">
          <span className="font-bold text-ink">
            {applying ? "We're applying for you right now." : "Applications not started yet."}
          </span>{" "}
          {STATUS_COPY[status] || STATUS_COPY.Submitted}
        </p>
      </div>
    </div>
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
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
      <h2 className="border-b border-border px-4 py-2.5 text-[13px] font-bold text-ink">
        Message your manager
      </h2>

      {msgs.length === 0 ? (
        <p className="px-4 py-5 text-[13px] text-muted">
          No messages yet — ask a question below and we&apos;ll get back to you.
        </p>
      ) : (
        <div className="max-h-56 space-y-2 overflow-y-auto px-4 py-3">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`w-fit max-w-[78%] rounded-lg px-3 py-1.5 text-[13px] leading-snug ${
                m.sender_role === "client"
                  ? "ml-auto bg-navy text-white"
                  : "bg-surface-2 text-ink"
              }`}
            >
              {m.sender_role === "owner" && (
                <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wide text-accent-deep">
                  Your manager
                </span>
              )}
              {m.body}
              <span
                className={`mt-0.5 block text-[10px] ${
                  m.sender_role === "client" ? "text-white/45" : "text-muted"
                }`}
              >
                <LocalTime value={m.created_at} />
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {error && <p className="px-4 pb-1 text-xs text-error">{error}</p>}

      <form onSubmit={send} className="flex gap-2 border-t border-border p-2.5">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Ask a question…"
          className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-[13px] text-ink placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="shrink-0 rounded-md bg-accent px-4 text-[13px] font-bold text-navy transition hover:bg-accent-2 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
