import type { Metadata } from "next";
import { PageHeader, Section, Heading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import VolumeChart from "@/components/VolumeChart";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { stats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Results",
  description:
    "The proof behind Hirerchy — application volume, interview callback rate, and real client outcomes. Specific numbers, not hype.",
};

const bigStats = [
  { value: stats.totalApplications, suffix: "+", label: stats.totalApplicationsLabel },
  { value: stats.callbackRate, suffix: "%", label: stats.callbackRateLabel },
  { value: stats.callbacksThisMonth, suffix: "", label: "interview callbacks this month" },
  { value: stats.clientsServed, suffix: "+", label: "clients served and counting" },
];

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proof, not promises"
        title="The numbers behind the callbacks"
        sub="We track one thing above all: interview callbacks. Here's what that's looked like across our clients — specific figures we can stand behind."
      />

      {/* big stat grid */}
      <Section>
        <div className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {bigStats.map((s, i) => (
            <Reveal as="div" key={i} delay={i * 70}>
              <div className="h-full bg-surface/70 px-6 py-9 text-center">
                <div className="text-4xl font-extrabold tracking-tight text-ink">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mx-auto mt-2 max-w-[180px] text-sm text-muted">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] text-muted/70">
          Based on Hirerchy client data. Individual results vary; figures are
          updated periodically.
        </p>
      </Section>

      {/* weekly volume chart */}
      <Section className="border-t border-border/60">
        <Reveal>
          <Heading
            eyebrow="Consistency"
            title="We don't slow down"
            sub="Volume matters in a job search. Here's how many applications we send for a client in a typical week."
          />
        </Reveal>
        <div className="mt-10">
          <Reveal>
            <VolumeChart />
          </Reveal>
        </div>
      </Section>

      {/* before / after */}
      <Section className="border-t border-border/60">
        <Reveal>
          <Heading
            eyebrow="Show the work"
            title="Before & after: the resume rewrite"
            sub="A resume that lists duties gets filtered out. One that proves impact gets read. Here's the kind of transformation we make (anonymized)."
          />
        </Reveal>
        <div className="mt-10">
          <Reveal>
            <BeforeAfter />
          </Reveal>
        </div>
      </Section>

      <Testimonials />

      <CTASection
        title="Want results like these?"
        sub="The fastest way to see if we can help is a free resume review — we'll tell you exactly what's holding you back."
      />
    </>
  );
}
