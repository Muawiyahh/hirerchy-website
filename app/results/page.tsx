import type { Metadata } from "next";
import { PageHeader, Section, SectionHead, Eyebrow, Wrap } from "@/components/ui";
import Reveal from "@/components/Reveal";
import VolumeChart from "@/components/VolumeChart";
import Testimonials from "@/components/home/Testimonials";
import Trusted from "@/components/home/Trusted";
import IntakeCTA from "@/components/home/IntakeCTA";
import LiveCount from "@/components/LiveCount";
import { proofStats } from "@/lib/content";

export const metadata: Metadata = {
  title: "Results",
  description:
    "The proof behind Hirerchy — application volume, interview callback rate, and where our clients have interviewed.",
};

export default function ResultsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Proof, not promises"
        title="The numbers behind the callbacks"
        sub="We track one thing above all: interview callbacks. Here is what that has looked like across our clients."
      />

      {/* headline stats — navy */}
      <section className="border-b border-accent-2/20 bg-navy py-20">
        <Wrap>
          <Eyebrow onDark>By the numbers</Eyebrow>
          <div className="mt-8 grid gap-px overflow-hidden rounded-[10px] bg-white/10 sm:grid-cols-2 wide:grid-cols-4">
            {proofStats.map((s, i) => (
              <Reveal key={s.label} delay={(i % 4) * 70} className="bg-navy">
                <div className="h-full px-6 py-9 text-center">
                  <div className="font-display text-[34px] font-extrabold leading-none text-accent-2">
                    {s.value}
                  </div>
                  <p className="mx-auto mt-3 max-w-[190px] text-sm text-bg/80">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 rounded-[10px] border border-accent-2/25 bg-white/[0.04] px-6 py-5">
            <span className="live-dot h-[9px] w-[9px] shrink-0 rounded-full bg-[#3ddc84] shadow-[0_0_8px_rgba(61,220,132,0.9)]" />
            <span className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-bg/65">
              Applications submitted to date
            </span>
            <LiveCount />
          </div>

          <p className="mt-5 text-center text-[11px] text-bg/55">
            Based on Hirerchy client data. Individual results vary, and none of this is a
            guaranteed outcome for every case.
          </p>
        </Wrap>
      </section>

      {/* weekly volume */}
      <Section>
        <Reveal>
          <SectionHead
            eyebrow="Consistency"
            title="We do not slow down."
            sub="Volume matters in a job search, but only if it holds up week after week. Here is what a typical run looks like."
          />
        </Reveal>
        <Reveal>
          <VolumeChart />
        </Reveal>
      </Section>

      <Trusted />
      <Testimonials />
      <IntakeCTA />
    </>
  );
}
