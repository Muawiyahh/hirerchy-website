"use client";

import { useState } from "react";
import { StatusPill, WeekBar, clientName } from "../StaffShell";
import {
  CLIENT_STATUSES, updateClientPipeline, bumpClientWeek, assignClient,
  type ClientRow, type StaffRow, type AssignmentRow, type ClientStatus,
} from "@/lib/portal";
import { plans } from "@/lib/content";

const field =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

/** The per-client control panel: pipeline status, employee assignment, and the
 *  week counter. Everything here is what the client sees on their dashboard. */
export default function AdminClientDetail({
  client,
  staff,
  assignments,
  onBack,
  onChanged,
}: {
  client: ClientRow;
  staff: StaffRow[];
  assignments: AssignmentRow[];
  onBack: () => void;
  onChanged: () => void;
}) {
  const employees = staff.filter((s) => s.role === "employee");
  const assigned = assignments.find((a) => a.client_id === client.id)?.employee_id ?? "";

  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [weeksTotal, setWeeksTotal] = useState(String(client.weeks_total || ""));

  async function run(what: string, fn: () => Promise<unknown>) {
    setBusy(what);
    setError("");
    try {
      await fn();
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't save.");
    } finally {
      setBusy("");
    }
  }

  return (
    <>
      <button
        onClick={onBack}
        className="text-sm font-semibold text-muted transition hover:text-ink"
      >
        ← Back to queue
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {clientName(client)}
        </h1>
        <StatusPill status={client.status} />
      </div>
      {client.email && <p className="mt-1 text-sm text-muted">{client.email}</p>}

      {error && (
        <p className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {/* status */}
        <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink">Status</h2>
          <p className="mt-1 text-sm text-muted">
            This is what the client sees on their dashboard.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CLIENT_STATUSES.map((s) => (
              <button
                key={s}
                disabled={busy !== ""}
                onClick={() =>
                  run("status", () =>
                    updateClientPipeline(client.id, { status: s as ClientStatus })
                  )
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                  client.status === s
                    ? "bg-navy text-white"
                    : "border border-border bg-surface text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* assignment */}
        <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink">Assigned employee</h2>
          <p className="mt-1 text-sm text-muted">
            Only the assigned employee can see this client.
          </p>
          <select
            className={`${field} mt-4`}
            value={assigned}
            disabled={busy !== ""}
            onChange={(e) =>
              run("assign", () => assignClient(client.id, e.target.value || null))
            }
          >
            <option value="">Unassigned</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.email}
              </option>
            ))}
          </select>
          {employees.length === 0 && (
            <p className="mt-3 text-xs text-muted">
              No employees yet — create one on the Employees tab.
            </p>
          )}
        </section>

        {/* plan + weeks */}
        <section className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink">Plan &amp; weeks</h2>

          <label className="mt-4 block text-xs font-medium text-muted">Plan</label>
          <select
            className={`${field} mt-1.5`}
            value={client.plan ?? ""}
            disabled={busy !== ""}
            onChange={(e) =>
              run("plan", () =>
                updateClientPipeline(client.id, { plan: e.target.value || null })
              )
            }
          >
            <option value="">No plan set</option>
            {plans.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-xs font-medium text-muted">
            Weeks in plan
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              type="number"
              min={0}
              className={field}
              value={weeksTotal}
              onChange={(e) => setWeeksTotal(e.target.value)}
            />
            <button
              disabled={busy !== ""}
              onClick={() =>
                run("total", () =>
                  updateClientPipeline(client.id, {
                    weeks_total: Math.max(0, parseInt(weeksTotal || "0", 10)),
                  })
                )
              }
              className="shrink-0 rounded-full bg-navy px-4 text-sm font-semibold text-white transition hover:bg-navy-2 disabled:opacity-50"
            >
              Set
            </button>
          </div>

          <div className="mt-5 border-t border-border pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-muted">Weeks completed</span>
              <span className="text-2xl font-extrabold tabular-nums text-ink">
                {client.weeks_completed}
                <span className="text-base font-semibold text-muted">
                  /{client.weeks_total || "—"}
                </span>
              </span>
            </div>
            <div className="mt-3">
              <WeekBar done={client.weeks_completed} total={client.weeks_total} />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                disabled={busy !== "" || client.weeks_completed >= client.weeks_total}
                onClick={() => run("week", () => bumpClientWeek(client.id, 1))}
                className="flex-1 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-navy transition hover:bg-accent-2 disabled:opacity-50"
              >
                + Add a week
              </button>
              <button
                disabled={busy !== "" || client.weeks_completed <= 0}
                onClick={() => run("week", () => bumpClientWeek(client.id, -1))}
                className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-muted transition hover:text-ink disabled:opacity-50"
              >
                −
              </button>
            </div>
            {client.weeks_total === 0 && (
              <p className="mt-3 text-xs text-muted">
                Set the number of weeks in the plan before counting any.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
