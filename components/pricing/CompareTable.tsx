import Reveal from "@/components/Reveal";
import { compareGroups, plans } from "@/lib/content";

/* Pro and Legend get a tinted column so the eye can follow them down the table. */
const COL_TINT = ["", "bg-accent/[0.08]", "", "bg-black/[0.05]"];
const COL_TOP = ["", "border-t-[3px] border-t-accent", "", "border-t-[3px] border-t-accent"];
const COL_TAG = ["", "Most popular", "", "White glove"];

function Cell({ value }: { value: string }) {
  if (value === "yes") {
    return (
      <span className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[rgba(34,178,76,0.15)] text-sm font-extrabold text-[#1e7145]">
        ✓
      </span>
    );
  }
  if (value === "no") return <span className="text-[17px] text-[#b7bcc6]">—</span>;
  return <>{value}</>;
}

export default function CompareTable() {
  return (
    <Reveal className="mt-[72px]">
      <div className="mb-2">
        <div className="font-display mb-1.5 text-[13px] font-bold uppercase tracking-[0.06em] text-accent">
          Side by side
        </div>
        <h3 className="mb-2.5 text-[22px] font-bold text-ink wide:text-[26px]">
          Every plan, every detail, plain and simple.
        </h3>
        <p className="mb-7 max-w-[62ch] text-[15px] text-muted">
          A quick breakdown of exactly what you get on each plan, no jargon. If a row says a plan
          does not include something, it just means that feature is reserved for a higher tier.
        </p>
      </div>

      <div className="overflow-x-auto rounded-[14px] border border-border shadow-[0_4px_18px_rgba(11,31,63,0.05)]">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr>
              <th className="min-w-[260px] border-b-2 border-border bg-bg px-5 pb-[18px] pt-[22px] text-left" />
              {plans.map((p, i) => (
                <th
                  key={p.name}
                  className={`font-display whitespace-nowrap border-b-2 border-border bg-bg px-5 pb-[18px] pt-[22px] text-center text-base font-extrabold text-navy ${COL_TINT[i]} ${COL_TOP[i]}`}
                >
                  {p.name}
                  {COL_TAG[i] && (
                    <span className="font-sans mt-1 block text-[10.5px] font-bold uppercase tracking-[0.03em] text-accent">
                      {COL_TAG[i]}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareGroups.map((g) => (
              <Rows key={g.group} group={g.group} rows={g.rows} />
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

function Rows({
  group,
  rows,
}: {
  group: string;
  rows: { title: string; sub: string; cells: string[] }[];
}) {
  return (
    <>
      <tr>
        <td
          colSpan={5}
          className="font-display bg-navy px-5 py-[11px] text-[12.5px] font-bold uppercase tracking-[0.06em] text-white"
        >
          {group}
        </td>
      </tr>
      {rows.map((r, ri) => (
        <tr key={r.title} className={ri % 2 === 1 ? "bg-navy/[0.02]" : ""}>
          <td className="min-w-[260px] border-b border-border px-5 py-4 text-left align-middle">
            <span className="block text-[15px] font-bold text-ink">{r.title}</span>
            <span className="block text-[12.5px] font-normal leading-[1.45] text-muted">
              {r.sub}
            </span>
          </td>
          {r.cells.map((c, i) => (
            <td
              key={i}
              className={`border-b border-border px-5 py-4 text-center align-middle text-[14.5px] ${COL_TINT[i]}`}
            >
              <Cell value={c} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
