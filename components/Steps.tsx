import Reveal from "./Reveal";
import { Section, Heading } from "./ui";
import { steps } from "@/lib/content";

export default function Steps({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <Section id="how-it-works">
      {withHeading && (
        <Reveal>
          <Heading
            center
            eyebrow="How it works"
            title="Three steps. Then you just take interviews."
            sub="Onboarding takes about 15 minutes. After that, the work is ours."
          />
        </Reveal>
      )}

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal as="div" key={step.n} delay={i * 90}>
            <div className="group relative h-full rounded-card border border-border bg-surface/60 p-7 transition-colors hover:border-accent/40">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-accent">{step.n}</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
