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

/* Sections alternate light → navy → light … down the page. */
export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proof, not promises"
        title="The numbers behind the callbacks"
        sub="We track one thing above all: interview callbacks. Here's what that's looked like across our clients — specific figures we can stand behind."
      />

      {/* big stat grid — navy */}
      <Section tone="navy">
        <div className="grid gap-px overflow-hidden rounded-card bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {bigStats.map((s, i) => (
            <Reveal as="div" key={i} delay={i * 70} className="bg-navy">
              <div className="h-full px-6 py-9 text-center">
                <div className="text-4xl font-extrabold tracking-tight text-accent">
                  <StatCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="mx-auto mt-2 max-w-[180px] text-sm text-white/70">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-center text-[11px] text-white/50">
          Based on Hirerchy client data. Individual results vary; figures are
          updated periodically.
        </p>
      </Section>

      {/* weekly volume chart — light */}
      <Section>
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

      {/* before / after — navy */}
      <Section tone="navy">
        <Reveal>
          <Heading
            onDark
            eyebrow="Show the work"
            title="Before & after: the resume rewrite"
            sub="A resume that lists duties gets filtered out. One that proves impact gets read. Here's the kind of transformation we make (anonymized)."
          />
        </Reveal>
        <div className="mt-10">
          <Reveal>
            <BeforeAfter tone="navy" />
          </Reveal>
        </div>
      </Section>

      {/* testimonials — light */}
      <Testimonials />

      <CTASection
        title="Want results like these?"
        sub="The fastest way to see if we can help is a free resume review — we'll tell you exactly what's holding you back."
      />
    </>
  );
}
