import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { Eyebrow, SectionHead, Wrap } from "@/components/ui";
import PricingPlans from "@/components/pricing/PricingPlans";
import CompareTable from "@/components/pricing/CompareTable";
import IntakeCTA from "@/components/home/IntakeCTA";
import { pricingHero, pricingFootnote } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Rookie, Pro, Champion and Legend — done-for-you job applications from $27 a week, with every feature compared side by side.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-navy pb-[70px] pt-[90px] text-white">
        <Wrap>
          <Eyebrow onDark>Pricing</Eyebrow>
          <h1 className="font-display mb-[18px] mt-[18px] max-w-[16ch] text-[30px] font-extrabold leading-[1.15] sm:text-[42px]">
            {pricingHero.title}
          </h1>
          <p className="mb-8 max-w-[56ch] text-base text-[#c7d0e0]">{pricingHero.lead}</p>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {pricingHero.stats.map((s) => (
              <div
                key={s.label}
                className="inline-flex items-baseline gap-2.5 rounded-[14px] border border-white/[0.14] bg-white/[0.06] px-5 py-3.5 sm:px-[26px] sm:py-[18px]"
              >
                <span className="font-display text-[34px] font-extrabold text-accent-2">
                  {s.big}
                </span>
                <span className="max-w-[22ch] text-[13.5px] text-[#c7d0e0]">{s.label}</span>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      <section id="pricing" className="border-b border-border pb-20 pt-16">
        <Wrap>
          <Reveal>
            <SectionHead
              eyebrow="Pick your position"
              title="Four plans. Same sharp aim. Different amount of ground covered."
              sub={
                <>
                  Every plan includes a full resume rebuild and ATS optimization from day one,
                  priced to be one of the most affordable done-for-you job application services
                  around.{" "}
                  <strong className="font-bold text-ink">
                    What changes is volume, and how much of the strategy gets handled for you.
                  </strong>
                </>
              }
            />
          </Reveal>

          <PricingPlans />
          <CompareTable />

          <Reveal className="mt-14 border-l-4 border-accent py-1 pl-[18px] text-base font-semibold text-ink">
            {pricingFootnote}
          </Reveal>
        </Wrap>
      </section>

      <IntakeCTA showTagline={false} />
    </>
  );
}
