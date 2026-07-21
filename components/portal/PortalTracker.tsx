"use client";

import type { AppRow } from "@/lib/portal";

// Status → pill colour (navy + gold palette, with success/error accents).
const STATUS_STYLES: Record<string, string> = {
  Applied: "bg-navy/10 text-navy",
  Screening: "bg-accent/15 text-accent-deep",
  Interview: "bg-success/10 text-success",
  Offer: "bg-success/15 text-success",
  Rejected: "bg-error/10 text-error",
  Closed: "bg-surface-2 text-muted",
};

export default function PortalTracker({ apps }: { apps: AppRow[] }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-accent-deep">Tracker</div>
        <h2 className="mt-1 text-2xl font-bold text-ink">Your applications</h2>
        <p className="mt-2 text-sm text-muted">
          Every role Hirerchy applies to on your behalf appears here — company, role, status and date applied.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        {apps.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="pb-3 pr-4">Company</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Applied</th>
                </tr>
              </thead>
              <tbody className="text-ink/80">
                {apps.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="py-2.5 pr-4 font-medium text-ink">{a.company}</td>
                    <td className="py-2.5 pr-4">{a.role_title || "—"}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[a.status] || "bg-surface-2 text-ink/70"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-muted">{a.applied_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="mx-auto max-w-md text-sm text-muted">
              No applications logged yet. Once Hirerchy starts applying on your behalf — usually within a
              few days of onboarding — every role will appear here so you always know exactly what&apos;s happening.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
