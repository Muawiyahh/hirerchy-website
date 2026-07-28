import type { Metadata } from "next";
import { PageHeader, Section, SectionHead, Button, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import Process from "@/components/home/Process";
import IntakeCTA from "@/components/home/IntakeCTA";
import { portalSteps, included, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From intake to interviews — exactly how Hirerchy runs your job search for you, week after week, and what you can see in your portal.",
};

/* Mirrors the real tracker table in the client portal, so what people see here
   is what they get after signing up. */
const PREVIEW_ROWS: [string, string, string, keyof typeof STATUS][] = [
  ["Ericsson", "Product Designer", "12 Jul", "Interview"],
  ["JB Hunt", "Operations Analyst", "12 Jul", "Applied"],
  ["Aon", "Risk Consultant", "11 Jul", "Screening"],
  ["Sanofi", "Data Analyst", "11 Jul", "Applied"],
  ["West Monroe", "Associate Consultant", "10 Jul", "Offer"],
];

const STATUS = {
  Applied: "bg-navy/[0.07] text-ink",
  Screening: "bg-accent/15 text-accent",
  Interview: "bg-success/10 text-success",
  Offer: "bg-success/15 text-success",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="You set it up once. We run it every week."
        sub="No bots spraying generic applications. A real team doing real, targeted work under your name — and you can see all of it."
      />

      <Process />

      <Section id="portal">
        <Reveal>
          <SectionHead
            eyebrow="Inside the portal"
            title="What you actually do (it is not much)"
            sub="Everything starts in your client portal. Here is the full flow from signup to interviews."
          />
        </Reveal>

        <div className="grid gap-10 wide:grid-cols-[1.05fr_1fr] wide:items-start">
          <ol className="relative space-y-7 border-l border-border pl-8">
            {portalSteps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 4) * 70} className="relative">
                <span className="font-display absolute -left-[45px] flex h-[34px] w-[34px] items-center justify-center rounded-full bg-navy text-sm font-bold text-bg">
                  {i + 1}
                </span>
                <h3 className="text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.body}</p>
              </Reveal>
            ))}
          </ol>

          {/* live tracker preview */}
          <Reveal delay={120}>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="text-accent">
                    <Icon name="chart" size={18} />
                  </span>
                  Application tracker
                </div>
                <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
                  live
                </span>
              </div>

              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-border bg-surface-2 text-[10.5px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Company</th>
                    <th className="px-4 py-2 font-semibold">Role</th>
                    <th className="px-4 py-2 font-semibold">Listing</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PREVIEW_ROWS.map(([co, role, , status]) => (
                    <tr key={co} className="even:bg-surface-2/50">
                      <td className="px-4 py-2 font-medium text-ink">{co}</td>
                      <td className="px-4 py-2 text-ink/80">{role}</td>
                      <td className="px-4 py-2 font-medium text-accent">View</td>
                      <td className="px-4 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="border-t border-border px-4 py-3 text-center text-[11px] text-muted">
                Illustrative preview — your real tracker lives in the portal
              </p>
            </Card>
          </Reveal>
        </div>

        <Reveal className="mt-10 flex flex-col items-start gap-4 rounded-[10px] border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Your profile lives in the same secure portal our application team works from — so
            what you enter is exactly what gets used.
          </p>
          <Button href={site.portalUrl} external className="shrink-0">
            Open the portal
          </Button>
        </Reveal>
      </Section>

      <Section id="included">
        <Reveal>
          <SectionHead
            eyebrow="What is included"
            title="Everything that happens once you are on board."
            sub="Every plan gets the resume rebuild and the tracker from day one. What changes higher up is volume and how much of the strategy is handled for you."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 wide:grid-cols-3">
          {included.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 70} className="bg-surface px-6 py-[30px]">
              <span className="text-accent">
                <Icon name={f.icon} size={22} />
              </span>
              <h3 className="mt-3.5 text-[17px] font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-[14.5px] text-muted">{f.body}</p>
              <span className="font-display mt-4 inline-block rounded-full bg-navy/[0.06] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-navy">
                {f.plans}
              </span>
            </Reveal>
          ))}
        </div>
      </Section>

      <IntakeCTA />
    </>
  );
}
