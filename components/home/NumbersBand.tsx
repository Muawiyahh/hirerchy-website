import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import { Eyebrow, Wrap } from "@/components/ui";
import { numbersBand } from "@/lib/content";

/** Navy band: the two numbers that sum up what a week with Hirerchy buys you. */
export default function NumbersBand() {
  return (
    <section id="stats" className="border-b border-accent-2/20 bg-navy py-[60px] text-bg">
      <Wrap>
        <Eyebrow onDark>The numbers</Eyebrow>
        <p className="font-display mb-11 mt-[18px] max-w-[22ch] text-[26px] font-extrabold tracking-[-0.01em] sm:text-[32px]">
          {numbersBand.headline}
        </p>

        <div className="grid gap-7 wide:grid-cols-2 wide:gap-10">
          {numbersBand.stats.map((s) => (
            <Reveal
              key={s.num}
              className="border-t border-white/15 pt-[18px] wide:border-l wide:border-t-0 wide:pl-6 wide:pt-0"
            >
              <CountUp
                value={s.num}
                className="font-display mb-3 block text-[40px] font-extrabold leading-none text-accent-2"
              />
              <div className="max-w-[32ch] text-[15px] text-bg/90">{s.label}</div>
              {s.foot && <div className="mt-2.5 text-xs text-bg/55">{s.foot}</div>}
            </Reveal>
          ))}
        </div>
      </Wrap>
    </section>
  );
}
