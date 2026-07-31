"use client";

import { useCallback, useEffect, useState } from "react";
import StaffShell, { StatusPill, WeekBar, clientName } from "../StaffShell";
import {
  getStaffClients, getEmployeeUpdates, sendEmployeeUpdate, bumpClientWeek,
  UPDATE_KINDS, type ClientRow, type EmployeeUpdateRow, type UpdateKind,
} from "@/lib/portal";

const KIND_BTN: Record<string, string> = {
  Completed: "border-success/40 bg-success/10 text-success hover:bg-success/20",
  "Facing an Issue": "border-error/40 bg-error/10 text-error hover:bg-error/20",
  Pending: "border-accent/50 bg-accent/15 text-accent-deep hover:bg-accent/25",
  Other: "border-border bg-surface-2 text-muted hover:text-ink",
};

const TABS = [{ id: "clients" as const, label: "My clients" }];

/** Shared by the mount effect and the refresh callback, so neither sets state
 *  synchronously inside an effect body. */
const fetchMine = () => Promise.all([getStaffClients(), getEmployeeUpdates()]);

const errText = (e: unknown) =>
  e instanceof Error ? e.message : "Could not load your clients.";

/**
 * Employee dashboard. RLS already limits `clients` to the rows assigned to
 * this user, so the same query the admin uses returns just their list here.
 */
export default function EmployeeApp() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [updates, setUpdates] = useState<EmployeeUpdateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = useCallback(
    () =>
      fetchMine()
        .then(([c, u]) => {
          setClients(c);
          setUpdates(u);
          setError("");
        })
        .catch((e) => setError(errText(e)))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    let alive = true;
    fetchMine()
      .then(([c, u]) => {
        if (!alive) return;
        setClients(c);
        setUpdates(u);
      })
      .catch((e) => alive && setError(errText(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  async function update(clientId: string, kind: UpdateKind, text?: string) {
    setBusy(clientId + kind);
    setError("");
    try {
      await sendEmployeeUpdate(clientId, kind, text);
      setNoteFor(null);
      setNote("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send that update.");
    } finally {
      setBusy("");
    }
  }

  async function markWeek(clientId: string) {
    setBusy(clientId + "week");
    setError("");
    try {
      await bumpClientWeek(clientId, 1);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not mark that week.");
    } finally {
      setBusy("");
    }
  }

  return (
    <StaffShell label="Employee" tabs={TABS} active="clients" onSelect={() => {}}>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">My clients</h1>
      <p className="mt-1 text-sm text-muted">
        Mark a week complete as you finish it, and send your manager a status update.
      </p>

      {error && (
        <p className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-border border-t-navy" />
        </div>
      ) : clients.length === 0 ? (
        <p className="mt-8 rounded-card border border-border bg-surface p-8 text-center text-sm text-muted">
          No clients assigned to you yet. Your manager assigns them from the admin panel.
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          {clients.map((c) => {
            const latest = updates.find((u) => u.client_id === c.id);
            const done = c.weeks_total > 0 && c.weeks_completed >= c.weeks_total;
            return (
              <section
                key={c.id}
                className="rounded-card border border-border bg-surface p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-bold text-ink">{clientName(c)}</h2>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {c.plan ? `${c.plan} plan` : "No plan set"}
                      {c.submitted_at
                        ? ` · submitted ${new Date(c.submitted_at).toLocaleDateString()}`
                        : ""}
                    </p>
                  </div>
                  <WeekBar done={c.weeks_completed} total={c.weeks_total} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                  <button
                    disabled={busy !== "" || done || c.weeks_total === 0}
                    onClick={() => markWeek(c.id)}
                    className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:opacity-50"
                  >
                    {done ? "All weeks marked" : "Mark week complete"}
                  </button>

                  <span className="ml-2 text-xs font-medium text-muted">
                    Send update to manager:
                  </span>
                  {UPDATE_KINDS.map((k) => (
                    <button
                      key={k}
                      disabled={busy !== ""}
                      onClick={() =>
                        k === "Other" ? setNoteFor(noteFor === c.id ? null : c.id) : update(c.id, k)
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                        KIND_BTN[k]
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>

                {noteFor === c.id && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (note.trim()) update(c.id, "Other", note);
                    }}
                    className="mt-3 flex gap-2"
                  >
                    <input
                      autoFocus
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What should your manager know?"
                      className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                    />
                    <button
                      type="submit"
                      disabled={!note.trim() || busy !== ""}
                      className="shrink-0 rounded-full bg-accent px-5 text-sm font-semibold text-navy transition hover:bg-accent-2 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                )}

                {latest && (
                  <p className="mt-3 text-xs text-muted">
                    Last sent: <strong className="font-semibold text-ink">{latest.kind}</strong>
                    {latest.note ? ` — ${latest.note}` : ""} ·{" "}
                    {new Date(latest.created_at).toLocaleString()}
                    {latest.acknowledged_at && " · acknowledged"}
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}
    </StaffShell>
  );
}
