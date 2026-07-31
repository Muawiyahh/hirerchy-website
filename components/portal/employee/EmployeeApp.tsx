"use client";

import { useCallback, useEffect, useState } from "react";
import StaffShell, { Stat, StatusPill, WeekBar, clientName, initials } from "../StaffShell";
import LocalTime from "../LocalTime";
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

const TABS = [{ id: "clients" as const, label: "My Clients" }];

const fetchMine = () => Promise.all([getStaffClients(), getEmployeeUpdates()]);
const errText = (e: unknown) =>
  e instanceof Error ? e.message : "Could not load your clients.";

const I = {
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
  bolt: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  check: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
};

/**
 * Employee dashboard. RLS already limits `clients` to rows assigned to this
 * user, so the same query the manager runs returns just their list here.
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

  const active = clients.filter((c) => c.status === "Active").length;
  const finished = clients.filter(
    (c) => c.weeks_total > 0 && c.weeks_completed >= c.weeks_total
  ).length;

  return (
    <StaffShell role="Employee" tabs={TABS} active="clients" onSelect={() => {}}>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">My Clients</h1>
      <p className="mt-1 text-sm text-muted">
        Mark a week as you finish it, and keep your manager posted.
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
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface p-12 text-center text-sm text-muted">
          No clients assigned to you yet. Your manager assigns them from the admin panel.
        </p>
      ) : (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Stat value={clients.length} label="Assigned to you" icon={I.users} />
            <Stat value={active} label="Currently active" icon={I.bolt} tone="success" />
            <Stat value={finished} label="Plans finished" icon={I.check} tone="accent" />
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <div className="hidden grid-cols-[1.4fr_1fr_1.6fr] gap-4 border-b border-border bg-surface-2/70 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted lg:grid">
              <span>Client</span>
              <span>Progress</span>
              <span>Send update to manager</span>
            </div>

            <ul className="divide-y divide-border">
              {clients.map((c) => {
                const latest = updates.find((u) => u.client_id === c.id);
                const done = c.weeks_total > 0 && c.weeks_completed >= c.weeks_total;
                const name = clientName(c);
                return (
                  <li key={c.id} className="px-6 py-5">
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1.6fr] lg:items-center">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-xs font-bold text-white">
                          {initials(name)}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-bold text-ink">{name}</span>
                            <StatusPill status={c.status} />
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">
                            {c.plan ? `${c.plan} plan` : "No plan set"}
                          </span>
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <WeekBar done={c.weeks_completed} total={c.weeks_total} />
                        <button
                          disabled={busy !== "" || done || c.weeks_total === 0}
                          onClick={() => markWeek(c.id)}
                          className="w-fit rounded-lg bg-navy px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-navy-2 disabled:opacity-40"
                        >
                          {done ? "All weeks marked" : "Mark week complete"}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {UPDATE_KINDS.map((k) => (
                          <button
                            key={k}
                            disabled={busy !== ""}
                            onClick={() =>
                              k === "Other"
                                ? setNoteFor(noteFor === c.id ? null : c.id)
                                : update(c.id, k)
                            }
                            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${KIND_BTN[k]}`}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
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
                          className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
                        />
                        <button
                          type="submit"
                          disabled={!note.trim() || busy !== ""}
                          className="shrink-0 rounded-lg bg-accent px-5 text-sm font-bold text-navy transition hover:bg-accent-2 disabled:opacity-50"
                        >
                          Send
                        </button>
                      </form>
                    )}

                    {latest && (
                      <p className="mt-2.5 text-xs text-muted">
                        Last sent <strong className="font-bold text-ink">{latest.kind}</strong>
                        {latest.note ? ` — ${latest.note}` : ""} ·{" "}
                        <LocalTime value={latest.created_at} />
                        {latest.acknowledged_at && " · acknowledged"}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </StaffShell>
  );
}
