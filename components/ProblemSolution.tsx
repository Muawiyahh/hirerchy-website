import Reveal from "./Reveal";
import Icon from "./Icon";
import { Section, Heading } from "./ui";

const without = [
  "Hours every night lost to repetitive application forms",
  "A resume that quietly gets filtered out before a human sees it",
  "5–10 applications a week, if you can keep up the energy",
  "Silence — and no idea what's actually wrong",
];

const withHirerchy = [
  "Your evenings back — we do the applying for you",
  "An ATS-grade resume engineered to reach a real recruiter",
  "100+ targeted applications a week, consistently",
  "A live dashboard of every application and every callback",
];

export default function ProblemSolution({
  tone = "light",
}: {
  tone?: "light" | "navy";
}) {
  const d = tone === "navy";
  return (
    <Section tone={tone} className={d ? "" : "border-t border-border/60"}>
      <Reveal>
        <Heading
          center
          onDark={d}
          eyebrow="Why Hirerchy"
          title="Job searching is a full-time job. So we do it for you."
          sub="Applying for yourself is exhausting and slow. Here's the difference when a team runs it."
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
        <Reveal>
          <div
            className={`h-full rounded-card border p-7 ${
              d ? "border-white/10 bg-white/[0.04]" : "border-border bg-surface"
            }`}
          >
            <h3
              className={`text-sm font-semibold uppercase tracking-wider ${
                d ? "text-white/60" : "text-muted"
              }`}
            >
              Applying on your own
            </h3>
            <ul className="mt-5 space-y-4">
              {without.map((item) => (
                <li
                  key={item}
                  className={`flex gap-3 text-sm ${d ? "text-white/70" : "text-muted"}`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      d ? "bg-error-light/15 text-error-light" : "bg-error/15 text-error"
                    }`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div
            className={`h-full rounded-card border p-7 ${
              d
                ? "border-accent/40 bg-accent/[0.07]"
                : "glow-accent border-accent/50 bg-surface"
            }`}
          >
            <h3
              className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${
                d ? "text-accent" : "text-accent-deep"
              }`}
            >
              <Icon name="spark" size={16} /> With Hirerchy
            </h3>
            <ul className="mt-5 space-y-4">
              {withHirerchy.map((item) => (
                <li
                  key={item}
                  className={`flex gap-3 text-sm ${d ? "text-white" : "text-ink"}`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      d
                        ? "bg-success-light/15 text-success-light"
                        : "bg-success/15 text-success"
                    }`}
                  >
                    <Icon name="check" size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
