import Reveal from "@/components/Reveal";
import { Eyebrow, Wrap } from "@/components/ui";
import { testimonialRows, testimonialBadge } from "@/lib/content";

/**
 * Two rows of quotes scrolling in opposite directions. Each row renders its
 * cards twice — the animation translates by exactly -50%, so the second copy
 * lands where the first started and the loop never shows a seam. Hovering a
 * row pauses it so a quote can actually be read.
 */
export default function Testimonials() {
  return (
    <section id="testimonials" className="border-b border-border py-20">
      <Wrap>
        <Reveal className="mb-12 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Eyebrow>Testimonials</Eyebrow>
            <h2 className="mt-[18px] text-[22px] font-semibold leading-[1.2] tracking-[-0.005em] text-ink wide:text-[26px]">
              What clients say.
            </h2>
          </div>
          <span className="font-display whitespace-nowrap rounded-[20px] bg-navy px-3.5 py-2 text-[13px] font-bold text-accent-2">
            {testimonialBadge}
          </span>
        </Reveal>
      </Wrap>

      {/* full-bleed: the rows run edge to edge and fade out at both ends */}
      <div className="mt-10 flex flex-col gap-5">
        {testimonialRows.map((row, ri) => (
          <div key={ri} className="marquee-track">
            <div className={`marquee-row ${ri === 1 ? "reverse" : ""}`}>
              {[...row, ...row].map((t, i) => {
                const isDup = i >= row.length;
                return (
                  <div
                    key={`${ri}-${i}`}
                    data-dup={isDup || undefined}
                    aria-hidden={isDup || undefined}
                    className="w-[260px] shrink-0 rounded-lg border border-border border-t-[3px] border-t-accent bg-surface px-[22px] py-6 wide:w-[320px]"
                  >
                    <p className="mb-3.5 text-[14.5px] text-ink">&quot;{t.quote}&quot;</p>
                    <div className="font-display text-[13.5px] font-bold text-navy">{t.who}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
