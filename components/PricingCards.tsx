import Reveal from "./Reveal";
import Icon from "./Icon";
import { site, plans, guarantee } from "@/lib/content";

export default function PricingCards({
  showGuarantee = true,
}: {
  showGuarantee?: boolean;
}) {
  return (
    <div>
      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <Reveal as="div" key={plan.name} delay={i * 80}>
            <div
              className={`relative flex h-full flex-col rounded-card border p-7 ${
                plan.featured
                  ? "glow-accent border-accent/60 bg-surface"
                  : "border-border bg-surface"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-navy">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">{plan.blurb}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-ink">
                  {plan.price}
                </span>
                <span className="mb-1 text-sm text-muted">{plan.cadence}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-ink/90">
                    <span className="mt-0.5 text-accent-deep">
                      <Icon name="check" size={16} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={site.portalUrl}
                className={`mt-7 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all ${
                  plan.featured
                    ? "bg-navy text-white hover:bg-navy-2"
                    : "text-ink ring-1 ring-border hover:ring-navy/40 hover:bg-navy/[0.04]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      {showGuarantee && (
        <Reveal>
          <div className="mt-6 flex flex-col items-start gap-4 rounded-card border border-success/30 bg-success/5 p-6 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
              <Icon name="shield" size={24} />
            </span>
            <div>
              <h4 className="text-base font-bold text-ink">{guarantee.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-muted">{guarantee.body}</p>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
