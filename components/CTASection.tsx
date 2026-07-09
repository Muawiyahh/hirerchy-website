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
          <div className="relative overflow-hidden rounded-[28px] bg-navy px-6 py-16 text-center shadow-[0_30px_70px_-30px_rgba(15,31,61,0.6)] sm:px-12 sm:py-20">
            <div className="bg-grid-navy pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute left-1/2 top-[-30%] h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
            <div className="relative">
              <div className="mx-auto mb-6 w-fit">
                <BrandMark size={48} onDark />
              </div>
              <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                {sub}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href={site.portalUrl} external variant="gold" size="lg">
                  Get started
                </Button>
                <Button href="/free-review" variant="onDark" size="lg">
                  Get a free resume review
                </Button>
              </div>
              <p className="mt-5 text-xs text-white/50">
                No commitment to see your free review · Cancel your plan anytime
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
