"use client";

import { createElement, useEffect, useState, type ReactNode } from "react";

/**
 * Fades + lifts its children into view on scroll. Pure IntersectionObserver +
 * CSS (see `.reveal` in globals.css) — no animation library. Respects
 * prefers-reduced-motion automatically via the CSS guard.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  // Callback ref (state) rather than a ref object — the element is a dependency
  // of the observer effect, and reading ref.current during render is disallowed.
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node]);

  return createElement(
    as,
    {
      ref: setNode,
      className: `reveal ${visible ? "is-visible" : ""} ${className}`,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
}
