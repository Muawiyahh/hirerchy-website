import { Button } from "./ui";
import StatCounter from "./StatCounter";
import Icon from "./Icon";
import { site, stats } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[-10%] h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Applying for clients right now
          </div>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            We don&apos;t write resumes.
            <br />
            We get you <span className="text-gradient">interviews.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Hirerchy is your done-for-you job-application team. We rebuild your
            resume, write your cover letters, and hand-apply to 100+ roles a week
            under your name — so your inbox fills with callbacks, not to-dos.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={site.portalUrl} external size="lg">
              Start free <Icon name="arrow" size={18} />
            </Button>
            <Button href="/results" variant="ghost" size="lg">
              See the results
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted">
            Trusted by job-seekers across tech, healthcare, finance &amp; more
          </p>
        </div>

        {/* hero stat bar */}
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-3">
          <HeroStat
            value={stats.callbackRate}
            suffix="%"
            label={stats.callbackRateLabel}
          />
          <HeroStat
            value={stats.appsPerWeek}
            suffix="+"
            label={stats.appsPerWeekLabel}
          />
          <HeroStat
            value={stats.avgDaysToInterview}
            label={stats.avgDaysLabel}
          />
        </div>
        <p className="mt-3 text-center text-[11px] text-muted/70">
          Figures based on Hirerchy client outcomes. Your results may vary.
        </p>
      </div>
    </section>
  );
}

function HeroStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="bg-surface/70 px-6 py-8 text-center backdrop-blur-sm">
      <div className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        <StatCounter value={value} suffix={suffix} />
      </div>
      <div className="mx-auto mt-2 max-w-[200px] text-sm text-muted">{label}</div>
    </div>
  );
}
