import type { Metadata } from "next";
import { PageHeader, Section, Heading } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import PricingCards from "@/components/PricingCards";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import { referral } from "@/lib/content";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Straightforward monthly plans for done-for-you job applications — including an interview guarantee on our top tier. Cancel anytime.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="One job to do: get you hired"
        sub="Pick the level of support you want. Every plan is month-to-month — no long contracts, cancel anytime."
      />

      <Section>
        <PricingCards />
      </Section>

      {/* referral program */}
      <Section className="border-t border-border/60">
        <Reveal>
          <div className="glow-accent grid items-center gap-8 rounded-card border border-accent/30 bg-surface p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                <Icon name="users" size={16} /> Referral program
              </span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {referral.title}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                {referral.body}
              </p>
            </div>
            <div className="rounded-card border border-border bg-surface-2/60 p-6 text-center">
              <div className="text-sm text-muted">You both get</div>
              <div className="mt-1 text-3xl font-extrabold text-ink">1 free week</div>
              <div className="mt-1 text-sm text-muted">of applications, each</div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-dashed border-accent/40 px-4 py-2 font-mono text-sm text-accent">
                YOURNAME-2026
              </div>
              <p className="mt-3 text-[11px] text-muted/70">
                Your unique code appears in your dashboard once you join
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <FAQ />

      <CTASection
        title="Ready when you are"
        sub="Start today, or grab a free resume review first — whichever feels right."
      />
    </>
  );
}
