"use client";

import { useState } from "react";
import { Stat, StatusPill, clientName } from "../StaffShell";
import { CLIENT_STATUSES, type ClientRow } from "@/lib/portal";
import type { AdminData } from "./AdminApp";

const FILTERS = ["All", ...CLIENT_STATUSES] as const;

/** Tab 1 — the client queue: headline counts, a status filter, and a card per
 *  client that opens the detail view. */
export default function AdminClients({
  data,
  onOpen,
}: {
  data: AdminData;
  onOpen: (id: string) => void;
  onChanged: () => void;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const { clients, staff, assignments } = data;
  const employees = staff.filter((s) => s.role === "employee");
  const active = clients.filter((c) => c.status === "Active").length;
  const completed = clients.filter((c) => c.status === "Completed").length;
  const attention = clients.filter(
    (c) => c.status === "Halted" || c.status === "Payment Pending"
  ).length;

  const shown = filter === "All" ? clients : clients.filter((c) => c.status === filter);

  const employeeFor = (c: ClientRow) => {
    const a = assignments.find((x) => x.client_id === c.id);
    if (!a) return "Unassigned";
    return staff.find((s) => s.id === a.employee_id)?.email ?? "Unknown";
  };

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Client queue</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat value={clients.length} label="Total clients" />
        <Stat value={active} label="Active" />
        <Stat value={completed} label="Completed" />
        <Stat value={attention} label="Needs attention" />
        <Stat value={employees.length} label="Employees" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f
                ? "bg-accent text-navy"
                : "border border-border bg-surface text-muted hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-8 rounded-card border border-border bg-surface p-8 text-center text-sm text-muted">
          No clients {filter === "All" ? "yet" : `with status “${filter}”`}.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <button
              key={c.id}
              onClick={() => onOpen(c.id)}
              className="rounded-card border border-border bg-surface p-5 text-left shadow-sm transition hover:border-accent/60 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-ink">{clientName(c)}</span>
                <StatusPill status={c.status} />
              </div>
              <div className="mt-1 text-xs text-muted">
                {c.submitted_at
                  ? new Date(c.submitted_at).toLocaleDateString()
                  : "Profile not submitted"}
              </div>
              <div className="mt-4 border-t border-border pt-3 text-xs text-muted">
                Plan: <strong className="font-semibold text-ink">{c.plan || "—"}</strong>
                <span className="mx-2">·</span>
                {c.weeks_completed}/{c.weeks_total || "—"} wks
              </div>
              <div className="mt-1 text-xs text-muted">
                Assigned: <strong className="font-semibold text-ink">{employeeFor(c)}</strong>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
