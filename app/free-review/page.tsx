import type { Metadata } from "next";
import { PageHeader, Section, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Free resume review",
  description:
    "Send us your resume and we will tell you exactly what is keeping it out of interviews — free, no strings, within 1 to 2 business days.",
};

const CHECKS = [
  "Whether applicant tracking software is filtering you out before a human reads it",
  "The keywords your target roles expect and your resume is missing",
  "Where you are listing duties instead of proving impact",
  "One honest read on whether we can actually help, or whether you are fine on your own",
];

export default function FreeReviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free resume review"
        title="Find out what is holding your resume back."
        sub="Send it over and a real person will read it. No payment, no commitment — just a straight answer on what is costing you callbacks."
      />

      <Section divider={false}>
        <div className="grid gap-10 wide:grid-cols-[1fr_1.05fr] wide:items-start">
          <Reveal>
            <h2 className="text-[22px] font-bold text-ink wide:text-[26px]">
              What we will tell you
            </h2>
            <ul className="mt-6 space-y-4">
              {CHECKS.map((c) => (
                <li key={c} className="flex gap-3 text-[15px] text-ink">
                  <span className="mt-0.5 shrink-0 text-accent">
                    <Icon name="check" size={18} />
                  </span>
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-[10px] border-2 border-accent bg-cream p-6">
              <span className="font-display mb-3 inline-block rounded bg-accent px-3 py-1.5 text-xs font-bold tracking-[0.06em] text-navy">
                NO CATCH
              </span>
              <p className="mt-2 text-[15px] text-ink">
                The review is free whether or not you ever become a client. If we do not think
                we can add anything, we will say so — that is a faster answer than a sales call.
              </p>
            </div>

            <p className="mt-6 text-sm text-muted">
              Would rather just email it?{" "}
              <a href={`mailto:${site.email}`} className="font-semibold text-accent hover:underline">
                {site.email}
              </a>
            </p>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-6 sm:p-8">
              <LeadForm />
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
