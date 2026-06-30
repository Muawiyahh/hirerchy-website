import Reveal from "./Reveal";
import { Button } from "./ui";
import BrandMark from "./BrandMark";
import { site } from "@/lib/content";

export default function CTASection({
  title = "Stop applying. Start interviewing.",
  sub = "Spend your evenings preparing for interviews — not filling out the same form for the hundredth time. We'll take it from here.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="glow-accent relative overflow-hidden rounded-[28px] border border-accent/30 bg-gradient-to-b from-surface to-surface-2 px-6 py-16 text-center sm:px-12 sm:py-20">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative">
              <div className="mx-auto mb-6 w-fit">
                <BrandMark size={48} />
              </div>
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                {sub}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href={site.portalUrl} external size="lg">
                  Get started
                </Button>
                <Button href="/free-review" variant="ghost" size="lg">
                  Get a free resume review
                </Button>
              </div>
              <p className="mt-5 text-xs text-muted">
                No commitment to see your free review · Cancel your plan anytime
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
