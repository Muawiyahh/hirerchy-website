/** Hirerchy "H" brand mark — ported from the client portal so the website,
 *  portal and extension all share the exact same logo. */
export default function BrandMark({
  size = 34,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="40" height="40" rx="11" fill="#1a1c35" />
      <path
        d="M13 11v18M27 11v18M13 20h14"
        stroke="#7c5cfc"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  size = "lg",
  withMark = true,
}: {
  size?: "sm" | "lg";
  withMark?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {withMark && <BrandMark size={size === "lg" ? 34 : 28} />}
      <span
        className={`font-extrabold tracking-[-0.02em] text-ink ${
          size === "lg" ? "text-xl" : "text-lg"
        }`}
      >
        Hirerchy
      </span>
    </span>
  );
}
