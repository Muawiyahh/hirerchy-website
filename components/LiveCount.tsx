"use client";

import { useEffect, useState } from "react";
import { liveCount } from "@/lib/content";

/**
 * The running application total in the strip under the navbar. The real number
 * lives in a published Google Sheet (first cell of the CSV); if that fetch
 * fails for any reason the fallback baked into the content file stays on screen,
 * so the strip never renders empty.
 */
export default function LiveCount() {
  const [text, setText] = useState(liveCount.fallback);

  useEffect(() => {
    let alive = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    fetch(liveCount.csvUrl)
      .then((r) => r.text())
      .then((csv) => {
        const target = parseFloat(csv.trim().split(/\r?\n/)[0].split(",")[0]);
        if (!alive || Number.isNaN(target)) return;

        const final = `${Math.round(target).toLocaleString("en-US")}+`;
        if (reduced) {
          setText(final);
          return;
        }

        // Count up from zero — cubic ease-out over 3.4s.
        const duration = 3400;
        let start: number | null = null;
        const tick = (ts: number) => {
          if (!alive) return;
          if (start === null) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setText(`${Math.round(target * eased).toLocaleString("en-US")}+`);
          if (p < 1) requestAnimationFrame(tick);
          else setText(final);
        };
        requestAnimationFrame(tick);
      })
      .catch(() => {
        /* keep the fallback */
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <span
      className="font-display text-[17px] font-extrabold tabular-nums tracking-[0.01em] text-accent-2 sm:text-[22px]"
      style={{ textShadow: "0 0 14px rgba(224,182,94,0.55)" }}
    >
      {text}
    </span>
  );
}
