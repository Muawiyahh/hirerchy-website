"use client";

import { useState } from "react";
import { clientName, initials } from "../StaffShell";
import { acknowledgeUpdate } from "@/lib/portal";
import LocalTime from "../LocalTime";
import type { AdminData } from "./AdminApp";

const KIND_STYLE: Record<string, string> = {
  Completed: "border-l-success bg-success/[0.07] text-success",
  "Facing an Issue": "border-l-error bg-error/[0.07] text-error",
  Pending: "border-l-accent bg-accent/[0.08] text-accent-deep",
  Other: "border-l-border bg-surface-2 text-muted",
};

/** Compact week meter — shorter and narrower than the queue's, since this page
 *  stacks many of them. */
function Meter({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;
  const complete = total > 0 && done >= total;
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${complete ? "bg-success" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-muted">
        {done}/{total || "—"} wks
      </span>
    </div>
  );
}

/** Tab 3 — employees, the clients under each, week progress and status pings. */
export default function AdminOperations({
  data,
  onOpen,
  onChanged,
  onMessage,
}: {
  data: AdminData;
  onOpen: (id: string) => void;
  onChanged: () => void;
  onMessage: (id: string) => void;
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

      <div className="mt-5 space-y-4">
        {employees.map((emp) => {
          const mine = data.assignments
            .filter((a) => a.employee_id === emp.id)
            .map((a) => data.clients.find((c) => c.id === a.client_id))
            .filter((c): c is NonNullable<typeof c> => Boolean(c));

          return (
            <section
              key={emp.id}
              className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border bg-panel px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                    {initials(emp.email)}
                  </span>
                  <span className="text-sm font-bold text-ink">{emp.email}</span>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                  {mine.length} client{mine.length === 1 ? "" : "s"}
                </span>
              </div>

              {mine.length === 0 ? (
                <p className="px-4 py-4 text-[13px] text-muted">No clients assigned yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {mine.map((c) => {
                    const updates = data.updates.filter((u) => u.client_id === c.id);
                    return (
                      <li key={c.id} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <button
                              onClick={() => onOpen(c.id)}
                              className="text-sm font-bold text-ink hover:text-accent-deep"
                            >
                              {clientName(c)}
                            </button>
                            <Meter done={c.weeks_completed} total={c.weeks_total} />
                          </div>
                          <button
                            onClick={() => onMessage(c.id)}
                            className="shrink-0 rounded-md border border-border bg-surface px-3 py-1.5 text-[11px] font-bold text-ink transition hover:border-accent/60 hover:bg-accent hover:text-navy"
                          >
                            Message Client
                          </button>
                        </div>

                        {updates.slice(0, 2).map((u) => (
                          <div
                            key={u.id}
                            className={`mt-2 flex flex-wrap items-center justify-between gap-2 rounded-r-md border-l-[3px] px-3 py-1.5 ${
                              KIND_STYLE[u.kind] || KIND_STYLE.Other
                            } ${u.acknowledged_at ? "opacity-55" : ""}`}
                          >
                            <span className="text-[11px] font-bold">
                              {u.kind}
                              {u.note ? <span className="font-medium"> — {u.note}</span> : null}
                              <span className="ml-2 font-medium opacity-70">
                                <LocalTime value={u.created_at} />
                              </span>
                            </span>
                            {!u.acknowledged_at && (
                              <button
                                disabled={busy === u.id}
                                onClick={() => ack(u.id)}
                                className="shrink-0 rounded-md bg-navy px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-navy-2 disabled:opacity-50"
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
          <p className="rounded-lg border border-dashed border-border bg-surface p-10 text-center text-sm text-muted">
            No employees yet. Create one on the Employees tab, then assign clients to them.
          </p>
        )}

        {unassigned.length > 0 && (
          <section className="rounded-lg border border-accent/40 bg-accent/[0.06] px-4 py-3.5">
            <h2 className="text-[13px] font-bold text-ink">
              Waiting to be assigned ({unassigned.length})
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {unassigned.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onOpen(c.id)}
                  className="rounded-md border border-border bg-surface px-2.5 py-1 text-[11px] font-bold text-ink transition hover:border-accent"
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
