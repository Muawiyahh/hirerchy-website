import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import { Section, Heading, Button } from "./ui";
import { outcomes, stats } from "@/lib/content";

export default function ResultsPreview({
  tone = "light",
}: {
  tone?: "light" | "navy";
}) {
  const d = tone === "navy";
  const card = d
    ? "border-white/10 bg-white/[0.04]"
    : "border-border bg-surface";

  return (
    <Section id="results" tone={tone} className={d ? "" : "border-t border-border/60"}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <div>
            <Heading
              onDark={d}
              eyebrow="Proof, not promises"
              title="Real outcomes from real clients"
              sub="We measure what matters — interview callbacks. Here's a snapshot of what that looks like across our clients."
            />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className={`rounded-card border p-5 ${card}`}>
                <div className={`text-3xl font-extrabold ${d ? "text-accent" : "text-navy"}`}>
                  <StatCounter value={stats.totalApplications} suffix="+" />
                </div>
                <p className={`mt-1 text-xs ${d ? "text-white/60" : "text-muted"}`}>
                  {stats.totalApplicationsLabel}
                </p>
              </div>
              <div className={`rounded-card border p-5 ${card}`}>
                <div className={`text-3xl font-extrabold ${d ? "text-accent" : "text-navy"}`}>
                  <StatCounter value={stats.callbacksThisMonth} />
                </div>
                <p className={`mt-1 text-xs ${d ? "text-white/60" : "text-muted"}`}>
                  interview callbacks this month
                </p>
              </div>
            </div>
            <div className="mt-7">
              <Button href="/results" variant={d ? "gold" : "soft"}>
                See the full results
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid gap-3 sm:grid-cols-2">
            {outcomes.map((o) => (
              <div
                key={o.role}
                className={`rounded-card border p-5 transition-colors ${card} ${
                  d ? "hover:border-accent/50" : "hover:border-accent/60"
                }`}
              >
                <div
                  className={`text-xs font-medium uppercase tracking-wider ${
                    d ? "text-white/60" : "text-muted"
                  }`}
                >
                  {o.role}
                </div>
                <div
                  className={`mt-2 flex items-center gap-2 text-sm font-semibold ${
                    d ? "text-white" : "text-ink"
                  }`}
                >
                  <span className={d ? "text-success-light" : "text-success"}>↑</span>{" "}
                  {o.result}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
