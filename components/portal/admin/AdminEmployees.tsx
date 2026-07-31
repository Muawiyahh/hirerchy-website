"use client";

import { useState } from "react";
import { createEmployee, deleteStaff } from "@/lib/portal";
import type { AdminData } from "./AdminApp";

const field =
  "w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

function genPassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/** Tab 2 — create and remove employee accounts. Deleting goes through the
 *  admin_delete_user RPC so the auth user goes too and the email frees up. */
export default function AdminEmployees({
  data,
  onChanged,
}: {
  data: AdminData;
  onChanged: () => void;
}) {
  const employees = data.staff.filter((s) => s.role === "employee");
  const owners = data.staff.filter((s) => s.role === "owner");

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
      setEmail("");
      setPassword(genPassword());
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create that account.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Delete ${label}? Their account is permanently removed and the email is freed for reuse.`)) return;
    try {
      await deleteStaff(id);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that account.");
    }
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Employees</h1>
      <p className="mt-1 text-sm text-muted">
        Employees only ever see the clients you assign to them.
      </p>

      {error && (
        <p className="mt-5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </p>
      )}

      {created && (
        <div className="mt-5 rounded-card border border-success/30 bg-success/5 p-5">
          <h2 className="text-sm font-bold text-ink">Account created</h2>
          <p className="mt-1 text-sm text-muted">
            Send these credentials to your employee — the password is not recoverable later.
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

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <form
          onSubmit={submit}
          className="rounded-card border border-border bg-surface p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-ink">Add an employee</h2>
          <label className="mt-4 block text-xs font-medium text-muted">Email</label>
          <input
            className={`${field} mt-1.5`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@hirerchy.com"
          />
          <label className="mt-4 block text-xs font-medium text-muted">Password</label>
          <div className="mt-1.5 flex gap-2">
            <input
              className={field}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setPassword(genPassword())}
              className="shrink-0 rounded-full border border-border px-4 text-sm font-semibold text-muted transition hover:text-ink"
            >
              New
            </button>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-accent-2 disabled:opacity-60"
          >
            {busy ? "Creating…" : "Create employee"}
          </button>
        </form>

        <div className="rounded-card border border-border bg-surface shadow-sm">
          <h2 className="border-b border-border px-6 py-4 text-base font-bold text-ink">
            Team ({employees.length} employee{employees.length === 1 ? "" : "s"})
          </h2>
          <ul className="divide-y divide-border">
            {owners.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                <span className="text-sm text-ink">{o.email}</span>
                <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent-deep">
                  Owner
                </span>
              </li>
            ))}
            {employees.map((e) => {
              const load = data.assignments.filter((a) => a.employee_id === e.id).length;
              return (
                <li key={e.id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                  <span>
                    <span className="block text-sm text-ink">{e.email}</span>
                    <span className="block text-xs text-muted">
                      {load} client{load === 1 ? "" : "s"}
                    </span>
                  </span>
                  <button
                    onClick={() => remove(e.id, e.email)}
                    className="rounded-full border border-error/40 px-3 py-1.5 text-xs font-semibold text-error transition hover:bg-error/10"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
            {employees.length === 0 && (
              <li className="px-6 py-8 text-center text-sm text-muted">
                No employees yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
