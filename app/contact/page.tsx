import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, Section, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about plans, timelines or how Hirerchy works? Send us a message and we will reply by email within one business day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to a person, not a chatbot."
        sub="Questions about plans, timelines, or whether this fits your search? Ask away — we reply by email within one business day."
      />

      <Section divider={false}>
        <div className="grid gap-10 wide:grid-cols-[1fr_1.05fr] wide:items-start">
          <Reveal>
            <div className="space-y-5">
              <a
                href={`mailto:${site.email}`}
                className="flex items-start gap-4 rounded-[10px] border border-border bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <span className="mt-0.5 text-accent">
                  <Icon name="spark" size={20} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">Email us</span>
                  <span className="block text-sm text-muted">{site.email}</span>
                </span>
              </a>

              <Link
                href="/free-review"
                className="flex items-start gap-4 rounded-[10px] border border-border bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <span className="mt-0.5 text-accent">
                  <Icon name="doc" size={20} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">
                    Get a free resume review
                  </span>
                  <span className="block text-sm text-muted">
                    The fastest way to find out if we can help
                  </span>
                </span>
              </Link>

              <a
                href={`${site.portalUrl}?view=signin`}
                className="flex items-start gap-4 rounded-[10px] border border-border bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <span className="mt-0.5 text-accent">
                  <Icon name="chart" size={20} />
                </span>
                <span>
                  <span className="block text-[15px] font-bold text-ink">
                    Already a client?
                  </span>
                  <span className="block text-sm text-muted">
                    Sign in to your portal to see your application tracker
                  </span>
                </span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-6 sm:p-8">
              <LeadForm
                type="contact"
                cta="Send message"
                successTitle="Message received"
                successBody="Thanks for reaching out — we will get back to you by email within one business day."
                showRole={false}
              />
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
