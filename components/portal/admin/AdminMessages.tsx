"use client";

import { useEffect, useState } from "react";
import { clientName } from "../StaffShell";
import { sendMessage, portal } from "@/lib/portal";
import type { AdminData } from "./AdminApp";

/** Tab 4 — every client thread in one place. Opening a thread marks the
 *  client's messages read so the tab badge clears. */
export default function AdminMessages({
  data,
  onChanged,
}: {
  data: AdminData;
  onChanged: () => void;
}) {
  const threads = data.clients
    .map((c) => ({
      client: c,
      msgs: data.messages.filter((m) => m.client_id === c.id),
    }))
    .filter((t) => t.msgs.length > 0)
    .sort(
      (a, b) =>
        new Date(b.msgs[b.msgs.length - 1].created_at).getTime() -
        new Date(a.msgs[a.msgs.length - 1].created_at).getTime()
    );

  const [openId, setOpenId] = useState<string | null>(threads[0]?.client.id ?? null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const open = threads.find((t) => t.client.id === openId) ?? null;

  // Mark the open thread's client messages as read.
  useEffect(() => {
    if (!open) return;
    const unread = open.msgs.filter((m) => m.sender_role === "client" && !m.read_at);
    if (unread.length === 0) return;
    portal()
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unread.map((m) => m.id))
      .then(() => onChanged());
  }, [open, onChanged]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!open || !reply.trim()) return;
    setBusy(true);
    setError("");
    try {
      await sendMessage(open.client.id, reply, "owner");
      setReply("");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Messages</h1>
      <p className="mt-1 text-sm text-muted">
        Questions your clients have sent to their manager.
      </p>

      {threads.length === 0 ? (
        <p className="mt-8 rounded-card border border-border bg-surface p-8 text-center text-sm text-muted">
          No messages yet. When a client writes in, their thread appears here.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr] lg:items-start">
          <ul className="overflow-hidden rounded-card border border-border bg-surface shadow-sm">
            {threads.map((t) => {
              const last = t.msgs[t.msgs.length - 1];
              const unread = t.msgs.some((m) => m.sender_role === "client" && !m.read_at);
              return (
                <li key={t.client.id}>
                  <button
                    onClick={() => setOpenId(t.client.id)}
                    className={`w-full border-b border-border px-4 py-3.5 text-left transition ${
                      openId === t.client.id ? "bg-accent/10" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-ink">
                        {clientName(t.client)}
                      </span>
                      {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">
                      {last.sender_role === "owner" ? "You: " : ""}
                      {last.body}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {open && (
            <section className="flex min-h-[420px] flex-col rounded-card border border-border bg-surface shadow-sm">
              <h2 className="border-b border-border px-6 py-4 text-base font-bold text-ink">
                {clientName(open.client)}
              </h2>

              <div className="flex-1 space-y-3 overflow-y-auto p-6">
                {open.msgs.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.sender_role === "owner"
                        ? "ml-auto bg-navy text-white"
                        : "bg-surface-2 text-ink"
                    }`}
                  >
                    {m.body}
                    <span
                      className={`mt-1 block text-[10px] ${
                        m.sender_role === "owner" ? "text-white/50" : "text-muted"
                      }`}
                    >
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {error && (
                <p className="px-6 pb-2 text-sm text-error">{error}</p>
              )}

              <form onSubmit={send} className="flex gap-2 border-t border-border p-4">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write a reply…"
                  className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                />
                <button
                  type="submit"
                  disabled={busy || !reply.trim()}
                  className="shrink-0 rounded-full bg-accent px-5 text-sm font-semibold text-navy transition hover:bg-accent-2 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </>
  );
}
