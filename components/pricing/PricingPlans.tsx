"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { plans, site } from "@/lib/content";

type Term = "4" | "8";

/* Per-tier colourway. Rookie is plain; Pro is the cream "most popular"; Champion
   goes navy; Legend gets the champagne foil with a shine sweep on hover. */
const TIERS = [
  {
    card: "bg-surface border-border border-t-muted",
    tierNum: "text-muted",
    tagline: "text-muted",
    per: "text-muted",
    total: "text-muted",
    label: "text-navy bg-navy/[0.06] border-navy",
    feature: "text-ink",
    check: "before:text-muted",
    rollUp: "text-navy",
    cta: "border-navy text-navy hover:bg-navy hover:text-white",
    badge: "",
  },
  {
    card: "bg-cream border-accent/35 border-t-accent",
    tierNum: "text-accent",
    tagline: "text-muted",
    per: "text-muted",
    total: "text-muted",
    label: "text-[#7a5613] bg-accent/[0.16] border-accent",
    feature: "text-ink",
    check: "before:text-accent",
    rollUp: "text-navy",
    cta: "bg-accent border-accent text-navy hover:bg-accent-2",
    badge: "bg-accent text-navy",
  },
  {
    card: "bg-navy border-navy border-t-accent-2 text-white climb:pt-10",
    tierNum: "text-accent-2",
    tagline: "text-[#c7d0e0]",
    per: "text-[#c7d0e0]",
    total: "text-[#c7d0e0]",
    label: "text-accent-2 bg-accent-2/[0.14] border-accent-2",
    feature: "text-[#edf0f6]",
    check: "before:text-accent-2",
    rollUp: "text-white",
    cta: "bg-accent-2 border-accent-2 text-navy hover:bg-white",
    badge: "bg-accent-2 text-navy",
  },
  {
    card: "bg-[linear-gradient(135deg,#fbf8f1_0%,#f1e8d2_55%,#fbf8f1_100%)] border-accent/45 border-t-accent climb:pt-10",
    tierNum: "text-accent",
    tagline: "text-muted",
    per: "text-muted",
    total: "text-muted",
    label: "text-[#8a6a1f] bg-accent/[0.16] border-accent",
    feature: "text-ink",
    check: "before:text-accent",
    rollUp: "text-navy",
    cta: "bg-accent border-accent text-navy hover:bg-accent-2",
    badge: "bg-accent text-navy",
  },
];

/* The staircase offsets — Rookie sits lowest, Legend at the top of the climb. */
const CLIMB = ["climb:translate-y-[66px]", "climb:translate-y-[44px]", "climb:translate-y-[22px]", ""];

export default function PricingPlans() {
  const [term, setTerm] = useState<Term>("4");

  return (
    <>
      <Reveal className="mb-2 inline-flex gap-1 rounded-full border border-border bg-bg p-1">
        {(["4", "8"] as Term[]).map((t) => {
          const active = term === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTerm(t)}
              aria-pressed={active}
              className={`font-display flex items-center gap-2 rounded-full px-[18px] py-[9px] text-[13.5px] font-bold transition-colors ${
                active ? "bg-navy text-white" : "text-muted"
              }`}
            >
              {t} Weeks
              {t === "8" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold text-navy ${
                    active ? "bg-accent" : "bg-accent-2"
                  }`}
                >
                  Save 10%
                </span>
              )}
            </button>
          );
        })}
      </Reveal>

      <div className="relative grid gap-6 pt-0 sm:grid-cols-2 climb:grid-cols-4 climb:items-end climb:gap-5 climb:pt-10">
        {/* dashed rail the cards climb along — desktop only */}
        <div
          aria-hidden="true"
          className="absolute left-[4%] right-[4%] top-0 hidden h-0.5 translate-y-[46px] -rotate-[3.2deg] bg-[repeating-linear-gradient(90deg,var(--color-accent)_0_10px,transparent_10px_18px)] climb:block"
        />

        {plans.map((plan, i) => {
          const tier = TIERS[i];
          return (
            <Reveal
              key={plan.name}
              delay={(i % 4) * 70}
              className={`group relative z-[1] flex flex-col rounded-xl border border-t-4 px-7 py-8 transition-shadow duration-[250ms] hover:shadow-[0_14px_30px_rgba(11,31,63,0.10)] ${tier.card} ${CLIMB[i]}`}
            >
              {/* Legend's foil sweep. The clip lives on this wrapper rather than
                  the card — overflow-hidden on the card would cut off the badge
                  that hangs over its top edge. */}
              {i === 3 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
                >
                  <span className="absolute -left-[60%] top-0 h-full w-2/5 -skew-x-12 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.65),transparent)] transition-[left] duration-700 group-hover:left-[140%]" />
                </span>
              )}

              {plan.badge && (
                <span
                  className={`font-display absolute -top-3.5 right-6 rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.04em] ${tier.badge}`}
                >
                  {plan.badge}
                </span>
              )}

              <div className={`font-display mb-3.5 text-[12.5px] font-bold tracking-[0.06em] ${tier.tierNum}`}>
                {plan.tier}
              </div>
              <h3 className="mb-1.5 text-xl font-bold">{plan.name}</h3>
              <p className={`mb-5 text-sm ${tier.tagline}`}>{plan.tagline}</p>

              <div className="mb-1 flex items-baseline gap-1.5">
                <span className="font-display text-[40px] font-extrabold">{plan.perWeek[term]}</span>
                <span className={`text-[13.5px] ${tier.per}`}>/ week</span>
              </div>
              <div className={`mb-5 mt-0.5 text-[12.5px] ${tier.total}`}>{plan.total[term]}</div>

              <div
                className={`font-display mb-4 inline-block self-start rounded-[7px] border-[1.5px] px-3.5 py-1.5 text-[13px] font-extrabold ${tier.label}`}
              >
                What you get
              </div>

              <ul className="mb-[26px] flex-1">
                {plan.rollUp && (
                  <li
                    className={`font-display mb-3 text-[13.5px] font-extrabold tracking-[0.02em] ${tier.rollUp}`}
                  >
                    {plan.rollUp}
                  </li>
                )}
                {plan.features.map((f) => {
                  const [text, tag] = f.split("|");
                  return (
                    <li
                      key={f}
                      className={`relative mb-3 pl-[22px] text-sm before:absolute before:left-0 before:font-bold before:content-['✓'] ${tier.feature} ${tier.check}`}
                    >
                      {text}
                      {tag && (
                        <span className="font-display ml-1 inline-block rounded-full border border-[rgba(34,178,76,0.4)] bg-[rgba(34,178,76,0.14)] px-2 py-0.5 align-middle text-[10.5px] font-extrabold uppercase tracking-[0.03em] text-[#1e7145]">
                          {tag}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <a
                href={site.portalUrl}
                className={`font-display rounded-lg border-[1.5px] p-3 text-center text-sm font-bold transition-colors ${tier.cta}`}
              >
                Start your intake
              </a>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
