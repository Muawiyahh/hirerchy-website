import type { Metadata } from "next";
import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import LeadForm from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Free resume review",
  description:
    "Send us your resume and we'll tell you exactly what's holding you back from interview callbacks — free, no commitment.",
};

const perks = [
  "A clear read on why you're not getting callbacks",
  "The 3 biggest fixes to make first",
  "An honest take on whether Hirerchy can help you",
];

export default function FreeReviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="No commitment"
        title="Find out what's holding your resume back"
        sub="Send it over and our team will review it like a recruiter would — then tell you exactly what to fix. Free, no payment, no pressure."
      />

      <section className="px-5 pb-24 sm:px-8">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-start">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-ink">What you&apos;ll get</h2>
              <ul className="mt-5 space-y-4">
                {perks.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-ink/90">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Icon name="check" size={15} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-card border border-border bg-surface/50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon name="spark" size={16} className="text-accent" />
                  Why we do this for free
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  We&apos;d rather show you we know our craft than ask you to take
                  our word for it. If the review helps and you want us to run your
                  whole search, great. If not, you&apos;ve still got useful advice.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink">Request your free review</h2>
              <p className="mt-1 text-sm text-muted">
                Takes under a minute. We&apos;ll reply by email within 1–2 business days.
              </p>
              <div className="mt-6">
                <LeadForm />
              </div>
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
