"use client";

import { useState } from "react";
import { Stat, StatusPill, WeekBar, clientName, initials } from "../StaffShell";
import { CLIENT_STATUSES, type ClientRow } from "@/lib/portal";
import LocalTime from "../LocalTime";
import type { AdminData } from "./AdminApp";

const FILTERS = ["All", ...CLIENT_STATUSES] as const;

const I = {
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  bolt: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="m9 11 3 3L22 4" /></svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>
  ),
  badge: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" /></svg>
  ),
};

/** Tab 1 — the client queue. */
export default function AdminClients({
  data,
  onOpen,
  onNew,
}: {
  data: AdminData;
  onOpen: (id: string) => void;
  onChanged: () => void;
  onNew: () => void;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");

  const { clients, staff, assignments } = data;
  const employees = staff.filter((s) => s.role === "employee");
  const active = clients.filter((c) => c.status === "Active").length;
  const completed = clients.filter((c) => c.status === "Completed").length;
  const attention = clients.filter(
    (c) => c.status === "Halted" || c.status === "Payment Pending"
  ).length;

  const term = q.trim().toLowerCase();
  const shown = clients
    .filter((c) => filter === "All" || c.status === filter)
    .filter((c) => !term || clientName(c).toLowerCase().includes(term));

  const employeeFor = (c: ClientRow) => {
    const a = assignments.find((x) => x.client_id === c.id);
    if (!a) return null;
    return staff.find((s) => s.id === a.employee_id)?.email ?? "Unknown";
  };

  const countFor = (f: (typeof FILTERS)[number]) =>
    f === "All" ? clients.length : clients.filter((c) => c.status === f).length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Client Queue</h1>
          <p className="mt-1 text-sm text-muted">
            Every client, where they are in the pipeline, and who&apos;s running them.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients…"
            className="w-full max-w-xs rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
          />
          <button
            onClick={onNew}
            className="shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-2"
          >
            + New Client
          </button>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat value={clients.length} label="Total clients" icon={I.users} />
        <Stat value={active} label="Active" icon={I.bolt} tone="success" />
        <Stat value={completed} label="Completed" icon={I.check} tone="success" />
        <Stat value={attention} label="Needs attention" icon={I.alert} tone={attention ? "error" : "ink"} />
        <Stat value={employees.length} label="Employees" icon={I.badge} tone="accent" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const n = countFor(f);
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                filter === f
                  ? "bg-navy text-white"
                  : "border border-border bg-surface text-muted hover:border-accent/50 hover:text-ink"
              }`}
            >
              {f}
              <span
                className={`rounded px-1.5 text-[11px] tabular-nums ${
                  filter === f ? "bg-white/20 text-white" : "bg-surface-2 text-muted"
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-surface p-12 text-center text-sm text-muted">
          {term ? `No clients matching “${q}”.` : `No clients with status “${filter}”.`}
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((c) => {
            const emp = employeeFor(c);
            const name = clientName(c);
            return (
              <button
                key={c.id}
                onClick={() => onOpen(c.id)}
                className="group overflow-hidden rounded-lg border border-border bg-surface text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg"
              >
                {/* accent rail keeps the card from reading as a flat box */}
                <span
                  className={`block h-1 w-full ${
                    c.status === "Active"
                      ? "bg-success"
                      : c.status === "Halted" || c.status === "Payment Pending"
                        ? "bg-error"
                        : c.status === "Completed"
                          ? "bg-success/60"
                          : "bg-accent"
                  }`}
                />
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
                      {initials(name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start justify-between gap-2">
                        <span className="truncate font-bold text-ink group-hover:text-accent-deep">
                          {name}
                        </span>
                        <StatusPill status={c.status} />
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted">
                        {c.submitted_at
                          ? <>Submitted <LocalTime value={c.submitted_at} dateOnly /></>
                          : "Profile not submitted"}
                      </span>
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3.5">
                    <span className="rounded bg-surface-2 px-2 py-1 text-[11px] font-bold text-ink">
                      {c.plan || "No plan"}
                    </span>
                    <WeekBar done={c.weeks_completed} total={c.weeks_total} />
                  </div>

                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    <span className="text-muted">Assigned</span>
                    {emp ? (
                      <span className="truncate font-semibold text-ink">{emp}</span>
                    ) : (
                      <span className="rounded bg-error/10 px-1.5 py-0.5 font-semibold text-error">
                        Unassigned
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
