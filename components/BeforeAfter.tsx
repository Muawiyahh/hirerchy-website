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

export default function BeforeAfter({
  tone = "light",
}: {
  tone?: "light" | "navy";
}) {
  const d = tone === "navy";
  const divider = d ? "border-white/10" : "border-border";

  return (
    <div
      className={`overflow-hidden rounded-card border ${divider} ${
        d ? "bg-white/[0.04]" : "bg-surface"
      }`}
    >
      <div
        className={`grid grid-cols-2 border-b ${divider} text-xs font-semibold uppercase tracking-wider`}
      >
        <div className={`flex items-center gap-2 px-5 py-3 ${d ? "text-white/60" : "text-muted"}`}>
          <span className={`h-2 w-2 rounded-full ${d ? "bg-error-light" : "bg-error"}`} /> Before
        </div>
        <div
          className={`flex items-center gap-2 border-l px-5 py-3 ${divider} ${
            d ? "text-success-light" : "text-success"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${d ? "bg-success-light" : "bg-success"}`} /> After Hirerchy
        </div>
      </div>
      {ROWS.map((row, i) => (
        <div key={i} className={`grid grid-cols-2 ${i > 0 ? `border-t ${divider}` : ""}`}>
          <p
            className={`px-5 py-5 text-sm leading-relaxed ${
              d ? "text-white/55" : "text-muted/80"
            }`}
          >
            {row.before}
          </p>
          <div
            className={`border-l px-5 py-5 ${divider} ${
              d ? "bg-accent/[0.08]" : "bg-accent/[0.06]"
            }`}
          >
            <p className={`flex gap-2 text-sm leading-relaxed ${d ? "text-white" : "text-ink"}`}>
              <span className={`mt-0.5 shrink-0 ${d ? "text-accent" : "text-accent-deep"}`}>
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
