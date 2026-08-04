"use client";

import { useEffect, useRef, useState } from "react";
import { clientName, initials } from "../StaffShell";
import { sendMessage, portal, errorText } from "@/lib/portal";
import LocalTime from "../LocalTime";
import type { AdminData } from "./AdminApp";

/**
 * Tab 4 — every client is listed whether or not they've written in, so the
 * manager can start a thread. Opening one marks the client's messages read.
 */
export default function AdminMessages({
  data,
  onChanged,
  initialClientId,
}: {
  data: AdminData;
  onChanged: () => void;
  initialClientId?: string | null;
}) {
  const threads = data.clients
    .map((c) => ({ client: c, msgs: data.messages.filter((m) => m.client_id === c.id) }))
    .sort((a, b) => {
      const at = a.msgs.at(-1)?.created_at;
      const bt = b.msgs.at(-1)?.created_at;
      if (at && bt) return new Date(bt).getTime() - new Date(at).getTime();
      if (at) return -1;
      if (bt) return 1;
      return clientName(a.client).localeCompare(clientName(b.client));
    });

  const [openId, setOpenId] = useState<string | null>(
    initialClientId ?? threads[0]?.client.id ?? null
  );
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const open = threads.find((t) => t.client.id === openId) ?? null;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [open?.msgs.length]);

  // Mark the open thread's client messages as read.
  useEffect(() => {
    if (!open) return;
    const unread = open.msgs.filter((m) => m.sender_role === "client" && !m.read_at);
    if (unread.length === 0) return;
    let alive = true;
    portal()
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", unread.map((m) => m.id))
      .then(() => alive && onChanged());
    return () => {
      alive = false;
    };
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
      setError(errorText(err, "Could not send that."));
    } finally {
      setBusy(false);
    }
  }

  const term = q.trim().toLowerCase();
  const listed = term
    ? threads.filter((t) => clientName(t.client).toLowerCase().includes(term))
    : threads;

  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Messages</h1>
      <p className="mt-1 text-sm text-muted">
        Every client is here — open anyone to start or continue a conversation.
      </p>

      <div className="mt-7 grid gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          <div className="border-b border-border p-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search clients…"
              className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-accent"
            />
          </div>
          <ul className="max-h-[560px] overflow-y-auto">
            {listed.map((t) => {
              const last = t.msgs.at(-1);
              const unread = t.msgs.some((m) => m.sender_role === "client" && !m.read_at);
              const name = clientName(t.client);
              return (
                <li key={t.client.id}>
                  <button
                    onClick={() => setOpenId(t.client.id)}
                    className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition ${
                      openId === t.client.id ? "bg-accent/10" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-[11px] font-bold text-white">
                      {initials(name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-bold text-ink">{name}</span>
                        {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {last
                          ? `${last.sender_role === "owner" ? "You: " : ""}${last.body}`
                          : "No messages yet"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            {listed.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-muted">No clients found.</li>
            )}
          </ul>
        </div>

        {open ? (
          <section className="flex min-h-[560px] flex-col rounded-lg border border-border bg-surface shadow-sm">
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                {initials(clientName(open.client))}
              </span>
              <span>
                <span className="block font-bold text-ink">{clientName(open.client)}</span>
                <span className="block text-xs text-muted">{open.client.email}</span>
              </span>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-6">
              {open.msgs.length === 0 && (
                <p className="py-12 text-center text-sm text-muted">
                  No messages with {clientName(open.client)} yet. Say hello below — it lands on
                  their dashboard.
                </p>
              )}
              {open.msgs.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
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
                    <LocalTime value={m.created_at} />
                  </span>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {error && <p className="px-6 pb-2 text-sm text-error">{error}</p>}

            <form onSubmit={send} className="flex gap-2 border-t border-border p-4">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Message ${clientName(open.client)}…`}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
              />
              <button
                type="submit"
                disabled={busy || !reply.trim()}
                className="shrink-0 rounded-lg bg-accent px-5 text-sm font-bold text-navy transition hover:bg-accent-2 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </section>
        ) : (
          <p className="rounded-lg border border-dashed border-border bg-surface p-12 text-center text-sm text-muted">
            No clients yet.
          </p>
        )}
      </div>
    </>
  );
}
