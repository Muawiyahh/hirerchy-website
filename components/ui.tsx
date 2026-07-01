import Link from "next/link";
import type { ReactNode } from "react";

/* ── Page section wrapper (consistent max-width + vertical rhythm) ─────────── */
export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

/* ── Small uppercase eyebrow label ────────────────────────────────────────── */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
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
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{sub}</p>}
    </div>
  );
}

/* ── Buttons (links) ──────────────────────────────────────────────────────── */
type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "soft";
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
      "bg-accent text-white hover:bg-accent-2 shadow-[0_10px_30px_-8px_rgba(124,92,252,0.6)] hover:shadow-[0_14px_40px_-8px_rgba(124,92,252,0.75)] hover:-translate-y-0.5",
    soft: "bg-accent/12 text-ink ring-1 ring-accent/30 hover:bg-accent/20",
    ghost:
      "text-ink ring-1 ring-border hover:ring-accent/50 hover:bg-white/5",
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
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-[-40%] h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px]" />
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
      className={`rounded-card border border-border bg-surface/70 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}
