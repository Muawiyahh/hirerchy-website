"use client";

import type { AppRow } from "@/lib/portal";

// Status → pill colour (navy + gold palette, with success/error accents).
const STATUS_STYLES: Record<string, string> = {
  Applied: "bg-navy/[0.07] text-ink",
  Screening: "bg-accent/15 text-accent-deep",
  Interview: "bg-success/10 text-success",
  Offer: "bg-success/15 text-success",
  Rejected: "bg-error/10 text-error",
  Closed: "bg-surface-2 text-muted",
};

export default function PortalTracker({ apps }: { apps: AppRow[] }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-accent-deep">Tracker</div>
          <h2 className="mt-1 text-2xl font-bold text-ink">Your applications</h2>
        </div>
        {apps.length > 0 && (
          <span className="shrink-0 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink/70">
            {apps.length} logged
          </span>
        )}
      </div>

      {apps.length ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-border bg-surface-2 text-[10.5px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2 font-semibold">Company</th>
                  <th className="px-4 py-2 font-semibold">Role</th>
                  <th className="px-4 py-2 font-semibold">Listing</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="whitespace-nowrap px-4 py-2 font-semibold">Applied</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr
                    key={a.id}
                    className="transition-colors even:bg-surface-2/40 hover:bg-accent/[0.06]"
                  >
                    <td className="px-4 py-1.5 font-medium text-ink">{a.company}</td>
                    <td className="px-4 py-1.5 text-ink/80">{a.role_title || "—"}</td>
                    <td className="px-4 py-1.5">
                      {a.job_url ? (
                        <a
                          href={a.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={a.job_url}
                          className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                        >
                          View
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[a.status] || "bg-surface-2 text-ink/70"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-1.5 tabular-nums text-muted">{a.applied_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="py-10 text-center">
            <p className="mx-auto max-w-md text-sm text-muted">
              No applications logged yet. Once Hirerchy starts applying on your behalf — usually within a
              few days of onboarding — every role will appear here so you always know exactly what&apos;s happening.
            </p>
          </div>
        </div>
      )}

      {apps.length > 0 && (
        <p className="mt-3 text-xs text-muted">Newest first · every application we send appears here automatically.</p>
      )}
    </div>
  );
}
