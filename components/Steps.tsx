import Reveal from "./Reveal";
import { Section, Heading } from "./ui";
import { steps } from "@/lib/content";

export default function Steps({
  withHeading = true,
  tone = "light",
}: {
  withHeading?: boolean;
  tone?: "light" | "navy";
}) {
  const d = tone === "navy";
  return (
    <Section id="how-it-works" tone={tone}>
      {withHeading && (
        <Reveal>
          <Heading
            center
            onDark={d}
            eyebrow="How it works"
            title="Three steps. Then you just take interviews."
            sub="Onboarding takes about 15 minutes. After that, the work is ours."
          />
        </Reveal>
      )}

      <div className={`grid gap-6 md:grid-cols-3 ${withHeading ? "mt-14" : ""}`}>
        {steps.map((step, i) => (
          <Reveal as="div" key={step.n} delay={i * 90}>
            <div
              className={`h-full rounded-card border p-7 transition-colors ${
                d
                  ? "border-white/10 bg-white/[0.04] hover:border-accent/50"
                  : "border-border bg-surface hover:border-accent/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${d ? "text-accent" : "text-accent-deep"}`}>
                  {step.n}
                </span>
                <span className={`h-px flex-1 ${d ? "bg-white/15" : "bg-border"}`} />
              </div>
              <h3 className={`mt-5 text-lg font-bold ${d ? "text-white" : "text-ink"}`}>
                {step.title}
              </h3>
              <p className={`mt-3 text-sm leading-relaxed ${d ? "text-white/70" : "text-muted"}`}>
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
