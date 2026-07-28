import Reveal from "@/components/Reveal";
import { Section, SectionHead } from "@/components/ui";
import { steps } from "@/lib/content";

export default function Process() {
  return (
    <Section id="process">
      <Reveal>
        <SectionHead
          eyebrow="Process"
          title="This is our six step process."
          sub="One form starts the whole pipeline. Here is what happens after you submit it."
        />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 wide:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal
            key={s.n}
            delay={(i % 4) * 70}
            className="rounded-[10px] border border-border bg-surface px-[22px] py-[26px]"
          >
            <div className="font-display mb-4 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-navy text-sm font-bold text-bg">
              {s.n}
            </div>
            <h3 className="mb-2 text-base font-bold text-ink">{s.title}</h3>
            <p className="text-sm text-muted">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
