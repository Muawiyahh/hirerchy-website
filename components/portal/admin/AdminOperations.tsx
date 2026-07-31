"use client";

import { useState } from "react";
import { WeekBar, clientName } from "../StaffShell";
import { acknowledgeUpdate } from "@/lib/portal";
import type { AdminData } from "./AdminApp";

const KIND_STYLE: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/30",
  "Facing an Issue": "bg-error/10 text-error border-error/30",
  Pending: "bg-accent/15 text-accent-deep border-accent/40",
  Other: "bg-surface-2 text-muted border-border",
};

/** Tab 3 — employees, the clients under each of them, week progress, and any
 *  status pings they've sent up. */
export default function AdminOperations({
  data,
  onOpen,
  onChanged,
}: {
  data: AdminData;
  onOpen: (id: string) => void;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState("");
  const employees = data.staff.filter((s) => s.role === "employee");

  async function ack(id: string) {
    setBusy(id);
    try {
      await acknowledgeUpdate(id);
      onChanged();
    } finally {
      setBusy("");
    }
  }

  const unassigned = data.clients.filter(
    (c) => !data.assignments.some((a) => a.client_id === c.id)
  );

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Operations</h1>
      <p className="mt-1 text-sm text-muted">
        Track employee progress and stay in the loop with clients.
      </p>

      <div className="mt-8 space-y-5">
        {employees.map((emp) => {
          const mine = data.assignments
            .filter((a) => a.employee_id === emp.id)
            .map((a) => data.clients.find((c) => c.id === a.client_id))
            .filter((c): c is NonNullable<typeof c> => Boolean(c));

          return (
            <section
              key={emp.id}
              className="overflow-hidden rounded-card border border-border bg-surface shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {emp.email.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-sm font-bold text-ink">{emp.email}</span>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                  {mine.length} client{mine.length === 1 ? "" : "s"}
                </span>
              </div>

              {mine.length === 0 ? (
                <p className="px-6 py-6 text-sm text-muted">No clients assigned yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {mine.map((c) => {
                    const updates = data.updates.filter((u) => u.client_id === c.id);
                    return (
                      <li key={c.id} className="px-6 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <button
                            onClick={() => onOpen(c.id)}
                            className="text-sm font-semibold text-ink hover:text-accent-deep"
                          >
                            {clientName(c)}
                          </button>
                          <WeekBar done={c.weeks_completed} total={c.weeks_total} />
                        </div>

                        {updates.slice(0, 3).map((u) => (
                          <div
                            key={u.id}
                            className={`mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-2.5 ${
                              KIND_STYLE[u.kind] || KIND_STYLE.Other
                            } ${u.acknowledged_at ? "opacity-60" : ""}`}
                          >
                            <span className="text-xs font-semibold">
                              {u.kind}
                              {u.note ? ` — ${u.note}` : ""}
                              <span className="ml-2 font-normal opacity-70">
                                {new Date(u.created_at).toLocaleString()}
                              </span>
                            </span>
                            {!u.acknowledged_at && (
                              <button
                                disabled={busy === u.id}
                                onClick={() => ack(u.id)}
                                className="shrink-0 rounded-full bg-navy px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-navy-2 disabled:opacity-50"
                              >
                                Acknowledge
                              </button>
                            )}
                          </div>
                        ))}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}

        {employees.length === 0 && (
          <p className="rounded-card border border-border bg-surface p-8 text-center text-sm text-muted">
            No employees yet. Create one on the Employees tab, then assign clients to them.
          </p>
        )}

        {unassigned.length > 0 && (
          <section className="rounded-card border border-accent/40 bg-accent/[0.06] p-6">
            <h2 className="text-sm font-bold text-ink">
              Unassigned ({unassigned.length})
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {unassigned.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onOpen(c.id)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-accent"
                >
                  {clientName(c)}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
