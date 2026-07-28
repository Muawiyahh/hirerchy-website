"use client";

import { useEffect, useState } from "react";

/**
 * Counts a number up to its final value. Accepts the display string as-is
 * ("120", "40 hours", "95%", "108 days") — the leading number animates and
 * whatever trails it is kept verbatim.
 *
 * `trigger="load"` starts shortly after mount (hero); `trigger="inview"` waits
 * until the element is scrolled into view (stat bands).
 */
export default function CountUp({
  value,
  duration = 2400,
  trigger = "inview",
  className = "",
}: {
  value: string;
  duration?: number;
  trigger?: "load" | "inview";
  className?: string;
}) {
  const [node, setNode] = useState<HTMLSpanElement | null>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    // Parse inside the effect: `value.match()` returns a fresh array on every
    // render, so holding it in a dependency would restart the count endlessly.
    const match = value.match(/^([\d,.]+)(.*)$/);
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const numStr = match[1].replace(/,/g, "");
    const target = parseFloat(numStr);
    const suffix = match[2];
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const useComma = value.includes(",");
    if (Number.isNaN(target)) return;

    let frame = 0;
    let cancelled = false;

    const run = () => {
      let start: number | null = null;
      const tick = (ts: number) => {
        if (cancelled) return;
        if (start === null) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const current = target * (1 - Math.pow(1 - p, 3));
        setText(
          (useComma ? Math.round(current).toLocaleString("en-US") : current.toFixed(decimals)) +
            suffix
        );
        if (p < 1) frame = requestAnimationFrame(tick);
        else setText(value);
      };
      setText(`${(0).toFixed(decimals)}${suffix}`);
      frame = requestAnimationFrame(tick);
    };

    if (trigger === "load") {
      const t = setTimeout(run, 250);
      return () => {
        cancelled = true;
        clearTimeout(t);
        cancelAnimationFrame(frame);
      };
    }

    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [node, value, duration, trigger]);

  return (
    <span ref={setNode} className={className}>
      {text}
    </span>
  );
}
