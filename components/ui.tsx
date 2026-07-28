import Link from "next/link";
import type { ReactNode } from "react";

/* ── Page section wrapper ─────────────────────────────────────────────────────
   80px of vertical rhythm and a hairline rule between bands. `tone="navy"`
   turns the whole band dark (used for the trust wall and the numbers band). */
export function Section({
  children,
  className = "",
  id,
  tone = "light",
  divider = true,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "navy";
  divider?: boolean;
}) {
  const isNavy = tone === "navy";
  return (
    <section
      id={id}
      className={`py-20 ${isNavy ? "bg-navy" : ""} ${
        divider ? (isNavy ? "border-b border-accent-2/20" : "border-b border-border") : ""
      } ${className}`}
    >
      <Wrap>{children}</Wrap>
    </section>
  );
}

/** The 1080px content column every section shares. */
export function Wrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1080px] px-6 ${className}`}>{children}</div>;
}

/* ── Section eyebrow ──────────────────────────────────────────────────────────
   Not a small kicker — on this site the eyebrow is the largest text in the
   section, set in gold display caps above a smaller heading. */
export function Eyebrow({
  children,
  onDark = false,
  className = "",
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`font-display text-[26px] font-extrabold uppercase leading-[1.1] wide:text-[36px] ${
        onDark ? "text-accent-2" : "text-accent"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ── Section heading block ────────────────────────────────────────────────── */
export function SectionHead({
  eyebrow,
  title,
  sub,
  onDark = false,
  className = "",
}: {
  eyebrow?: string;
  title?: ReactNode;
  sub?: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={`mb-12 max-w-[64ch] ${className}`}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      {title && (
        <h2
          className={`mt-[18px] text-[22px] font-semibold leading-[1.2] tracking-[-0.005em] wide:text-[26px] ${
            onDark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
      )}
      {sub && (
        <p className={`mt-4 text-base ${onDark ? "text-[#c7d0e0]" : "text-muted"}`}>{sub}</p>
      )}
    </div>
  );
}

/* ── Buttons (links) ──────────────────────────────────────────────────────── */
type ButtonProps = {
  href: string;
  children: ReactNode;
  /** primary = navy fill · gold = gold fill · ghost = ink outline */
  variant?: "primary" | "gold" | "ghost";
  external?: boolean; // render a plain <a> (full navigation) instead of <Link>
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: ButtonProps) {
  // No border-colour in `base` — it would tie with the variant's and let source
  // order decide, which is how the ghost outline goes missing.
  const base =
    "font-display inline-block rounded-md border px-6 py-[13px] text-[14.5px] font-semibold transition-all duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[3px] hover:scale-[1.03] hover:shadow-[0_12px_22px_rgba(11,31,63,0.16)]";
  const variants = {
    primary: "border-navy bg-navy text-bg hover:border-navy-2 hover:bg-navy-2",
    gold: "border-accent bg-accent text-navy hover:border-accent-2 hover:bg-accent-2",
    ghost: "border-ink bg-transparent text-ink hover:bg-ink hover:text-bg",
  };
  const cls = `${base} ${variants[variant]} ${className}`;

  if (external || href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
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

/* ── Inner-page hero header (legal pages) ─────────────────────────────────── */
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
    <section className="border-b border-border py-16">
      <Wrap>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-[18px] text-[26px] font-semibold leading-[1.2] tracking-[-0.005em] text-ink wide:text-[32px]">
          {title}
        </h1>
        {sub && <p className="mt-4 max-w-[64ch] text-base text-muted">{sub}</p>}
      </Wrap>
    </section>
  );
}

/* ── Surface card ─────────────────────────────────────────────────────────── */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border border-border bg-surface ${className}`}>{children}</div>
  );
}
