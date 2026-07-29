import Reveal from "./Reveal";
import { Section, Heading } from "./ui";
import { whyStats, whyFootnote } from "@/lib/content";

/** The eight numbers that explain why applying alone stopped working. */
export default function WhyThisMatters({ tone = "navy" }: { tone?: "light" | "navy" }) {
  const onDark = tone === "navy";

  return (
    <Section id="why" tone={tone}>
      <Reveal>
        <Heading
          onDark={onDark}
          eyebrow="Why this matters"
          title="The job market broke. Nobody sent you the memo."
          sub="Applying for jobs today is not what it was five years ago. Here's what every single applicant is up against, whether they know it or not."
        />
      </Reveal>

      <div
        className={`mt-12 grid gap-px overflow-hidden rounded-card sm:grid-cols-2 lg:grid-cols-4 ${
          onDark ? "bg-white/10" : "bg-border"
        }`}
      >
        {whyStats.map((s, i) => (
          <Reveal
            as="div"
            key={s.num}
            delay={(i % 4) * 70}
            className={onDark ? "bg-navy" : "bg-surface"}
          >
            <div className="h-full px-6 py-7">
              <div
                className={`text-3xl font-extrabold tracking-tight ${
                  onDark ? "text-accent" : "text-accent-deep"
                }`}
              >
                {s.num}
              </div>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  onDark ? "text-white/70" : "text-muted"
                }`}
              >
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p
          className={`mt-8 max-w-4xl border-l-[3px] border-accent pl-5 text-[15px] leading-relaxed ${
            onDark ? "text-white/85" : "text-ink"
          }`}
        >
          {whyFootnote}
        </p>
      </Reveal>
    </Section>
  );
}
