"use client";

import { useState } from "react";
import { Section, SectionHead } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { faqs } from "@/lib/content";

/** Accordion — one panel open at a time, first one open on arrival. */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <Reveal>
        <SectionHead
          eyebrow="FAQ"
          title="Questions, answered."
          sub="The things people ask before they hand their job search over to someone else."
        />
      </Reveal>

      <Reveal className="divide-y divide-border overflow-hidden rounded-[10px] border border-border bg-surface">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                >
                  <span className="text-[15px] font-bold text-ink">{item.q}</span>
                  <span
                    className={`shrink-0 text-accent transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={`faq-panel-${i}`}
                className={`grid overflow-hidden px-5 transition-all duration-300 sm:px-6 ${
                  isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <p className="max-w-[70ch] text-[14.5px] text-muted">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </Reveal>
    </Section>
  );
}
