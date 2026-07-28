"use client";

import { useEffect, useState } from "react";
import { weeklyVolume } from "@/lib/content";

/** Weekly application volume — CSS-only bars that grow once scrolled into view. */
export default function VolumeChart() {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const max = Math.max(...weeklyVolume.map((w) => w.applications));

  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node]);

  return (
    <div
      ref={setNode}
      className="rounded-[10px] border border-border bg-surface p-6 sm:p-8"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-bold text-ink">Applications sent per week</h3>
        <span className="text-xs text-muted">last 8 weeks</span>
      </div>
      <div className="mt-8 flex h-52 items-end justify-between gap-2 sm:gap-3">
        {weeklyVolume.map((w, i) => (
          <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-accent to-accent-2 transition-[height] duration-700 ease-out"
                style={{
                  height: shown ? `${(w.applications / max) * 100}%` : "0%",
                  transitionDelay: `${i * 70}ms`,
                }}
                title={`${w.applications} applications`}
              />
            </div>
            <span className="font-display text-[11px] font-bold text-ink">
              {w.applications}
            </span>
            <span className="text-[10px] text-muted">{w.week}</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-muted">
        Illustrative weekly volume for a Pro client. Your own totals appear in your tracker.
      </p>
    </div>
  );
}
