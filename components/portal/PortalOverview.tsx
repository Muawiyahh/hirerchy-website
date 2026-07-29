"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { steps, site } from "@/lib/content";
import type { AppRow, ClientProfile } from "@/lib/portal";
import { completionFromProfile, missingFromProfile } from "./config";

/* Same 1080px column the site header and marketing pages use, so the portal
   lines up with the rest of the site instead of sitting on its own grid. */
function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1080px] px-6 ${className}`}>{children}</div>;
}

/* Status pills, tuned for a navy background — the light-mode tracker colours
   would sink into the band. */
const STATUS_ON_NAVY: Record<string, string> = {
  Applied: "bg-white/12 text-white",
  Screening: "bg-accent/25 text-accent-2",
  Interview: "bg-[#3ddc84]/20 text-[#3ddc84]",
  Offer: "bg-[#3ddc84]/25 text-[#3ddc84]",
  Rejected: "bg-error/20 text-[#ff9d9d]",
  Closed: "bg-white/10 text-bg/60",
};

/**
 * The client's home screen after onboarding. Bands alternate navy → paper →
 * navy → paper so it reads like the rest of the site rather than a bare form.
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
      <section className="border-b border-accent-2/20 bg-navy py-12">
        <Shell>
          <div className="flex items-center gap-3">
            <BrandMark size={32} onDark />
            <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-accent-2">
              {justSubmitted ? "Profile submitted" : "Your dashboard"}
            </span>
          </div>

          <h1 className="font-display mt-4 text-[26px] font-extrabold tracking-tight text-white wide:text-[32px]">
            {justSubmitted ? `You're live, ${first}! 🎉` : `Welcome back, ${first}`}
          </h1>
          <p className="mt-2 max-w-[60ch] text-[15px] text-[#c7d0e0]">
            {justSubmitted
              ? "Your profile is in. Our team will start applying to matched roles under your name — every application lands in your tracker so you always know what's happening."
              : "Here's where your job search stands. We keep applying on your behalf; you keep an eye on the callbacks."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Tile label="Applications sent" value={applied} />
            <Tile label="Interviews & offers" value={interviews} />
            <Tile label="Profile completeness" value={`${pct}%`} meter={pct} />
          </div>
        </Shell>
      </section>

      {/* ── 2. paper: what happens next ──────────────────────────────────── */}
      <section className="border-b border-border py-12">
        <Shell>
          <Eyebrow>What happens next</Eyebrow>
          <h2 className="font-display mt-3 text-[22px] font-semibold text-ink wide:text-[26px]">
            Your six steps, start to interview.
          </h2>

          <ol className="mt-8 grid gap-5 sm:grid-cols-2 wide:grid-cols-3">
            {steps.map((s) => (
              <li
                key={s.n}
                className="rounded-[10px] border border-border bg-surface px-[22px] py-[26px]"
              >
                <div className="font-display mb-4 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-navy text-sm font-bold text-bg">
                  {s.n}
                </div>
                <h3 className="mb-2 text-base font-bold text-ink">{s.title}</h3>
                <p className="text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Shell>
      </section>

      {/* ── 3. navy: latest applications ─────────────────────────────────── */}
      <section className="border-b border-accent-2/20 bg-navy py-12">
        <Shell>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-accent-2">
                Latest activity
              </span>
              <h2 className="font-display mt-3 text-[22px] font-semibold text-white wide:text-[26px]">
                {applied ? "Your most recent applications" : "Your tracker is ready and waiting"}
              </h2>
            </div>
            {applied > 0 && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-bg/80">
                {applied} logged
              </span>
            )}
          </div>

          {recent.length ? (
            <div className="mt-6 overflow-hidden rounded-[10px] border border-white/12">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-white/12 bg-white/[0.06] text-[10.5px] uppercase tracking-wide text-bg/60">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Company</th>
                    <th className="px-4 py-2 font-semibold">Role</th>
                    <th className="px-4 py-2 font-semibold">Listing</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="whitespace-nowrap px-4 py-2 font-semibold">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a.id} className="border-t border-white/[0.07]">
                      <td className="px-4 py-2 font-medium text-white">{a.company}</td>
                      <td className="px-4 py-2 text-bg/75">{a.role_title || "—"}</td>
                      <td className="px-4 py-2">
                        {a.job_url ? (
                          <a
                            href={a.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-accent-2 hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-bg/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            STATUS_ON_NAVY[a.status] || "bg-white/10 text-bg/70"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 tabular-nums text-bg/60">
                        {a.applied_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 max-w-[60ch] text-[15px] text-[#c7d0e0]">
              Nothing logged yet. Once our team starts applying on your behalf — usually within a
              few days of onboarding — every company, role and status appears here automatically.
            </p>
          )}

          <div className="mt-7 flex flex-wrap gap-3.5">
            <button
              onClick={onGoTracker}
              className="font-display rounded-md border border-accent bg-accent px-6 py-[13px] text-[14.5px] font-semibold text-navy transition-colors hover:border-accent-2 hover:bg-accent-2"
            >
              Go to tracker →
            </button>
            <button
              onClick={onGoProfile}
              className="font-display rounded-md border border-white/30 px-6 py-[13px] text-[14.5px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Update my details
            </button>
          </div>
        </Shell>
      </section>

      {/* ── 4. paper: profile completeness + help ────────────────────────── */}
      <section className="py-12">
        <Shell>
          <div className="grid gap-5 wide:grid-cols-[1.15fr_1fr] wide:items-start">
            <div className="rounded-[10px] border border-border bg-surface p-6 sm:p-7">
              <Eyebrow>Your profile</Eyebrow>
              <h2 className="font-display mt-3 text-[20px] font-bold text-ink">
                {missing.length ? "A few details still to fill" : "Your profile is complete"}
              </h2>
              <p className="mt-2 text-sm text-muted">
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
                <span className="font-display text-sm font-bold text-ink">{pct}%</span>
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
                    className="font-display mt-6 rounded-md border border-navy bg-navy px-6 py-[13px] text-[14.5px] font-semibold text-bg transition-colors hover:border-navy-2 hover:bg-navy-2"
                  >
                    Finish my profile
                  </button>
                </>
              )}
            </div>

            <div className="rounded-[10px] border-2 border-accent bg-cream p-6 sm:p-7">
              <span className="font-display inline-block rounded bg-accent px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-navy">
                NEED A HAND?
              </span>
              <p className="mt-4 text-[15px] text-ink">
                Questions about your search, your plan, or the roles we picked this week? Email your
                specialist — we reply within one business day.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="font-display mt-4 inline-block text-[15px] font-bold text-accent hover:underline"
              >
                {site.email}
              </a>

              <div className="mt-6 border-t border-accent/30 pt-5">
                <p className="text-sm text-muted">
                  Not sure what happens next?{" "}
                  <Link href="/how-it-works" className="font-semibold text-accent hover:underline">
                    Read how it works
                  </Link>{" "}
                  or check the{" "}
                  <Link href="/#faq" className="font-semibold text-accent hover:underline">
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

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-display text-xs font-bold uppercase tracking-[0.14em] text-accent">
      {children}
    </span>
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
    <div className="rounded-[10px] border border-white/12 bg-white/[0.06] p-5">
      <div className="font-display text-[34px] font-extrabold leading-none text-accent-2">
        {value}
      </div>
      <div className="mt-2 text-xs font-medium text-bg/70">{label}</div>
      {meter != null && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/12">
          <div
            className="h-full rounded-full bg-accent-2 transition-all"
            style={{ width: `${meter}%` }}
          />
        </div>
      )}
    </div>
  );
}
