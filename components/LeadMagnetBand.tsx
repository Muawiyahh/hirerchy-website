import Reveal from "./Reveal";
import Icon from "./Icon";
import { Button } from "./ui";

/** Full-bleed navy band — keeps the light/navy alternation unbroken. */
export default function LeadMagnetBand() {
  return (
    <section className="relative overflow-hidden bg-navy px-5 py-16 sm:px-8">
      <div className="bg-grid-navy pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/40 sm:flex">
                <Icon name="doc" size={22} />
              </span>
              <div>
                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  Not sure yet? Get a free resume review.
                </h3>
                <p className="mt-1 max-w-xl text-sm text-white/70">
                  Send us your resume and we&apos;ll tell you exactly what&apos;s
                  holding you back from callbacks — no commitment, no payment.
                </p>
              </div>
            </div>
            <Button href="/free-review" variant="gold" size="lg" className="shrink-0">
              Get my free review
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
