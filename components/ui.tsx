import Link from "next/link";
import type { ReactNode } from "react";

/* ── Page section wrapper (consistent max-width + vertical rhythm) ─────────── */
/* `tone="navy"` turns the whole band dark — used to alternate white/navy down
   the page so the site never reads as a wall of white. */
export function Section({
  children,
  className = "",
  id,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "navy";
}) {
  const isNavy = tone === "navy";
  return (
    <section
      id={id}
      className={`relative py-20 sm:py-28 ${isNavy ? "overflow-hidden bg-navy" : ""} ${className}`}
    >
      {isNavy && <div className="bg-grid-navy pointer-events-none absolute inset-0" />}
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/* ── Small uppercase eyebrow label ────────────────────────────────────────── */
/* On light we use the deeper gold — bright gold fails contrast at this text
   size. On navy, bright gold is the right call (~7:1). */
export function Eyebrow({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${
        onDark ? "text-accent" : "text-accent-deep"
      }`}
    >
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/* ── Section heading block ────────────────────────────────────────────────── */
export function Heading({
  eyebrow,
  title,
  sub,
  center = false,
  onDark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
  onDark?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            onDark ? "text-white/70" : "text-muted"
          }`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ── Buttons (links) ──────────────────────────────────────────────────────── */
type ButtonProps = {
  href: string;
  children: ReactNode;
  /** primary = navy · gold = gold fill · ghost = outlined · onDark = outlined on navy */
  variant?: "primary" | "gold" | "ghost" | "soft" | "onDark";
  size?: "md" | "lg";
  external?: boolean; // render a plain <a> (full navigation) instead of client-side <Link>
  newTab?: boolean; // open in a new tab (only meaningful with external)
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  newTab = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  const sizes = {
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-[15px]",
  };
  const variants = {
    primary:
      "bg-navy text-white hover:bg-navy-2 shadow-[0_10px_30px_-10px_rgba(15,31,61,0.5)] hover:shadow-[0_14px_36px_-10px_rgba(15,31,61,0.6)] hover:-translate-y-0.5",
    gold: "bg-accent text-navy hover:bg-accent-2 hover:text-white shadow-[0_10px_30px_-10px_rgba(201,162,39,0.7)] hover:-translate-y-0.5",
    soft: "bg-accent/15 text-ink ring-1 ring-accent/40 hover:bg-accent/25",
    ghost: "text-ink ring-1 ring-border hover:ring-navy/40 hover:bg-navy/[0.04]",
    onDark: "text-white ring-1 ring-white/30 hover:bg-white/10 hover:ring-white/50",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ── Inner-page hero header ───────────────────────────────────────────────── */
export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[-40%] h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-20">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {sub && (
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}

/* ── Surface card ─────────────────────────────────────────────────────────── */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-border bg-surface shadow-[0_1px_3px_rgba(15,31,61,0.04),0_10px_30px_-16px_rgba(15,31,61,0.15)] ${className}`}
    >
      {children}
    </div>
  );
}
