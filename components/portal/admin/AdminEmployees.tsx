"use client";

import { useState } from "react";
import { initials } from "../StaffShell";
import { createEmployee, deleteStaff } from "@/lib/portal";
import type { AdminData } from "./AdminApp";

const field =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";
const label = "mb-1.5 block text-xs font-semibold text-muted";

function genPassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Tab 2 — create and remove employee accounts. */
export default function AdminEmployees({
  data,
  onChanged,
}: {
  data: AdminData;
  onChanged: () => void;
}) {
  const employees = data.staff.filter((s) => s.role === "employee");
  const owners = data.staff.filter((s) => s.role === "owner");

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(genPassword());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await createEmployee(email.trim(), password);
      setCreated({ email: email.trim(), password });
      setName("");
      setEmail("");
      setPassword(genPassword());
      setShowForm(false);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create that account.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, who: string) {
    if (!confirm(`Delete ${who}? Their account is permanently removed and the email is freed for reuse.`)) return;
    try {
      await deleteStaff(id);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that account.");
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">Employees</h1>
          <p className="mt-1 text-sm text-muted">
            Employees only ever see the clients you assign to them.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-2"
          >
            + Add New Employee
          </button>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {created && (
        <div className="mt-5 rounded-lg border border-success/30 bg-success/5 p-5">
          <h2 className="text-sm font-bold text-ink">Account created</h2>
          <p className="mt-1 text-sm text-muted">
            Send these to your employee — the password can&apos;t be recovered later.
          </p>
          <div className="mt-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-ink">
            {created.email}
            <br />
            {created.password}
          </div>
          <button
            onClick={() => setCreated(null)}
            className="mt-3 text-xs font-semibold text-muted hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={submit} className="mt-6 max-w-md rounded-lg border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-base font-bold text-ink">Add New Employee</h2>

          <div className="mt-4">
            <label className={label} htmlFor="emp-name">Full Name</label>
            <input id="emp-name" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="mt-4">
            <label className={label} htmlFor="emp-email">Email</label>
            <input id="emp-email" className={field} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@hirerchy.com" />
          </div>
          <div className="mt-4">
            <label className={label} htmlFor="emp-pw">Temporary Password</label>
            <div className="flex gap-2">
              <input id="emp-pw" className={field} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setPassword(genPassword())} className="shrink-0 rounded-lg border border-border px-3 text-xs font-semibold text-muted transition hover:text-ink">
                New
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-accent-2 disabled:opacity-60">
              {busy ? "Creating…" : "Create Employee"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-accent/60">
              Cancel
            </button>
          </div>
          <p className="mt-3 text-[11px] text-muted">
            The name is for your reference — sign-in uses the email.
          </p>
        </form>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {owners.map((o) => (
          <div key={o.id} className="rounded-lg border border-accent/40 bg-accent/[0.06] p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-sm font-bold text-navy">
                {initials(o.email)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-bold text-ink">{o.email}</span>
                <span className="text-xs font-semibold text-accent-deep">Owner — that&apos;s you</span>
              </span>
            </div>
          </div>
        ))}

        {employees.map((e) => {
          const load = data.assignments.filter((a) => a.employee_id === e.id).length;
          return (
            <div key={e.id} className="rounded-lg border border-border bg-surface p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-sm font-bold text-white">
                  {initials(e.email)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-ink">{e.email}</span>
                  <span className="text-xs text-muted">
                    {load} client{load === 1 ? "" : "s"} assigned
                  </span>
                </span>
              </div>
              <button
                onClick={() => remove(e.id, e.email)}
                className="mt-4 w-full rounded-lg border border-error/40 py-2 text-xs font-bold text-error transition hover:bg-error/10"
              >
                Delete
              </button>
            </div>
          );
        })}

        {employees.length === 0 && !showForm && (
          <p className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-sm text-muted sm:col-span-2 xl:col-span-3">
            No employees yet. Add one to start assigning clients.
          </p>
        )}
      </div>
    </>
  );
}
