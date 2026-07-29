import Reveal from "./Reveal";
import Icon from "./Icon";
import { Section, Heading } from "./ui";
import { pillars, selectionPromise } from "@/lib/content";

/** Speed + hand-curation, then the selection promise spelled out. */
export default function Promise({ tone = "navy" }: { tone?: "light" | "navy" }) {
  const onDark = tone === "navy";

  return (
    <Section id="promise" tone={tone}>
      <Reveal>
        <Heading
          onDark={onDark}
          eyebrow="Our promise"
          title="We hand pick every role, or we redo the week for free."
          sub="A real person reviews every job before we apply, so what goes out is pinpoint accurate — and if you're not happy with a week's picks, we redo them at no charge."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {pillars.map((p, i) => (
          <Reveal
            as="div"
            key={p.tag}
            delay={i * 80}
            className={`rounded-card border p-7 ${
              onDark ? "border-white/12 bg-white/[0.05]" : "border-border bg-surface shadow-sm"
            }`}
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                onDark ? "bg-accent/20 text-accent" : "bg-accent/15 text-accent-deep"
              }`}
            >
              <Icon name={p.icon} size={22} />
            </span>
            <span
              className={`mt-5 block text-xs font-semibold uppercase tracking-[0.16em] ${
                onDark ? "text-accent" : "text-accent-deep"
              }`}
            >
              {p.tag}
            </span>
            <h3
              className={`mt-2.5 text-lg font-bold leading-snug ${
                onDark ? "text-white" : "text-ink"
              }`}
            >
              {p.title}
            </h3>
            <p
              className={`mt-3 text-sm leading-relaxed ${onDark ? "text-white/70" : "text-muted"}`}
            >
              {p.body}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div
          className={`mt-6 rounded-card border-2 border-accent/60 p-7 ${
            onDark ? "bg-accent/[0.08]" : "bg-accent/[0.06]"
          }`}
        >
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
            Selection promise
          </span>
          <ul className="mt-5 space-y-3.5">
            {selectionPromise.map((item) => (
              <li
                key={item}
                className={`flex gap-3 text-[15px] leading-relaxed ${
                  onDark ? "text-white/85" : "text-ink"
                }`}
              >
                <span className={`mt-0.5 shrink-0 ${onDark ? "text-accent" : "text-accent-deep"}`}>
                  <Icon name="check" size={18} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
