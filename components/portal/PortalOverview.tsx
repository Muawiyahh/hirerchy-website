"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { steps, site } from "@/lib/content";
import type { AppRow, ClientProfile } from "@/lib/portal";
import { completionFromProfile, missingFromProfile } from "./config";

/* Same column the site navbar uses, so the portal lines up with the rest of
   the site instead of sitting on its own grid. */
function Shell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>;
}

/* Status pills tuned for the navy bands — the light-mode tracker colours sink
   into them. */
const STATUS_ON_NAVY: Record<string, string> = {
  Applied: "bg-white/12 text-white",
  Screening: "bg-accent/25 text-accent",
  Interview: "bg-success-light/20 text-success-light",
  Offer: "bg-success-light/25 text-success-light",
  Rejected: "bg-error-light/20 text-error-light",
  Closed: "bg-white/10 text-white/60",
};

/**
 * The client's home screen after onboarding. Bands alternate navy → light →
 * navy → light, matching the rhythm the marketing pages use.
 */
export default function PortalOverview({
  profile,
  apps,
  justSubmitted,
  onGoTracker,
  onGoProfile,
}: {
  profile: ClientProfile;
  apps: AppRow[];
  justSubmitted: boolean;
  onGoTracker: () => void;
  onGoProfile: () => void;
}) {
  const first = profile.first_name || "there";
  const pct = completionFromProfile(profile);
  const missing = missingFromProfile(profile);
  const applied = apps.length;
  const interviews = apps.filter((a) => a.status === "Interview" || a.status === "Offer").length;
  const recent = apps.slice(0, 5);

  return (
    <div>
      {/* ── 1. navy: welcome + the three numbers ─────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-14">
        <div className="bg-grid-navy pointer-events-none absolute inset-0" />
        <div className="relative">
          <Shell>
            <div className="flex items-center gap-3">
              <BrandMark size={32} onDark />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {justSubmitted ? "Profile submitted" : "Your dashboard"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {justSubmitted ? `You're live, ${first}! 🎉` : `Welcome back, ${first}`}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70">
              {justSubmitted
                ? "Your profile is in. Our team will start applying to matched roles under your name — every application lands in your tracker so you always know what's happening."
                : "Here's where your job search stands. We keep applying on your behalf; you keep an eye on the callbacks."}
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <Tile label="Applications sent" value={applied} />
              <Tile label="Interviews & offers" value={interviews} />
              <Tile label="Profile completeness" value={`${pct}%`} meter={pct} />
            </div>
          </Shell>
        </div>
      </section>

      {/* ── 2. light: what happens next ──────────────────────────────────── */}
      <section className="py-14">
        <Shell>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
            <span className="h-1 w-1 rounded-full bg-accent" />
            What happens next
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            How your search runs from here.
          </h2>

          <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-card border border-border bg-surface p-6 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Shell>
      </section>

      {/* ── 3. navy: latest applications ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy py-14">
        <div className="bg-grid-navy pointer-events-none absolute inset-0" />
        <div className="relative">
          <Shell>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Latest activity
                </span>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {applied ? "Your most recent applications" : "Your tracker is ready and waiting"}
                </h2>
              </div>
              {applied > 0 && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {applied} logged
                </span>
              )}
            </div>

            {recent.length ? (
              <div className="mt-7 overflow-hidden rounded-card border border-white/12">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead className="border-b border-white/12 bg-white/[0.06] text-[10.5px] uppercase tracking-wide text-white/60">
                      <tr>
                        <th className="px-4 py-2.5 font-semibold">Company</th>
                        <th className="px-4 py-2.5 font-semibold">Role</th>
                        <th className="px-4 py-2.5 font-semibold">Listing</th>
                        <th className="px-4 py-2.5 font-semibold">Status</th>
                        <th className="whitespace-nowrap px-4 py-2.5 font-semibold">Applied</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((a) => (
                        <tr key={a.id} className="border-t border-white/[0.07]">
                          <td className="px-4 py-2 font-medium text-white">{a.company}</td>
                          <td className="px-4 py-2 text-white/75">{a.role_title || "—"}</td>
                          <td className="px-4 py-2">
                            {a.job_url ? (
                              <a
                                href={a.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-accent hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-white/40">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                STATUS_ON_NAVY[a.status] || "bg-white/10 text-white/70"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 tabular-nums text-white/60">
                            {a.applied_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
                Nothing logged yet. Once our team starts applying on your behalf — usually within a
                few days of onboarding — every company, role and status appears here automatically.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onGoTracker}
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-navy transition hover:bg-accent-2"
              >
                Go to tracker →
              </button>
              <button
                onClick={onGoProfile}
                className="rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10 hover:ring-white/50"
              >
                Update my details
              </button>
            </div>
          </Shell>
        </div>
      </section>

      {/* ── 4. light: profile completeness + help ────────────────────────── */}
      <section className="py-14">
        <Shell>
          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-start">
            <div className="rounded-card border border-border bg-surface p-6 shadow-sm sm:p-8">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
                <span className="h-1 w-1 rounded-full bg-accent" />
                Your profile
              </span>
              <h2 className="mt-4 text-xl font-bold text-ink">
                {missing.length ? "A few details still to fill" : "Your profile is complete"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {missing.length
                  ? "The more complete your profile, the more forms we can fill accurately on your behalf — and the fewer applications stall halfway."
                  : "Everything we need is on file. We'll use it exactly as entered when we apply on your behalf."}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-ink">{pct}%</span>
              </div>

              {missing.length > 0 && (
                <>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {missing.slice(0, 8).map((m) => (
                      <li
                        key={m}
                        className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-muted"
                      >
                        {m}
                      </li>
                    ))}
                    {missing.length > 8 && (
                      <li className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-muted">
                        +{missing.length - 8} more
                      </li>
                    )}
                  </ul>
                  <button
                    onClick={onGoProfile}
                    className="mt-6 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-2"
                  >
                    Finish my profile
                  </button>
                </>
              )}
            </div>

            <div className="rounded-card border border-accent/40 bg-accent/[0.08] p-6 shadow-sm sm:p-8">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
                Need a hand?
              </span>
              <p className="mt-4 text-[15px] leading-relaxed text-ink">
                Questions about your search, your plan, or the roles we picked this week? Email your
                specialist — we reply within one business day.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-block text-[15px] font-bold text-accent-deep hover:underline"
              >
                {site.email}
              </a>

              <div className="mt-6 border-t border-accent/30 pt-5">
                <p className="text-sm leading-relaxed text-muted">
                  Not sure what happens next?{" "}
                  <Link
                    href="/how-it-works"
                    className="font-semibold text-accent-deep hover:underline"
                  >
                    Read how it works
                  </Link>{" "}
                  or check the{" "}
                  <Link href="/pricing#faq" className="font-semibold text-accent-deep hover:underline">
                    FAQ
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Shell>
      </section>
    </div>
  );
}

function Tile({
  label,
  value,
  meter,
}: {
  label: string;
  value: string | number;
  meter?: number;
}) {
  return (
    <div className="rounded-card border border-white/12 bg-white/[0.06] p-5">
      <div className="text-3xl font-extrabold tracking-tight text-accent">{value}</div>
      <div className="mt-1.5 text-xs font-medium text-white/70">{label}</div>
      {meter != null && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${meter}%` }}
          />
        </div>
      )}
    </div>
  );
}
