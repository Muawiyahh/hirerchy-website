"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { signOut } from "@/lib/portal";

/**
 * Dashboard chrome for staff. The site navbar hides itself inside the portal,
 * so this navy bar is the only header — brand on the left, tabs beside it,
 * sign out on the right.
 */
export default function StaffShell<T extends string>({
  role,
  tabs,
  active,
  onSelect,
  children,
}: {
  role: string;
  tabs: readonly { id: T; label: string; badge?: number }[];
  active: T;
  onSelect: (id: T) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 bg-navy">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 sm:px-8">
          <span className="flex shrink-0 items-baseline gap-1.5">
            <Image src="/logo-on-dark.png" alt="" width={22} height={22} className="translate-y-1 rounded-[22%]" aria-hidden="true" />
            <span className="font-display text-lg font-bold tracking-[0.01em] text-white">
              Hirerchy
            </span>
            <span className="text-accent">.</span>
            <span className="text-sm font-medium text-white/55">{role}</span>
          </span>

          <nav className="flex flex-wrap items-center gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelect(t.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  active === t.id
                    ? "bg-accent text-navy"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
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
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle className="text-white/60 hover:bg-white/10 hover:text-white" />
            <button
              onClick={() => signOut().then(() => location.reload())}
              className="flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-5 py-9 sm:px-8">{children}</div>
    </div>
  );
}

/* ── Small shared pieces ─────────────────────────────────────────────────── */

export const STATUS_PILL: Record<string, string> = {
  Submitted: "bg-surface-2 text-muted",
  "In Review": "bg-accent/15 text-accent-deep",
  Contacted: "bg-accent/25 text-accent-deep",
  "Payment Pending": "bg-error/10 text-error",
  Active: "bg-success/12 text-success",
  Completed: "bg-success/20 text-success",
  Halted: "bg-error/15 text-error",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold ${
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
      <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-muted">
        {done}/{total || "—"} wks
      </span>
    </div>
  );
}

/** Square-cornered stat tile with an icon well — the queue's headline row. */
export function Stat({
  value,
  label,
  icon,
  tone = "ink",
}: {
  value: number | string;
  label: string;
  icon: ReactNode;
  tone?: "ink" | "success" | "accent" | "error";
}) {
  const tones = {
    ink: "bg-navy/10 text-navy dark:bg-white/10 dark:text-white",
    success: "bg-success/12 text-success",
    accent: "bg-accent/15 text-accent-deep",
    error: "bg-error/12 text-error",
  };
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface px-5 py-4 shadow-sm">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </span>
      <span>
        <span className="block text-2xl font-extrabold leading-none tracking-tight text-ink">
          {value}
        </span>
        <span className="mt-1 block text-xs font-medium text-muted">{label}</span>
      </span>
    </div>
  );
}

export function initials(text: string) {
  const parts = text.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || text.slice(0, 2).toUpperCase();
}

export function clientName(c: { first_name?: string; last_name?: string; email?: string }) {
  const n = `${c.first_name || ""} ${c.last_name || ""}`.trim();
  return n || c.email || "Unnamed client";
}
