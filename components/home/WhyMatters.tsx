import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "@/components/ui";
import { whyStats, whyFootnote } from "@/lib/content";

/** The eight numbers that explain why applying alone stopped working. */
export default function WhyMatters() {
  return (
    <Section id="why">
      <Reveal>
        <SectionHead
          eyebrow="Why this matters"
          title="The job market broke. Nobody sent you the memo."
          sub={
            <>
              Applying for jobs today is not what it was five years ago.{" "}
              <strong className="font-bold text-ink">
                Here is what every single applicant is actually up against, whether they know it or
                not.
              </strong>
            </>
          }
        />
      </Reveal>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-border bg-border wide:grid-cols-[repeat(auto-fit,minmax(210px,1fr))]">
        {whyStats.map((s, i) => (
          <Reveal key={s.num} delay={(i % 4) * 70} className="bg-surface px-[22px] py-7">
            <div className="font-display mb-3 text-[34px] font-extrabold leading-none text-accent">
              {s.num}
            </div>
            <div className="text-sm text-muted">{s.label}</div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 max-w-[72ch] border-l-[3px] border-accent pl-[18px] text-[15.5px] text-ink">
        {whyFootnote}
      </Reveal>
    </Section>
  );
}
