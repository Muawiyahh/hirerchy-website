"use client";

import type { ReactNode } from "react";
import { signOut } from "@/lib/portal";

/** Sticky tab bar shared by the admin and employee dashboards. Sits directly
 *  under the site navbar (68px) and uses the same 1152px column. */
export default function StaffShell<T extends string>({
  label,
  tabs,
  active,
  onSelect,
  children,
}: {
  label: string;
  tabs: readonly { id: T; label: string; badge?: number }[];
  active: T;
  onSelect: (id: T) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-68px)]">
      <header className="sticky top-[68px] z-20 border-b border-border bg-bg/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1 px-5 py-2 sm:px-8">
          <span className="mr-3 text-sm font-bold text-ink">{label}</span>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active === t.id
                  ? "bg-accent text-navy"
                  : "text-muted hover:bg-surface-2 hover:text-ink"
              }`}
            >
              {t.label}
              {t.badge != null && t.badge > 0 && (
                <span
                  className={`rounded-full px-1.5 text-[11px] font-bold ${
                    active === t.id ? "bg-navy text-accent" : "bg-accent text-navy"
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => signOut().then(() => location.reload())}
            className="ml-auto rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-ink"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}

/* ── Small shared pieces ─────────────────────────────────────────────────── */

export const STATUS_PILL: Record<string, string> = {
  Submitted: "bg-surface-2 text-ink",
  "In Review": "bg-accent/15 text-accent-deep",
  Contacted: "bg-accent/20 text-accent-deep",
  "Payment Pending": "bg-error/10 text-error",
  Active: "bg-success/10 text-success",
  Completed: "bg-success/15 text-success",
  Halted: "bg-error/15 text-error",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        STATUS_PILL[status] || "bg-surface-2 text-muted"
      }`}
    >
      {status}
    </span>
  );
}

export function WeekBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (done / total) * 100) : 0;
  const complete = total > 0 && done >= total;
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full transition-all ${complete ? "bg-success" : "bg-accent"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-muted">
        {done}/{total || "—"} wks
      </span>
    </div>
  );
}

export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5 shadow-sm">
      <div className="text-3xl font-extrabold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-xs font-medium text-muted">{label}</div>
    </div>
  );
}

export function clientName(c: { first_name?: string; last_name?: string; email?: string }) {
  const n = `${c.first_name || ""} ${c.last_name || ""}`.trim();
  return n || c.email || "Unnamed client";
}
