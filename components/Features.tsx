import Reveal from "./Reveal";
import Icon from "./Icon";
import { Section, Heading } from "./ui";
import { features } from "@/lib/content";

export default function Features() {
  return (
    <Section id="whats-included" className="border-t border-border/60">
      <Reveal>
        <Heading
          eyebrow="What's included"
          title="The entire job search, handled for you"
          sub="Not a template you download — a team that does the work, every week, under your name."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal as="div" key={f.title} delay={(i % 3) * 80}>
            <div className="h-full rounded-card border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/60">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-navy ring-1 ring-accent/30">
                <Icon name={f.icon} />
              </div>
              <h3 className="mt-5 text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
