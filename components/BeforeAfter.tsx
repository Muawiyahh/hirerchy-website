import Icon from "./Icon";

/** Anonymized before/after resume-bullet transformation — "show the work". */
const ROWS = [
  {
    before: "Responsible for managing social media accounts and posting content.",
    after:
      "Grew company social following 3× (4k → 12k) in 6 months by launching a data-driven content calendar.",
  },
  {
    before: "Worked on the sales team and helped with customer questions.",
    after:
      "Closed $480k in new ARR and cut response time 40% across a 200-account book of business.",
  },
  {
    before: "Did data entry and helped make reports for the manager.",
    after:
      "Automated weekly reporting with SQL + Sheets, saving the team ~10 hours every week.",
  },
];

export default function BeforeAfter() {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface/60">
      <div className="grid grid-cols-2 border-b border-border text-xs font-semibold uppercase tracking-wider">
        <div className="flex items-center gap-2 px-5 py-3 text-muted">
          <span className="h-2 w-2 rounded-full bg-error" /> Before
        </div>
        <div className="flex items-center gap-2 border-l border-border px-5 py-3 text-success">
          <span className="h-2 w-2 rounded-full bg-success" /> After Hirerchy
        </div>
      </div>
      {ROWS.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-2 ${i > 0 ? "border-t border-border" : ""}`}
        >
          <p className="px-5 py-5 text-sm leading-relaxed text-muted/80">
            {row.before}
          </p>
          <div className="border-l border-border bg-accent/[0.04] px-5 py-5">
            <p className="flex gap-2 text-sm leading-relaxed text-ink">
              <span className="mt-0.5 shrink-0 text-accent">
                <Icon name="arrow" size={15} />
              </span>
              {row.after}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
