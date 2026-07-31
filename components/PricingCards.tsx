"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import Icon from "./Icon";
import { site, plans, guarantee } from "@/lib/content";

type Term = "4" | "8";

export default function PricingCards({
  showGuarantee = true,
}: {
  showGuarantee?: boolean;
}) {
  const [term, setTerm] = useState<Term>("4");

  return (
    <div>
      {/* 4 vs 8 week term switch */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex gap-1 rounded-full border border-border bg-surface p-1">
          {(["4", "8"] as Term[]).map((t) => {
            const active = term === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-navy text-white" : "text-muted hover:text-ink"
                }`}
              >
                {t} weeks
                {t === "8" && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-navy">
                    Save 10%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, i) => (
          <Reveal as="div" key={plan.name} delay={i * 80}>
            <div
              className={`relative flex h-full flex-col rounded-card border p-7 ${
                plan.featured
                  ? "glow-accent border-accent/60 bg-surface"
                  : "border-border bg-surface"
              }`}
            >
              {plan.badge && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    plan.featured ? "bg-accent text-navy" : "bg-navy text-accent"
                  }`}
                >
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg font-bold text-ink">{plan.name}</h3>
              <p className="mt-1 min-h-[40px] text-sm text-muted">{plan.blurb}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-ink">
                  {plan.perWeek[term]}
                </span>
                <span className="mb-1 text-sm text-muted">/ week</span>
              </div>
              <div className="mt-1 text-xs font-semibold text-accent-deep">
                {plan.total[term]}
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.rollUp && (
                  <li className="text-sm font-bold text-navy">{plan.rollUp}</li>
                )}
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-ink/90">
                    <span className="mt-0.5 shrink-0 text-accent-deep">
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
                    ? "bg-accent text-navy hover:bg-accent-2"
                    : "bg-navy text-white hover:bg-navy-2"
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
          <div className="mt-8 flex flex-col items-start gap-4 rounded-card border border-accent/40 bg-accent/[0.06] p-6 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-deep">
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
