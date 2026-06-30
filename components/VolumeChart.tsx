"use client";

import { useEffect, useRef, useState } from "react";
import { weeklyVolume } from "@/lib/content";

/** Animated bar chart of weekly application volume (CSS-only, no chart lib). */
export default function VolumeChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const max = Math.max(...weeklyVolume.map((w) => w.applications));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-card border border-border bg-surface/60 p-6 sm:p-8">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-bold text-ink">Applications sent per week</h3>
        <span className="text-xs text-muted">last 8 weeks</span>
      </div>
      <div className="mt-8 flex h-52 items-end justify-between gap-2 sm:gap-3">
        {weeklyVolume.map((w, i) => (
          <div key={w.week} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-accent-2 to-accent transition-[height] duration-700 ease-out"
                style={{
                  height: shown ? `${(w.applications / max) * 100}%` : "0%",
                  transitionDelay: `${i * 70}ms`,
                }}
                title={`${w.applications} applications`}
              />
            </div>
            <span className="text-[10px] font-medium text-ink/80">{w.applications}</span>
            <span className="text-[10px] text-muted">{w.week}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
