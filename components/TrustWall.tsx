import Reveal from "./Reveal";
import StatCounter from "./StatCounter";
import { Section, Heading } from "./ui";
import { trustedCompanies, trustDisclaimer, stats } from "@/lib/content";

/** Companies clients have interviewed at, over the headline numbers. */
export default function TrustWall({ tone = "navy" }: { tone?: "light" | "navy" }) {
  const onDark = tone === "navy";

  return (
    <Section id="trusted" tone={tone}>
      <Reveal>
        <Heading
          center
          onDark={onDark}
          eyebrow="Real results"
          title="Where our clients have interviewed"
          sub="A selection of the companies our clients have interviewed with through Hirerchy."
        />
      </Reveal>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {trustedCompanies.map((name, i) => (
          <Reveal
            as="span"
            key={name}
            delay={(i % 6) * 60}
            className={`rounded-full border px-4 py-2.5 text-[13px] font-bold ${
              onDark
                ? "border-accent/30 bg-white/[0.06] text-white"
                : "border-border bg-surface text-ink shadow-sm"
            }`}
          >
            {name}
          </Reveal>
        ))}
      </div>

      <p
        className={`mx-auto mt-6 max-w-2xl text-center text-[11px] ${
          onDark ? "text-white/50" : "text-muted"
        }`}
      >
        {trustDisclaimer}
      </p>

      {/* headline numbers */}
      <Reveal>
        <div
          className={`mt-12 grid overflow-hidden rounded-card border sm:grid-cols-3 ${
            onDark ? "border-white/12 bg-white/[0.04]" : "border-border bg-surface shadow-sm"
          }`}
        >
          <Number
            onDark={onDark}
            value={stats.appsPerWeek}
            label={stats.appsPerWeekLabel}
            border={onDark}
          />
          <Number
            onDark={onDark}
            value={stats.hoursReclaimed}
            label={stats.hoursReclaimedLabel}
            border={onDark}
          />
          <Number
            onDark={onDark}
            value={stats.callbackRate}
            suffix="%"
            label={stats.callbackRateLabel}
          />
        </div>
      </Reveal>
    </Section>
  );
}

function Number({
  value,
  suffix,
  label,
  onDark,
  border,
}: {
  value: number;
  suffix?: string;
  label: string;
  onDark: boolean;
  border?: boolean;
}) {
  return (
    <div
      className={`px-6 py-8 text-center ${
        border
          ? "border-b border-white/10 sm:border-b-0 sm:border-r"
          : "border-b border-border last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
      }`}
    >
      <div
        className={`text-4xl font-extrabold tracking-tight ${
          onDark ? "text-accent" : "text-accent-deep"
        }`}
      >
        <StatCounter value={value} suffix={suffix} />
      </div>
      <p
        className={`mx-auto mt-2 max-w-[220px] text-sm ${
          onDark ? "text-white/70" : "text-muted"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
