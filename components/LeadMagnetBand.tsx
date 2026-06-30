import Reveal from "./Reveal";
import Icon from "./Icon";
import { Button } from "./ui";

export default function LeadMagnetBand() {
  return (
    <section className="px-5 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-card border border-border bg-surface/60 p-7 text-center sm:flex-row sm:items-center sm:justify-between sm:p-9 sm:text-left">
            <div className="flex items-start gap-4">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent ring-1 ring-accent/25 sm:flex">
                <Icon name="doc" size={22} />
              </span>
              <div>
                <h3 className="text-xl font-bold text-ink">
                  Not sure yet? Get a free resume review.
                </h3>
                <p className="mt-1 max-w-xl text-sm text-muted">
                  Send us your resume and we&apos;ll tell you exactly what&apos;s
                  holding you back from callbacks — no commitment, no payment.
                </p>
              </div>
            </div>
            <Button href="/free-review" size="lg" className="shrink-0">
              Get my free review
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
