"use client";

import { useEffect, useState } from "react";
import { weeklyVolume } from "@/lib/content";

/** Height of the tallest bar, in px. Bars are sized in pixels rather than as a
 *  percentage of their parent: a percentage height needs a definite parent
 *  height, and inside a flex column that can resolve to zero — which collapsed
 *  the whole chart to an empty box. */
const TRACK = 180;

export default function VolumeChart() {
  const [grown, setGrown] = useState(false);
  const max = Math.max(...weeklyVolume.map((w) => w.applications), 1);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Always settle inside a frame — never synchronously in the effect body.
    // Full motion takes two: one to paint at zero, one to transition up.
    const id = requestAnimationFrame(() =>
      reduced ? setGrown(true) : requestAnimationFrame(() => setGrown(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="rounded-card border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-bold text-ink">Applications sent per week</h3>
        <span className="text-xs text-muted">last 8 weeks</span>
      </div>

      <div
        className="mt-8 flex items-end justify-between gap-2 sm:gap-3"
        style={{ height: TRACK + 46 }}
      >
        {weeklyVolume.map((w, i) => (
          <div key={w.week} className="flex flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[11px] font-bold tabular-nums text-ink">
              {w.applications}
            </span>
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-accent-2 to-accent transition-[height] duration-700 ease-out motion-reduce:transition-none"
              style={{
                height: grown ? Math.max(4, (w.applications / max) * TRACK) : 0,
                transitionDelay: `${i * 70}ms`,
              }}
              title={`${w.applications} applications`}
            />
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
