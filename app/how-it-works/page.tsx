import type { Metadata } from "next";
import { PageHeader, Section, Heading, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Steps from "@/components/Steps";
import CTASection from "@/components/CTASection";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From signup to interviews — see exactly how Hirerchy runs your job search for you, week after week.",
};

const portalSteps = [
  {
    title: "Create your account",
    body: "Sign in to your private client portal and you're ready to start — no email confirmation hoops.",
  },
  {
    title: "Fill your profile once",
    body: "A guided form captures your experience, target roles, locations, salary and work authorization. About 15 minutes.",
  },
  {
    title: "Upload your resume",
    body: "Drop in your current resume (and a cover letter if you have one). Our team takes it from there.",
  },
  {
    title: "We rebuild & start applying",
    body: "We rewrite your resume to pass the filters and begin hand-applying to matched roles within days.",
  },
  {
    title: "Track everything live",
    body: "Watch every company, role, date and status update in your dashboard as the callbacks come in.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="You set it up once. We run it every week."
        sub="No bots spraying generic applications. A real team doing real, targeted work under your name — and you can see all of it."
      />

      <Steps withHeading={false} />

      <Section className="border-t border-border/60">
        <Reveal>
          <Heading
            eyebrow="Inside the portal"
            title="What you actually do (it's not much)"
            sub="Everything starts in your client portal. Here's the full flow from signup to interviews."
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <ol className="relative space-y-8 border-l border-border pl-8">
            {portalSteps.map((s, i) => (
              <Reveal as="li" key={i} delay={i * 70} className="relative">
                <span className="absolute -left-[41px] flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-bg text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={120}>
            <Card className="p-6">
              {/* lightweight dashboard mock */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <Icon name="chart" size={18} className="text-accent" /> Application tracker
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-medium text-success">
                  live
                </span>
              </div>
              <div className="mt-4 space-y-2.5">
                {[
                  ["Stripe", "Product Designer", "Interview", "ok"],
                  ["Notion", "Sr. PM", "Applied", "muted"],
                  ["Airbnb", "UX Researcher", "Screening", "accent"],
                  ["Linear", "Product Manager", "Applied", "muted"],
                  ["Figma", "Design Lead", "Interview", "ok"],
                ].map(([co, role, status, tone], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface-2/60 px-3.5 py-2.5"
                  >
                    <div>
                      <div className="text-sm font-medium text-ink">{co}</div>
                      <div className="text-[11px] text-muted">{role}</div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        tone === "ok"
                          ? "bg-success/15 text-success"
                          : tone === "accent"
                          ? "bg-accent/15 text-accent"
                          : "bg-white/5 text-muted"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-[11px] text-muted/70">
                Illustrative preview of your client dashboard
              </p>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-3 rounded-card border border-border bg-surface/50 p-7 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-muted">
              Your profile already lives in the same secure portal our application
              team works from — so what you enter is exactly what gets used.
            </p>
            <a
              href={site.portalUrl}
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-2"
            >
              Open the portal
            </a>
          </div>
        </Reveal>
      </Section>

      <CTASection />
    </>
  );
}
