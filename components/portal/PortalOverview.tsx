"use client";

import BrandMark from "@/components/BrandMark";
import { steps, site } from "@/lib/content";
import type { AppRow } from "@/lib/portal";

/**
 * Hybrid landing / dashboard the client sees after submitting their profile
 * (and every time they log in): a status banner, a few stat tiles, a compact
 * "what happens next", and quick links to the tracker and profile editor.
 */
export default function PortalOverview({
  name,
  completionPct,
  apps,
  justSubmitted,
  onGoTracker,
  onGoProfile,
}: {
  name: string;
  completionPct: number;
  apps: AppRow[];
  justSubmitted: boolean;
  onGoTracker: () => void;
  onGoProfile: () => void;
}) {
  const applied = apps.length;
  const interviews = apps.filter((a) => a.status === "Interview" || a.status === "Offer").length;
  const first = name || "there";

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      {/* status banner */}
      <div className="overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-[0_24px_60px_-28px_rgba(15,31,61,0.6)] sm:p-8">
        <div className="flex items-center gap-3">
          <BrandMark size={32} onDark />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            {justSubmitted ? "Profile submitted" : "Your dashboard"}
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          {justSubmitted ? `You're live, ${first}! 🎉` : `Welcome back, ${first}`}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
          {justSubmitted
            ? "Your profile is in. Our team will start applying to matched roles under your name — every application lands in your tracker so you always know what's happening."
            : "Here's where your job search stands. We keep applying on your behalf; you keep an eye on the callbacks."}
        </p>
      </div>

      {/* stat tiles */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Tile label="Applications sent" value={applied} />
        <Tile label="Interviews & offers" value={interviews} />
        <Tile label="Profile completeness" value={`${completionPct}%`} meter={completionPct} />
      </div>

      {/* what happens next */}
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-bold text-ink">What happens next</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-xl border border-border bg-surface-2 p-4">
              <div className="text-xs font-bold text-accent-deep">{s.n}</div>
              <div className="mt-1.5 text-sm font-semibold text-ink">{s.title}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* quick actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onGoTracker}
          className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-2"
        >
          Go to tracker →
        </button>
        <button
          onClick={onGoProfile}
          className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface-2"
        >
          Update my details
        </button>
      </div>

      <p className="mt-5 text-xs text-muted">
        Questions about your search? Email{" "}
        <a href={`mailto:${site.email}`} className="font-semibold text-accent-deep hover:underline">
          {site.email}
        </a>
        .
      </p>
    </div>
  );
}

function Tile({ label, value, meter }: { label: string; value: string | number; meter?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="text-3xl font-extrabold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-xs font-medium text-muted">{label}</div>
      {meter != null && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${meter}%` }} />
        </div>
      )}
    </div>
  );
}
