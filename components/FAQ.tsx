"use client";

import { useState } from "react";
import { Section, Heading } from "./ui";
import { faqs } from "@/lib/content";

export default function FAQ({ withHeading = true }: { withHeading?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="border-t border-border/60">
      {withHeading && (
        <Heading center eyebrow="FAQ" title="Questions, answered" />
      )}

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-card border border-border bg-surface">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-[15px] font-semibold text-ink">{item.q}</span>
                <span
                  className={`shrink-0 text-accent-deep transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              <div
                className={`grid overflow-hidden px-6 transition-all duration-300 ${
                  isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0">
                  <p className="text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
